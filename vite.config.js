import { Readable } from 'node:stream';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const requiredFields = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'employer',
  'monthlyIncome',
  'amountNeeded',
  'duration',
  'bvn',
  'nin',
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

const adminSessionCookie = 'iou_admin_session';
const adminSessionDurationSeconds = 8 * 60 * 60;

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function readJsonBody(request, maxBytes = 4096) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBytes) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    request.on('error', reject);
  });
}

function parseCookies(request) {
  return Object.fromEntries(
    String(request.headers.cookie || '')
      .split(';')
      .map((cookie) => cookie.trim().split('='))
      .filter(([name]) => name)
      .map(([name, ...value]) => [name, decodeURIComponent(value.join('='))]),
  );
}

function signAdminSession(expiresAt, secret) {
  return createHmac('sha256', secret).update(String(expiresAt)).digest('hex');
}

function createAdminSession(secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + adminSessionDurationSeconds;
  return `${expiresAt}.${signAdminSession(expiresAt, secret)}`;
}

function hasValidAdminSession(request, secret) {
  if (!secret) return false;
  const session = parseCookies(request)[adminSessionCookie];
  if (!session) return false;
  const [expiresAtValue, signature] = session.split('.');
  const expiresAt = Number(expiresAtValue);
  if (!expiresAt || expiresAt <= Math.floor(Date.now() / 1000) || !signature) return false;
  return constantTimeEqual(signature, signAdminSession(expiresAt, secret));
}

function adminCookie(value, request, maxAge = adminSessionDurationSeconds) {
  const forwardedProtocol = String(request.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const secure = forwardedProtocol === 'https' || request.socket.encrypted;
  return `${adminSessionCookie}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

function adminAuthPlugin(env) {
  const attempts = new Map();
  const maxAttempts = 5;
  const attemptWindowMs = 15 * 60 * 1000;
  const password = String(env.ADMIN_PASSWORD || '');
  const sessionSecret = String(env.ADMIN_SESSION_SECRET || password);

  const handleRequest = async (request, response, next) => {
    const requestPath = request.url?.split('?')[0];
    if (!requestPath?.startsWith('/api/admin/')) return next();

    const configured = Boolean(password && sessionSecret);
    if (requestPath === '/api/admin/session' && request.method === 'GET') {
      return sendJson(response, 200, {
        authenticated: configured && hasValidAdminSession(request, sessionSecret),
        configured,
      });
    }

    if (requestPath === '/api/admin/login' && request.method === 'POST') {
      if (!configured) return sendJson(response, 503, { error: 'Admin access is not configured yet.' });

      const clientAddress = String(request.headers['x-forwarded-for'] || request.socket.remoteAddress || 'local').split(',')[0].trim();
      const previousAttempt = attempts.get(clientAddress);
      const activeAttempt = previousAttempt && Date.now() - previousAttempt.startedAt < attemptWindowMs
        ? previousAttempt
        : { count: 0, startedAt: Date.now() };

      if (activeAttempt.count >= maxAttempts) {
        return sendJson(response, 429, { error: 'Too many attempts. Please wait 15 minutes and try again.' });
      }

      try {
        const body = await readJsonBody(request);
        if (!constantTimeEqual(body.password || '', password)) {
          attempts.set(clientAddress, { ...activeAttempt, count: activeAttempt.count + 1 });
          return sendJson(response, 401, { error: 'The password you entered is incorrect.' });
        }

        attempts.delete(clientAddress);
        response.setHeader('Set-Cookie', adminCookie(createAdminSession(sessionSecret), request));
        return sendJson(response, 200, { authenticated: true });
      } catch {
        return sendJson(response, 400, { error: 'The sign-in request could not be read.' });
      }
    }

    if (requestPath === '/api/admin/logout' && request.method === 'POST') {
      response.setHeader('Set-Cookie', adminCookie('', request, 0));
      return sendJson(response, 200, { authenticated: false });
    }

    response.setHeader('Allow', requestPath === '/api/admin/session' ? 'GET' : 'POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  };

  return {
    name: 'iou-admin-auth',
    configureServer(server) {
      server.middlewares.use(handleRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleRequest);
    },
  };
}

function applicationEmailHtml(values) {
  const rows = [
    ['Name', `${values.firstName} ${values.lastName}`],
    ['Phone number', values.phone],
    ['Email address', values.email],
    ['Business/Employer', values.employer],
    ['Monthly income', `₦${values.monthlyIncome}`],
    ['Amount needed', `₦${values.amountNeeded}`],
    ['Duration', `${values.duration} months`],
    ['BVN', values.bvn],
    ['NIN', values.nin],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">
      <h1 style="font-size:24px">New IOU Finance loan application</h1>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        ${rows.map(([label, value]) => `
          <tr>
            <th style="border:1px solid #ddd;padding:10px;text-align:left;background:#f6f6f6">${escapeHtml(label)}</th>
            <td style="border:1px solid #ddd;padding:10px">${escapeHtml(value)}</td>
          </tr>`).join('')}
      </table>
      <p>The applicant's passport photograph is attached.</p>
    </div>`;
}

function applicationApiPlugin(env) {
  const handleRequest = async (request, response, next) => {
    if (request.url?.split('?')[0] !== '/api/applications') return next();
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return sendJson(response, 405, { error: 'Method not allowed.' });
    }

    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.APPLICATION_RECIPIENT_EMAIL) {
      return sendJson(response, 503, { error: 'Email delivery is not configured.' });
    }

    const contentLength = Number(request.headers['content-length'] || 0);
    if (contentLength > 7 * 1024 * 1024) {
      return sendJson(response, 413, { error: 'The application is too large.' });
    }

    try {
      const webRequest = new Request(`http://localhost${request.url}`, {
        method: 'POST',
        headers: request.headers,
        body: Readable.toWeb(request),
        duplex: 'half',
      });
      const formData = await webRequest.formData();
      const values = Object.fromEntries(requiredFields.map((field) => [field, String(formData.get(field) || '').trim()]));
      const missingField = requiredFields.find((field) => !values[field]);
      const passport = formData.get('passportPhotograph');

      if (missingField || !(passport instanceof File) || !passport.size) {
        return sendJson(response, 400, { error: 'Please complete every field and attach a passport photograph.' });
      }
      if (!/^\S+@\S+\.\S+$/.test(values.email)) {
        return sendJson(response, 400, { error: 'Please enter a valid email address.' });
      }
      if (!/^\d{11}$/.test(values.bvn) || !/^\d{11}$/.test(values.nin)) {
        return sendJson(response, 400, { error: 'BVN and NIN must each contain 11 digits.' });
      }
      if (!['image/jpeg', 'image/png'].includes(passport.type) || passport.size > 5 * 1024 * 1024) {
        return sendJson(response, 400, { error: 'The passport photograph must be a JPG or PNG smaller than 5MB.' });
      }

      const passportContent = Buffer.from(await passport.arrayBuffer()).toString('base64');
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `IOU Finance Applications <${env.RESEND_FROM_EMAIL}>`,
          to: [env.APPLICATION_RECIPIENT_EMAIL],
          reply_to: values.email,
          subject: `Loan application — ${values.firstName} ${values.lastName}`,
          html: applicationEmailHtml(values),
          attachments: [{ filename: passport.name || 'passport-photograph.jpg', content: passportContent }],
        }),
      });

      if (!resendResponse.ok) {
        const resendError = await resendResponse.json().catch(() => ({}));
        console.error('Resend rejected the application email:', resendError.message || resendResponse.statusText);
        return sendJson(response, 502, { error: 'We could not send your application right now. Please try again.' });
      }

      return sendJson(response, 200, { message: 'Your application has been submitted successfully.' });
    } catch (error) {
      console.error('Application submission failed:', error instanceof Error ? error.message : error);
      return sendJson(response, 500, { error: 'We could not submit your application right now. Please try again.' });
    }
  };

  return {
    name: 'iou-application-api',
    configureServer(server) {
      server.middlewares.use(handleRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleRequest);
    },
  };
}

