import worker from '../worker.js';

const env = {
  ADMIN_PASSWORD: 'test-password',
  ADMIN_SESSION_SECRET: 'test-session-secret',
  AI: {
    async run(model, input) {
      if (model !== '@cf/google/gemma-4-26b-a4b-it') throw new Error('Unexpected model');
      if (!input.messages?.[1]?.content.includes('Emergency Loan')) throw new Error('Service context missing');
      return {
        response: {
          summary: 'Get practical support for urgent personal expenses, subject to assessment and the applicable terms and conditions.',
          overview: [
            'Emergency Loan provides a straightforward way to request financial support when an urgent expense cannot wait. The service is presented clearly so customers can understand the purpose of the loan before applying.',
            'Applications are reviewed using the information supplied by each customer. Available terms and requirements are confirmed during the application process and remain subject to IOU Finance policies.',
          ],
          benefits: [
            'Straightforward application process for urgent financial needs',
            'Clear information before a customer accepts any terms',
            'Support from the IOU Finance service team',
            'Flexible assessment based on supplied application details',
          ],
        },
      };
    },
  },
  ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) },
};

const loginResponse = await worker.fetch(new Request('https://example.com/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'test-password' }),
}), env);
if (loginResponse.status !== 200) throw new Error('Login test failed');
const cookie = loginResponse.headers.get('Set-Cookie')?.split(';')[0];
if (!cookie) throw new Error('Login cookie missing');

const unauthorised = await worker.fetch(new Request('https://example.com/api/admin/ai/service-details', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ service: { title: 'Emergency Loan', summary: 'Help with urgent expenses.' } }),
}), env);
if (unauthorised.status !== 401) throw new Error('Unauthorised AI request was not blocked');

const generatedResponse = await worker.fetch(new Request('https://example.com/api/admin/ai/service-details', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Cookie: cookie },
  body: JSON.stringify({ service: { title: 'Emergency Loan' } }),
}), env);
const generated = await generatedResponse.json();
if (
  generatedResponse.status !== 200
  || !generated.details?.summary
  || generated.details?.benefits?.length !== 4
  || Object.hasOwn(generated.details, 'title')
  || Object.hasOwn(generated.details, 'overviewTitle')
  || Object.hasOwn(generated.details, 'benefitsTitle')
) {
  throw new Error(`AI generation test failed: ${JSON.stringify(generated)}`);
}

console.log(JSON.stringify({ authenticated: true, unauthorisedBlocked: true, summaryGenerated: true, detailsGenerated: true, namePreserved: true, headingsPreserved: true }));
