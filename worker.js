const ADMIN_COOKIE = 'iou_admin_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_CMS_BYTES = 1024 * 1024;
const MAX_AI_REQUEST_BYTES = 32 * 1024;
const AI_SERVICE_DETAILS_MODEL = '@cf/google/gemma-4-26b-a4b-it';
const SERVICES_KEY = 'cms:services';
const CONTENT_KEY = 'cms:content';
const RETIRED_SERVICE_SLUGS = new Set([
  'personal-loan',
  'group-loan',
  'lpo-financing',
  'asset-financing',
]);
const OPTIMIZED_SERVICE_IMAGE_BY_LEGACY_URL = Object.freeze({
  '/assets/service-emergency.png': '/assets/service-emergency.webp',
  '/assets/service-payday.png': '/assets/service-payday.webp',
  '/assets/service-business.png': '/assets/service-business.webp',
  '/assets/service-savings-investment.jpg': '/assets/service-savings-investment.webp',
});
const REQUIRED_APPLICATION_FIELDS = [
  'firstName', 'lastName', 'phone', 'email', 'employer',
  'monthlyIncome', 'amountNeeded', 'duration', 'homeAddress', 'bvn', 'nin',
];
const loginAttempts = new Map();
const aiGenerationAttempts = new Map();

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
  if (path === '/api/admin/ai/service-details' && request.method === 'POST') {
    if (!configured || !await hasValidSession(request, sessionSecret)) {
      return json({ error: 'Your admin session has expired. Please sign in again.' }, 401);
    }
    return handleServiceDetailsGeneration(request, env);
  }
  return json({ error: 'Method not allowed.' }, 405);
}

function normaliseGeneratedCopy(value, maxLength) {
  return String(value || '')
    .replaceAll('—', ' - ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function parseGeneratedServiceDetails(result) {
  let output = result?.response ?? result?.choices?.[0]?.message?.content ?? result;
  if (typeof output === 'string') {
    const cleanJson = output.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    output = JSON.parse(cleanJson);
  }
  const details = {
    summary: normaliseGeneratedCopy(output?.summary, 320),
    overview: Array.isArray(output?.overview)
      ? output.overview.map((item) => normaliseGeneratedCopy(item, 1200)).filter(Boolean).slice(0, 3)
      : [],
    benefits: Array.isArray(output?.benefits)
      ? output.benefits.map((item) => normaliseGeneratedCopy(item, 240)).filter(Boolean).slice(0, 6)
      : [],
  };
  if (!details.summary || details.overview.length < 2 || details.benefits.length < 3) {
    throw new Error('The model returned incomplete service copy.');
  }
  return details;
}

async function handleServiceDetailsGeneration(request, env) {
  if (!env.AI) return json({ error: 'AI writing is not configured for this deployment.' }, 503);
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_AI_REQUEST_BYTES) return json({ error: 'The service context is too large.' }, 413);

  const address = request.headers.get('CF-Connecting-IP') || 'unknown';
  const previous = aiGenerationAttempts.get(address);
  const active = previous && Date.now() - previous.startedAt < 60 * 1000
    ? previous
    : { count: 0, startedAt: Date.now() };
  if (active.count >= 10) return json({ error: 'Too many AI requests. Wait a minute and try again.' }, 429);
  aiGenerationAttempts.set(address, { ...active, count: active.count + 1 });

  try {
    const body = await request.json();
    const service = body?.service || {};
    const context = {
      title: normaliseGeneratedCopy(service.title, 200),
    };
    if (!context.title) {
      return json({ error: 'Add a service name before generating its copy.' }, 400);
    }

    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        summary: { type: 'string' },
        overview: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' } },
        benefits: { type: 'array', minItems: 4, maxItems: 6, items: { type: 'string' } },
      },
      required: ['summary', 'overview', 'benefits'],
    };
    const result = await env.AI.run(
      AI_SERVICE_DETAILS_MODEL,
      {
        messages: [
          {
            role: 'system',
            content: `You write concise website copy for IOU Finance, a Nigerian financial services company. Infer the general purpose of the service from its name, but never invent interest rates, fees, loan limits, approval times, eligibility rules, collateral requirements, guarantees, legal claims, or regulatory claims. Keep unsupported details general and make clear that applications and terms are subject to review. Use clear Nigerian English, no slang, no em dashes, and no exaggerated promises. Return only the requested JSON. Write a 15 to 17 word summary, two overview paragraphs of 35 to 60 words each, and four to six benefits of 6 to 14 words each. Do not generate an overview heading or a benefits heading.`,
          },
          {
            role: 'user',
            content: `Create the summary, overview paragraphs, and benefit items from this administrator-supplied service name. Do not return any headings:\n${JSON.stringify(context)}`,
          },
        ],
        response_format: { type: 'json_schema', json_schema: schema },
        max_completion_tokens: 700,
        temperature: 0.25,
        chat_template_kwargs: { enable_thinking: false },
      },
      { rejectIfBusy: true },
    );
    return json({ details: parseGeneratedServiceDetails(result), model: AI_SERVICE_DETAILS_MODEL });
  } catch (error) {
    console.error('AI service detail generation failed:', error);
    return json({ error: 'AI could not generate the service details right now. Please try again.' }, 502);
  }
}

