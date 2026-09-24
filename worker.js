const ADMIN_COOKIE = 'iou_admin_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const REQUIRED_APPLICATION_FIELDS = [
  'firstName', 'lastName', 'phone', 'email', 'employer',
  'monthlyIncome', 'amountNeeded', 'duration', 'bvn', 'nin',
];
const loginAttempts = new Map();

function json(payload, status = 200, headers = {}) {
  return Response.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseCookies(request) {
  return Object.fromEntries(
    String(request.headers.get('Cookie') || '')
      .split(';')
      .map((cookie) => cookie.trim().split('='))
      .filter(([name]) => name)
      .map(([name, ...value]) => [name, decodeURIComponent(value.join('='))]),
  );
}

function constantTimeEqual(left, right) {
  const leftValue = String(left);
  const rightValue = String(right);
  const length = Math.max(leftValue.length, rightValue.length);
  let difference = leftValue.length ^ rightValue.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (leftValue.charCodeAt(index) || 0) ^ (rightValue.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function signSession(expiresAt, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(expiresAt))));
}

async function createSession(secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  return `${expiresAt}.${await signSession(expiresAt, secret)}`;
}

async function hasValidSession(request, secret) {
  if (!secret) return false;
  const session = parseCookies(request)[ADMIN_COOKIE];
  if (!session) return false;
  const [expiresAtValue, signature] = session.split('.');
  const expiresAt = Number(expiresAtValue);
  if (!expiresAt || expiresAt <= Math.floor(Date.now() / 1000) || !signature) return false;
  return constantTimeEqual(signature, await signSession(expiresAt, secret));
}

function sessionCookie(value, maxAge = SESSION_DURATION_SECONDS) {
  return `${ADMIN_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

async function handleAdmin(request, env, path) {
  const password = String(env.ADMIN_PASSWORD || '');
  const sessionSecret = String(env.ADMIN_SESSION_SECRET || password);
  const configured = Boolean(password && sessionSecret);

  if (path === '/api/admin/session' && request.method === 'GET') {
    return json({ authenticated: configured && await hasValidSession(request, sessionSecret), configured });
  }
  if (path === '/api/admin/login' && request.method === 'POST') {
    if (!configured) return json({ error: 'Admin access is not configured yet.' }, 503);
    const address = request.headers.get('CF-Connecting-IP') || 'unknown';
    const previous = loginAttempts.get(address);
    const active = previous && Date.now() - previous.startedAt < 15 * 60 * 1000
      ? previous
      : { count: 0, startedAt: Date.now() };
    if (active.count >= 5) return json({ error: 'Too many attempts. Please wait 15 minutes and try again.' }, 429);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'The sign-in request could not be read.' }, 400);
    }
    if (!constantTimeEqual(body.password || '', password)) {
      loginAttempts.set(address, { ...active, count: active.count + 1 });
      return json({ error: 'The password you entered is incorrect.' }, 401);
    }
    loginAttempts.delete(address);
    return json(
      { authenticated: true },
      200,
      { 'Set-Cookie': sessionCookie(await createSession(sessionSecret)) },
    );
  }
  if (path === '/api/admin/logout' && request.method === 'POST') {
    return json({ authenticated: false }, 200, { 'Set-Cookie': sessionCookie('', 0) });
  }
  return json({ error: 'Method not allowed.' }, 405);
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
  return `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.5">
    <h1 style="font-size:24px">New IOU Finance loan application</h1>
    <table style="border-collapse:collapse;width:100%;max-width:680px">
      ${rows.map(([label, value]) => `<tr>
        <th style="border:1px solid #ddd;padding:10px;text-align:left;background:#f6f6f6">${escapeHtml(label)}</th>
        <td style="border:1px solid #ddd;padding:10px">${escapeHtml(value)}</td>
      </tr>`).join('')}
    </table>
    <p>The applicant's passport photograph is attached.</p>
  </div>`;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

async function handleApplication(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.APPLICATION_RECIPIENT_EMAIL) {
    return json({ error: 'Email delivery is not configured.' }, 503);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 7 * 1024 * 1024) return json({ error: 'The application is too large.' }, 413);

  try {
    const formData = await request.formData();
    const values = Object.fromEntries(
      REQUIRED_APPLICATION_FIELDS.map((field) => [field, String(formData.get(field) || '').trim()]),
    );
    const passport = formData.get('passportPhotograph');
    const missingField = REQUIRED_APPLICATION_FIELDS.find((field) => !values[field]);
    if (missingField || !(passport instanceof File) || !passport.size) {
      return json({ error: 'Please complete every field and attach a passport photograph.' }, 400);
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) return json({ error: 'Please enter a valid email address.' }, 400);
    if (!/^\d{11}$/.test(values.bvn) || !/^\d{11}$/.test(values.nin)) {
      return json({ error: 'BVN and NIN must each contain 11 digits.' }, 400);
    }
    if (!['image/jpeg', 'image/png'].includes(passport.type) || passport.size > MAX_IMAGE_BYTES) {
      return json({ error: 'The passport photograph must be a JPG or PNG smaller than 5MB.' }, 400);
    }

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
        attachments: [{
          filename: passport.name || 'passport-photograph.jpg',
          content: arrayBufferToBase64(await passport.arrayBuffer()),
        }],
      }),
    });
    if (!resendResponse.ok) {
      console.error('Resend rejected the application email:', await resendResponse.text());
      return json({ error: 'We could not send your application right now. Please try again.' }, 502);
    }
    return json({ message: 'Your application has been submitted successfully.' });
  } catch (error) {
    console.error('Application submission failed:', error);
    return json({ error: 'We could not submit your application right now. Please try again.' }, 500);
  }
}

async function handleImageUpload(request, env) {
  const sessionSecret = String(env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD || '');
  if (!await hasValidSession(request, sessionSecret)) {
    return json({ error: 'Your admin session has expired. Please sign in again.' }, 401);
  }
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!env.CMS_BUCKET) return json({ error: 'CMS image storage is not configured.' }, 503);

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 6 * 1024 * 1024) return json({ error: 'The image must be 5MB or smaller.' }, 413);

  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    const extension = image instanceof File ? extensions[image.type] : null;
    if (!(image instanceof File) || !image.size || !extension || image.size > MAX_IMAGE_BYTES) {
      return json({ error: 'Use a JPG, PNG, or WebP image no larger than 5MB.' }, 400);
    }

    const key = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    await env.CMS_BUCKET.put(key, image.stream(), {
      httpMetadata: { contentType: image.type, cacheControl: 'public, max-age=31536000, immutable' },
    });
    return json({ url: `/cms-images/${key}` }, 201);
  } catch (error) {
    console.error('CMS image upload failed:', error);
    return json({ error: 'The image could not be saved. Please try again.' }, 500);
  }
}

async function serveCmsImage(env, path) {
  if (!env.CMS_BUCKET) return new Response('Not found', { status: 404 });
  const key = decodeURIComponent(path.slice('/cms-images/'.length));
  if (!key || key.includes('..')) return new Response('Not found', { status: 404 });
  const object = await env.CMS_BUCKET.get(key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path.startsWith('/api/admin/')) return handleAdmin(request, env, path);
    if (path === '/api/applications') return handleApplication(request, env);
    if (path === '/api/cms/images') return handleImageUpload(request, env);
    if (path.startsWith('/cms-images/')) return serveCmsImage(env, path);
    return env.ASSETS.fetch(request);
  },
};