function cmsImageUploadPlugin(env) {
  const allowedImageTypes = new Map([
    ['image/jpeg', '.jpg'],
    ['image/png', '.png'],
    ['image/webp', '.webp'],
  ]);

  const handleRequest = async (request, response, next) => {
    if (request.url?.split('?')[0] !== '/api/cms/images') return next();
    const sessionSecret = String(env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD || '');
    if (!hasValidAdminSession(request, sessionSecret)) {
      return sendJson(response, 401, { error: 'Your admin session has expired. Please sign in again.' });
    }
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return sendJson(response, 405, { error: 'Method not allowed.' });
    }

    const contentLength = Number(request.headers['content-length'] || 0);
    if (contentLength > 6 * 1024 * 1024) {
      return sendJson(response, 413, { error: 'The image must be 5MB or smaller.' });
    }

    try {
      const webRequest = new Request(`http://localhost${request.url}`, {
        method: 'POST',
        headers: request.headers,
        body: Readable.toWeb(request),
        duplex: 'half',
      });
      const formData = await webRequest.formData();
      const image = formData.get('image');
      const extension = image instanceof File ? allowedImageTypes.get(image.type) : null;

      if (!(image instanceof File) || !image.size || !extension || image.size > 5 * 1024 * 1024) {
        return sendJson(response, 400, { error: 'Use a JPG, PNG, or WebP image no larger than 5MB.' });
      }

      const uploadsDirectory = join(process.cwd(), 'public', 'uploads');
      const fileName = `${Date.now()}-${randomUUID()}${extension}`;
      await mkdir(uploadsDirectory, { recursive: true });
      await writeFile(join(uploadsDirectory, fileName), Buffer.from(await image.arrayBuffer()));
      return sendJson(response, 201, { url: `/uploads/${fileName}` });
    } catch (error) {
      console.error('CMS image upload failed:', error instanceof Error ? error.message : error);
      return sendJson(response, 500, { error: 'The image could not be saved. Please try again.' });
    }
  };

  return {
    name: 'iou-cms-image-upload',
    configureServer(server) {
      server.middlewares.use(handleRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleRequest);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    cacheDir: '.vite-cache',
    plugins: [applicationApiPlugin(env), adminAuthPlugin(env), cmsImageUploadPlugin(env), react()],
  };
});