function applicationEmailHtml(values) {
  const formatMoneyValue = (value) => {
    const amount = Number(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(amount) ? amount.toLocaleString('en-NG') : String(value ?? '');
  };
  const rows = [
    ['Name', `${values.firstName} ${values.lastName}`],
    ['Phone number', values.phone],
    ['Email address', values.email],
    ['Business/Employer', values.employer],
    ['Monthly income', `₦${formatMoneyValue(values.monthlyIncome)}`],
    ['Amount needed', `₦${formatMoneyValue(values.amountNeeded)}`],
    ['Duration', `${values.duration} months`],
    ['Home address', values.homeAddress],
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
    <p>The applicant's passport photograph and utility bill are attached.</p>
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
  if (contentLength > 12 * 1024 * 1024) return json({ error: 'The application is too large.' }, 413);

  try {
    const formData = await request.formData();
    const values = Object.fromEntries(
      REQUIRED_APPLICATION_FIELDS.map((field) => [field, String(formData.get(field) || '').trim()]),
    );
    const passport = formData.get('passportPhotograph');
    const utilityBill = formData.get('utilityBill');
    const missingField = REQUIRED_APPLICATION_FIELDS.find((field) => !values[field]);
    if (missingField || !(passport instanceof File) || !passport.size || !(utilityBill instanceof File) || !utilityBill.size) {
      return json({ error: 'Please complete every field and attach a passport photograph and utility bill.' }, 400);
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) return json({ error: 'Please enter a valid email address.' }, 400);
    if (!/^\d{11}$/.test(values.bvn) || !/^\d{11}$/.test(values.nin)) {
      return json({ error: 'BVN and NIN must each contain 11 digits.' }, 400);
    }
    if (!['image/jpeg', 'image/png'].includes(passport.type) || passport.size > MAX_IMAGE_BYTES) {
      return json({ error: 'The passport photograph must be a JPG or PNG smaller than 5MB.' }, 400);
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(utilityBill.type) || utilityBill.size > MAX_IMAGE_BYTES) {
      return json({ error: 'The utility bill must be a PDF, JPG or PNG smaller than 5MB.' }, 400);
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
        subject: `Loan application: ${values.firstName} ${values.lastName}`,
        html: applicationEmailHtml(values),
        attachments: [
          {
            filename: passport.name || 'passport-photograph.jpg',
            content: arrayBufferToBase64(await passport.arrayBuffer()),
          },
          {
            filename: utilityBill.name || 'utility-bill.pdf',
            content: arrayBufferToBase64(await utilityBill.arrayBuffer()),
          },
        ],
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
  if (!env.CMS_KV) return json({ error: 'CMS storage is not configured.' }, 503);

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
    await env.CMS_KV.put(`image:${key}`, await image.arrayBuffer(), {
      metadata: { contentType: image.type },
    });
    return json({ url: `/cms-images/${key}` }, 201);
  } catch (error) {
    console.error('CMS image upload failed:', error);
    return json({ error: 'The image could not be saved. Please try again.' }, 500);
  }
}

async function serveCmsImage(env, path) {
  if (!env.CMS_KV) return new Response('Not found', { status: 404 });
  const key = decodeURIComponent(path.slice('/cms-images/'.length));
  if (!key || key.includes('..')) return new Response('Not found', { status: 404 });
  const object = await env.CMS_KV.getWithMetadata(`image:${key}`, 'arrayBuffer');
  if (!object.value) return new Response('Not found', { status: 404 });

  return new Response(object.value, {
    headers: {
      'Content-Type': object.metadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function normaliseCmsRecords(records) {
  if (!Array.isArray(records)) return null;
  return records
    .filter((service) => service
      && typeof service.slug === 'string'
      && typeof service.title === 'string'
      && !RETIRED_SERVICE_SLUGS.has(service.slug))
    .map((service, index) => {
      const storedImage = service.cardImage || service.image || null;
      const optimizedImage = OPTIMIZED_SERVICE_IMAGE_BY_LEGACY_URL[storedImage] || storedImage;
      return {
        ...service,
        slug: service.slug.slice(0, 100),
        title: service.title.slice(0, 200),
        cardImage: optimizedImage,
        image: optimizedImage,
        order: index,
      };
    });
}

async function handleServicesCms(request, env) {
  if (!env.CMS_KV) return json({ error: 'CMS storage is not configured.' }, 503);

  if (request.method === 'GET') {
    const stored = await env.CMS_KV.get(SERVICES_KEY, 'json');
    const records = Array.isArray(stored) ? stored : stored?.records;
    return json({
      records: Array.isArray(records) ? normaliseCmsRecords(records) : null,
      revision: Array.isArray(stored) ? null : stored?.revision || null,
      updatedAt: Array.isArray(stored) ? null : stored?.updatedAt || null,
    });
  }

  if (request.method !== 'PUT') return json({ error: 'Method not allowed.' }, 405);
  const sessionSecret = String(env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD || '');
  if (!await hasValidSession(request, sessionSecret)) {
    return json({ error: 'Your admin session has expired. Please sign in again.' }, 401);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_CMS_BYTES) return json({ error: 'The CMS content is too large.' }, 413);

  try {
    const body = await request.json();
    const records = normaliseCmsRecords(body.records);
    if (!records) return json({ error: 'The service content is invalid.' }, 400);
    const current = await env.CMS_KV.get(SERVICES_KEY, 'json');
    if (!Array.isArray(current) && current?.revision && body.baseRevision !== current.revision) {
      return json({ error: 'The service content was changed by another administrator.', revision: current.revision }, 409);
    }
    const record = {
      records,
      revision: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    const serialised = JSON.stringify(record);
    if (serialised.length > MAX_CMS_BYTES) return json({ error: 'The CMS content is too large.' }, 413);
    await env.CMS_KV.put(SERVICES_KEY, serialised);
    return json(record);
  } catch (error) {
    console.error('CMS content save failed:', error);
    return json({ error: 'The service content could not be saved. Please try again.' }, 500);
  }
}

function normaliseContentValue(value, depth = 0) {
  if (depth > 14) return null;
  if (typeof value === 'string') return value.slice(0, 20000);
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'boolean' || value === null) return value;
  if (Array.isArray(value)) {
    if (value.length > 200) return null;
    const items = value.map((item) => normaliseContentValue(item, depth + 1));
    return items.some((item) => item === undefined) ? null : items;
  }
  if (!value || typeof value !== 'object') return undefined;
  const entries = Object.entries(value);
  if (entries.length > 300) return null;
  const safeEntries = [];
  for (const [key, item] of entries) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) continue;
    const normalised = normaliseContentValue(item, depth + 1);
    if (normalised === undefined) return null;
    safeEntries.push([key.slice(0, 120), normalised]);
  }
  return Object.fromEntries(safeEntries);
}

async function handleContentCms(request, env) {
  if (!env.CMS_KV) return json({ error: 'CMS storage is not configured.' }, 503);

  if (request.method === 'GET') {
    const record = await env.CMS_KV.get(CONTENT_KEY, 'json');
    return json({
      content: record?.content && typeof record.content === 'object' ? record.content : null,
      revision: record?.revision || null,
      updatedAt: record?.updatedAt || null,
    });
  }

  if (request.method !== 'PUT') return json({ error: 'Method not allowed.' }, 405);
  const sessionSecret = String(env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD || '');
  if (!await hasValidSession(request, sessionSecret)) {
    return json({ error: 'Your admin session has expired. Please sign in again.' }, 401);
  }
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_CMS_BYTES) return json({ error: 'The website content is too large.' }, 413);

  try {
    const body = await request.json();
    const content = normaliseContentValue(body.content);
    if (!content || Array.isArray(content) || typeof content !== 'object') {
      return json({ error: 'The website content is invalid.' }, 400);
    }
    const current = await env.CMS_KV.get(CONTENT_KEY, 'json');
    if (current?.revision && body.baseRevision !== current.revision) {
      return json({ error: 'The website content was changed by another administrator.', revision: current.revision }, 409);
    }
    const record = {
      content,
      revision: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    const serialised = JSON.stringify(record);
    if (serialised.length > MAX_CMS_BYTES) return json({ error: 'The website content is too large.' }, 413);
    await env.CMS_KV.put(CONTENT_KEY, serialised);
    return json(record);
  } catch (error) {
    console.error('CMS website content save failed:', error);
    return json({ error: 'The website content could not be saved. Please try again.' }, 500);
  }
}

async function serveApplication(request, env) {
  const response = await env.ASSETS.fetch(request);
  const path = new URL(request.url).pathname;
  if (request.method === 'GET' && response.ok && path.startsWith('/assets/')) {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  const contentType = response.headers.get('Content-Type') || '';
  if (request.method !== 'GET' || !response.ok || !contentType.includes('text/html') || !env.CMS_KV) {
    return response;
  }

  const [servicesRecord, contentRecord] = await Promise.all([
    env.CMS_KV.get(SERVICES_KEY, 'json'),
    env.CMS_KV.get(CONTENT_KEY, 'json'),
  ]);
  const records = Array.isArray(servicesRecord) ? servicesRecord : servicesRecord?.records;
  if (!Array.isArray(records) && !contentRecord?.content) return response;

  const cmsPayload = {
    services: Array.isArray(records) ? normaliseCmsRecords(records) : null,
    servicesRevision: Array.isArray(servicesRecord) ? null : servicesRecord?.revision || null,
    content: contentRecord?.content || null,
    revision: contentRecord?.revision || null,
    updatedAt: contentRecord?.updatedAt || null,
  };
  const safePayload = JSON.stringify(cmsPayload).replaceAll('<', '\\u003c');
  const html = (await response.text()).replace(
    /<script id="iou-cms-bootstrap">[\s\S]*?<\/script>/,
    `<script id="iou-cms-bootstrap">window.__IOU_CMS__ = ${safePayload};</script>`,
  );
  const headers = new Headers(response.headers);
  headers.delete('Content-Length');
  headers.delete('ETag');
  headers.set('Cache-Control', 'no-cache');
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path.startsWith('/api/admin/')) return handleAdmin(request, env, path);
    if (path === '/api/applications') return handleApplication(request, env);
    if (path === '/api/cms/services') return handleServicesCms(request, env);
    if (path === '/api/cms/content') return handleContentCms(request, env);
    if (path === '/api/cms/images') return handleImageUpload(request, env);
    if (path.startsWith('/cms-images/')) return serveCmsImage(env, path);
    return serveApplication(request, env);
  },
};
