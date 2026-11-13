import { useEffect, useRef, useState } from 'react';
import AdminContentEditor from './AdminContentEditor';

const navItems = [
  ['Home', '/#home'],
  ['About us', '/about'],
  ['Services', '/services'],
  ['FAQs', '/faq'],
  ['Contact Us', '/contact'],
];

const siteOrigin = 'https://ioufinanceltd.com';

const pageMetadata = {
  '/': {
    title: 'Fast Loans for Nigerians | IOU Finance',
    description: 'Fast, collateral-free loans for Nigerian employees, traders, and business owners. Apply online and get a quick decision from IOU Finance.',
  },
  '/about': {
    title: 'About IOU Finance | Lending Built Around You',
    description: 'Meet IOU Finance, a Nigerian lender making straightforward credit accessible to employees, traders, and business owners.',
  },
  '/services': {
    title: 'Loan Services | IOU Finance',
    description: 'Explore payday, emergency, business, savings, and investment options from IOU Finance.',
  },
  '/faq': {
    title: 'Frequently Asked Questions | IOU Finance',
    description: 'Find clear answers about IOU Finance loan eligibility, applications, collateral, repayment, and loan amounts.',
  },
  '/contact': {
    title: 'Contact IOU Finance | Get Help',
    description: 'Contact the IOU Finance team by email, phone, or at our Lagos office for help with loans and applications.',
  },
  '/application': {
    title: 'Apply for a Loan | IOU Finance',
    description: 'Apply online for an IOU Finance loan in minutes. Submit your details securely and receive a quick decision.',
  },
  '/terms-and-conditions': {
    title: 'Terms and Conditions | IOU Finance',
    description: 'Read the terms that govern the IOU Finance website and lending services.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | IOU Finance',
    description: 'Learn how IOU Finance collects, uses, stores, and protects your personal information.',
  },
  '/admin': {
    title: 'IOU Finance CMS',
    description: 'Secure content management for IOU Finance.',
  },
};

function SiteMetadata({ pagePath, service }) {
  useEffect(() => {
    const canonicalPath = pagePath === '/apply' ? '/application'
      : pagePath === '/terms' ? '/terms-and-conditions'
        : pagePath === '/privacy' ? '/privacy-policy'
          : pagePath;
    const metadata = service
      ? {
          title: `${service.title} | IOU Finance`,
          description: service.summary,
        }
      : siteContent.seo.pages[canonicalPath] || {
          title: 'Page Not Found | IOU Finance',
          description: 'The page you requested could not be found. Return to IOU Finance to explore our loan options.',
        };
    const canonicalUrl = `${siteOrigin}${canonicalPath === '/' ? '/' : canonicalPath}`;
    const isPrivatePage = pagePath === '/admin';
    const isMissingPage = !service && !pageMetadata[canonicalPath];

    document.title = metadata.title;

    const setMeta = (selector, attributes) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }
      Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    };

    setMeta('meta[name="description"]', { name: 'description', content: metadata.description });
    setMeta('meta[name="robots"]', { name: 'robots', content: isPrivatePage || isMissingPage ? 'noindex, nofollow' : 'index, follow' });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'IOU Finance' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    const configuredSocialImage = siteContent.seo.socialImage.src.startsWith('http')
      ? siteContent.seo.socialImage.src
      : `${siteOrigin}${siteContent.seo.socialImage.src}`;
    setMeta('meta[property="og:image"]', { property: 'og:image', content: configuredSocialImage });
    setMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    setMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: siteContent.seo.socialImage.alt });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: configuredSocialImage });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let structuredData = document.head.querySelector('#iou-structured-data');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'iou-structured-data';
      structuredData.type = 'application/ld+json';
      document.head.appendChild(structuredData);
    }
    const graph = [{
      '@type': ['Organization', 'FinancialService'],
      '@id': `${siteOrigin}/#organization`,
      name: 'IOU Finance Ltd.',
      url: siteOrigin,
      logo: `${siteOrigin}/assets/logo-raw-2.png`,
      email: 'contact@ioufinanceltd.com',
      telephone: '+2347025700040',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '20 Mojidi Street, off Toyin Street',
        addressLocality: 'Ikeja',
        addressRegion: 'Lagos',
        addressCountry: 'NG',
      },
    }];
    if (canonicalPath === '/faq') {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: siteContent.faqPage.items.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      });
    }
    structuredData.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, [pagePath, service]);

  return null;
}

function DeferredImageWarmup({ disabled = false }) {
  useEffect(() => {
    if (disabled) return undefined;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return undefined;

    let timeoutId;
    let idleId;
    const prefetchImages = () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
        const href = image.currentSrc || image.src;
        if (!href || document.head.querySelector(`link[data-image-warmup="${CSS.escape(href)}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = href;
        link.dataset.imageWarmup = href;
        document.head.appendChild(link);
      });
    };
    const scheduleWarmup = () => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(prefetchImages, { timeout: 2500 });
      else timeoutId = window.setTimeout(prefetchImages, 900);
    };

    if (document.readyState === 'complete') scheduleWarmup();
    else window.addEventListener('load', scheduleWarmup, { once: true });

    return () => {
      window.removeEventListener('load', scheduleWarmup);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [disabled]);

  return null;
}

const faqItems = [
  {
    question: 'What is IOU Finance?',
    answer: 'IOU Finance is a lending platform built for employees, traders, and business owners across Nigeria. We provide fast, collateral-free loans so you can handle emergencies, bridge the gap till payday, or grow your business.',
  },
  {
    question: 'Who can apply for a loan?',
    answer: "Anyone earning a legitimate income can apply, whether you're an employee, a trader, or a business owner. As long as you meet our basic requirements, you're eligible.",
  },
  {
    question: 'Do I need collateral to get a loan?',
    answer: 'No. Most of our loans require no collateral. We assess you based on your income and repayment ability, not what property you own.',
  },
  {
    question: 'How much can I borrow?',
    answer: "Loan amounts vary depending on the loan type and your income level. Once you apply, we'll let you know exactly how much you qualify for.",
  },
  {
    question: 'How do I apply for a loan?',
    answer: 'Simply fill out our online application form, upload the required documents, and submit. The whole process takes less than 5 minutes.',
  },
  {
    question: 'How do I repay my loan?',
    answer: "Repayment terms depend on the loan type, daily, weekly, or aligned with your payday. You'll see your exact repayment schedule before you accept the loan.",
  },
  {
    question: 'What happens if I repay late?',
    answer: "Late repayment may attract additional charges. We encourage you to reach out to our team as early as possible if you're facing difficulty repaying, so we can work out a solution together.",
  },
];

const termsSections = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using the IOU Finance website and services, you agree to be bound by these Terms of Use. If you do not agree, please do not use our website or services.' },
  { title: '2. Who We Are', body: 'IOU Finance ("we," "us," "our") is a lending platform providing loan products to eligible individuals and businesses in Nigeria.' },
  {
    title: '3. Eligibility',
    intro: 'To use our services, you must:',
    items: ['Be at least 18 years old', 'Be a Nigerian citizen or legal resident', 'Provide accurate, truthful information during application', 'Have a valid means of identification and an active bank account'],
  },
  { title: '4. Loan Applications', body: 'Submitting a loan application does not guarantee approval. All applications are subject to our internal assessment criteria, and we reserve the right to approve, decline, or request additional information at our discretion.' },
  { title: '5. Accuracy of Information', body: 'You are responsible for ensuring all information you provide is accurate and up to date. Providing false or misleading information may result in application rejection, account suspension, or legal action.' },
  { title: '6. Repayment Obligations', body: 'By accepting a loan, you agree to repay the full amount, including any applicable fees, in accordance with the repayment schedule provided at the time of approval. Late or non-repayment may result in additional charges, credit reporting, or recovery action as permitted by law.' },
  { title: '7. Fees and Charges', body: 'Any applicable fees will be clearly disclosed to you before you accept a loan offer. We do not charge hidden or undisclosed fees.' },
  {
    title: '8. Prohibited Use',
    intro: 'You agree not to:',
    items: ['Use our services for any fraudulent or illegal purpose', 'Attempt to gain unauthorized access to our systems', 'Submit false documentation or impersonate another person'],
  },
  { title: '9. Intellectual Property', body: 'All content on this website, including text, logos, graphics, and design, is the property of IOU Finance and may not be copied, reproduced, or used without our written permission.' },
  { title: '10. Limitation of Liability', body: 'IOU Finance is not liable for any indirect, incidental, or consequential damages arising from your use of our website or services, to the fullest extent permitted by law.' },
  { title: '11. Changes to These Terms', body: 'We may update these Terms of Use from time to time. Continued use of our services after changes are posted constitutes your acceptance of the updated terms.' },
  { title: '12. Governing Law', body: 'These Terms are governed by the laws of the Federal Republic of Nigeria.' },
  { title: '13. Contact Us', body: 'For questions about these Terms, contact us at contact@ioufinanceltd.com or +234-702-5700-040.' },
];

const privacySections = [
  { title: '1. Introduction', body: 'IOU Finance ("we," "us," "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and services, in line with the Nigeria Data Protection Act (NDPA) 2023.' },
  {
    title: '2. Information We Collect',
    intro: 'When you apply for a loan or interact with our website, we may collect:',
    items: ['Full name, phone number, and email address', 'Government-issued identification details', 'Proof of address', 'Bank account details', 'Passport photograph', 'Employment or business information', 'Device and usage data (IP address, browser type, etc.)'],
  },
  {
    title: '3. How We Use Your Information',
    intro: 'We use your information to:',
    items: ['Process and assess loan applications', 'Verify your identity (KYC compliance)', 'Disburse approved loans', 'Communicate with you about your application or account', 'Improve our services and website', 'Comply with legal and regulatory obligations'],
  },
  { title: '4. How We Protect Your Information', body: 'We use industry-standard security measures, including SSL encryption, to protect your data during transmission. Access to your personal information is restricted to authorized personnel only.' },
  {
    title: '5. Sharing Your Information',
    intro: 'We do not sell your personal information. We may share your data with:',
    items: ['Regulatory bodies, where legally required', 'Credit reference bureaus, for loan assessment purposes', 'Trusted third-party service providers who assist in processing your application (e.g., payment processors, verification services), under strict confidentiality agreements'],
  },
  { title: '6. Data Retention', body: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable law.' },
  {
    title: '7. Your Rights',
    intro: 'Under the NDPA, you have the right to:',
    items: ['Access the personal information we hold about you', 'Request correction of inaccurate information', 'Request deletion of your data, subject to legal retention requirements', 'Withdraw consent for data processing, where applicable'],
    outro: 'To exercise these rights, contact us at contact@ioufinanceltd.com.',
  },
  { title: '8. Cookies', body: 'Our website may use cookies to improve your browsing experience. You can disable cookies through your browser settings, though this may affect site functionality.' },
  { title: '9. Third-Party Links', body: 'Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites.' },
  { title: "10. Children's Privacy", body: 'Our services are not intended for individuals under 18. We do not knowingly collect information from minors.' },
  { title: '11. Changes to This Policy', body: 'We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date.' },
  { title: '12. Contact Us', body: 'For privacy-related questions or requests, contact us at contact@ioufinanceltd.com or +234-702-5700-040.' },
];

const benefits = [
  {
    title: 'Same-Day Disbursement',
    description: 'Apply, receive a quick decision, and get approved funds in your account without unnecessary delays.',
    image: '/assets/benefit-same-day.webp',
    imageAlt: 'A financial professional presenting a performance chart',
    imagePosition: '50% 42%',
  },
  {
    title: 'No Collateral, No Wahala',
    description: 'Eligible applicants can access funding without traditional collateral, subject to assessment, documentation, and applicable terms.',
    image: '/assets/benefit-no-collateral.webp',
    imageAlt: 'A business professional giving a confident thumbs up',
    imagePosition: '50% 38%',
  },
  {
    title: 'Transparent Repayment Terms',
    description: 'See your repayment amount, schedule, fees, and applicable terms clearly before accepting your loan offer.',
    image: '/assets/benefit-transparent-terms.webp',
    imageAlt: 'A financial adviser explaining repayment details',
    imagePosition: '50% 8%',
  },
];

const stats = [
  { target: 300, suffix: '+', label: 'Loans Disbursed' },
  { target: 30, prefix: '₦', suffix: 'M', label: 'Total Amount Funded' },
  { target: 24, suffix: 'hrs', label: 'Average Approval Time' },
  { target: 98, suffix: '%', label: 'Customer Satisfaction Rate' },
];

const applicationSteps = [
  {
    title: 'Apply for a loan',
    description: 'Fill a quick form with your basic details. Takes less than 5 minutes, no long forms, no wahala.',
    image: '/assets/process-apply.webp',
    imageAlt: 'A customer applying for a loan on his phone',
    imagePosition: '50% 48%',
  },
  {
    title: 'Get Approval',
    description: 'Our team reviews your application and gives you a decision fast, most times within hours.',
    image: '/assets/process-approval.webp',
    imageAlt: 'A finance professional reviewing an application',
    imagePosition: '48% 42%',
  },
  {
    title: 'Receive Funds',
    description: 'Once approved, the money hits your account the same day, ready to use for whatever you need.',
    image: '/assets/process-funds.webp',
    imageAlt: 'A business owner celebrating after receiving funds',
    imagePosition: '50% 42%',
  },
];

const requiredDocuments = [
  'Valid Government ID',
  'Proof of Address',
  'Passport Photograph',
  'Bank Account Details',
];

const testimonials = [
  {
    quote: '“IOU Finance saved my shop during a slow season. I applied, got approved, and restocked within a day”',
    name: 'Chijioke Okafor',
    role: 'Fabric Trader, Balogun Market',
    image: '/assets/testimonial-chijioke.webp',
    imageAlt: 'Portrait of Chijioke Okafor',
  },
  {
    quote: '"Running my provision store no easy, but IOU Finance made getting a loan simple and stress-free."',
    name: 'Adaobi Nwosu',
    role: 'Provision Store Owner, Lagos',
    image: '/assets/testimonial-adaobi.webp',
    imageAlt: 'Portrait of Adaobi Nwosu',
  },
  {
    quote: '"I applied for a payday loan and had the money before my next alert even dropped."',
    name: 'Emeka Ibe',
    role: 'Employee, Lagos',
    image: '/assets/testimonial-emeka.webp',
    imageAlt: 'Portrait of Emeka Ibe',
  },
  {
    quote: '"My business grew because IOU Finance believed in me when nobody else would give me a chance."',
    name: 'Ify Uche',
    role: 'Small Business Owner',
    image: '/assets/testimonial-ify.webp',
    imageAlt: 'Portrait of Ify Uche',
  },
  {
    quote: '"Fast approval, clear terms, no hidden charges. This is the lender every trader has been searching for."',
    name: 'Tunde Adebayo',
    role: 'Salary Earner',
    image: '/assets/testimonial-tunde.webp',
    imageAlt: 'Portrait of Tunde Adebayo',
  },
  {
    quote: '"I no get collateral, but IOU Finance still help me. Money enter my account same day sharp."',
    name: 'Ngozi Eze',
    role: 'Civil Servant, Abuja',
    image: '/assets/testimonial-ngozi.webp',
    imageAlt: 'Portrait of Ngozi Eze',
  },
];

function deepMergeContent(defaults, stored) {
  if (Array.isArray(defaults)) return Array.isArray(stored) ? stored : defaults;
  if (!defaults || typeof defaults !== 'object') return stored === undefined ? defaults : stored;
  const incoming = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [
    key,
    deepMergeContent(value, incoming[key]),
  ]));
}

const asMedia = (src, alt, position = '50% 50%') => ({ src, alt, position });
const defaultSiteContent = {
  global: {
    brand: {
      headerLogo: asMedia('/assets/logo-raw-2.png', 'IOU Finance Ltd.'),
      footerLogo: asMedia('/assets/footer-logo.png', 'IOU Finance Ltd.'),
    },
    navigation: {
      items: navItems.map(([label, href]) => ({ label, href })),
      applicationLabel: 'Apply for a Loan',
    },
    buttons: {
      apply: 'Apply for a Loan',
      exploreServices: 'Explore our Services',
      contact: 'Contact Us',
      learnMore: 'Learn More',
    },
    footer: {
      description: 'IOU Finance gives employees, traders, and business owners fast access to loans. No collateral, no long wait. Spend. Save. Earn.',
      menuHeading: 'Menu',
      servicesHeading: 'Our Services',
      servicesLink: 'View All Services',
      securityHeading: 'Security',
      termsLabel: 'Terms & Conditions',
      privacyLabel: 'Privacy Policy',
      socialHeading: 'Social',
      email: 'contact@ioufinanceltd.com',
      phoneDisplay: '+234-702-5700-040',
      phoneHref: '+2347025700040',
      address: '20 mojidi street, off toyin street ikeja, Lagos',
      copyright: '© 2026 IOU Finance. All rights reserved.',
    },
  },
  seo: {
    socialImage: asMedia('/assets/iou-finance-social-banner.jpg', 'IOU Finance, fast loans for Nigerian employees, traders, and business owners'),
    pages: pageMetadata,
  },
  calculator: {
    title: 'Loan Calculator',
    amountLabel: 'I Need',
    durationLabel: 'I Need',
    durationUnit: 'mths',
    minimumAmountLabel: '₦50k',
    maximumAmountLabel: '₦5M',
    minimumDurationLabel: '1 month',
    maximumDurationLabel: '12 months',
    totalLabel: 'You Repay',
    monthlyLabel: 'Monthly',
    interestLabel: 'Interest',
    toggleLabel: 'Calculate Loan',
    applyLabel: 'Apply for a Loan',
    icon: asMedia('/assets/calculator-icon.png', ''),
  },
  home: {
    hero: {
      title: 'Quick Loans? No Wahala, Get Cash in Your Hands Today.',
      description: 'From handling urgent expenses before payday to restocking your shop or funding your next big order, we lend money that moves with how you earn.',
      primaryLabel: 'Apply for a Loan',
      secondaryLabel: 'Explore our Services',
      media: asMedia('/assets/hero-home-executive-wide.webp', 'A smiling business professional in a navy suit', '68% 20%'),
    },
    about: {
      label: 'ABOUT US',
      title: 'At IOU Finance, we give employees, traders, and business owners fast access to funding built around how they work and earn.',
      description: 'Built for hardworking Nigerians. We understand the realities of salaries, daily trade, and growing a business, so our loans move as quickly as your needs do.',
      buttonLabel: 'About IOU Finance',
    },
    services: {
      label: 'OUR SERVICES',
      title: "Whatever You're Building, We Have a Loan for It.",
      buttonLabel: 'Explore More Services',
    },
    benefits: {
      label: 'BENEFITS',
      title: 'Reasons Why Businesses Trust IOU Finance',
      items: benefits.map(({ image, imageAlt, imagePosition, ...item }) => ({ ...item, media: asMedia(image, imageAlt, imagePosition) })),
    },
    stats: {
      accessibleLabel: 'IOU Finance statistics',
      items: stats,
    },
    process: {
      steps: applicationSteps.map(({ image, imageAlt, imagePosition, ...step }) => ({ ...step, media: asMedia(image, imageAlt, imagePosition) })),
      previousLabel: 'Previous application step',
      nextLabel: 'Next application step',
      eligibility: {
        title: 'WHO CAN APPLY?',
        description: "Whether you earn a salary, trade for a living, or run a business, IOU Finance is built for you. We keep the process simple and the requirements few, so getting funded doesn't feel like a battle.",
        documentsHeading: 'Documents Needed',
        documents: requiredDocuments,
        media: asMedia('/assets/process-eligibility.webp', 'A small business owner who is eligible to apply', '48% 15%'),
      },
    },
    testimonials: {
      label: 'TESTIMONIALS',
      title: 'Hear From The Hustlers Who Trust Us Every Day',
      previousLabel: 'Previous testimonials',
      nextLabel: 'Next testimonials',
      viewportLabel: 'Customer testimonials. Scroll horizontally to view more.',
      items: testimonials.map(({ image, imageAlt, ...item }) => ({ ...item, media: asMedia(image, imageAlt) })),
    },
    cta: {
      title: 'Your Next Move Starts With Funding.',
      description: 'No collateral, no long wait. Apply now and get cash in your account, same day.',
      primaryLabel: 'Apply for a Loan',
      secondaryLabel: 'Explore our Services',
    },
  },
  servicesPage: {
    hero: {
      label: '~SERVICES~',
      title: 'Loans Built Around How You Earn',
      media: asMedia('/assets/about-hero-executive-office.webp', 'A smiling business professional seated at his office desk', '56% 50%'),
    },
    cta: {
      title: 'Pick a Loan. Start Growing.',
      description: "Whatever you need funding for, we've got an option that fits. Apply now and get a decision fast.",
      primaryLabel: 'Apply for a Loan',
      secondaryLabel: 'Contact Us',
    },
  },
  faqPage: {
    hero: {
      label: '~FAQs~',
      title: "Got Questions? We've Got Answers.",
      media: asMedia('/assets/faq-hero-advisor-office.webp', 'A financial advisor seated at her desk ready to answer questions', '72% 50%'),
    },
    items: faqItems,
    cta: {
      title: 'Ready to Get Funded?',
      description: "Apply in minutes or talk to someone who can guide you. We're here either way.",
      primaryLabel: 'Apply for a Loan',
      secondaryLabel: 'Contact Us',
    },
  },
  aboutPage: {
    hero: {
      label: '~About Us~',
      title: "We're Here for the People Banks Overlook",
      media: asMedia('/assets/about-hero-woman-office.webp', 'A confident business professional standing in a modern office', '72% 50%'),
    },
    statement: 'At IOU Finance, we are committed to putting fast, honest funding in the hands of employees, traders, and business owners across Nigeria. Our team understands the pressures of earning a salary, running a trade, and growing a business, so we offer simple loan options built around how you actually work and earn.',
    mission: {
      label: 'OUR MISSION',
      title: 'Turning Everyday Work Into Lasting Growth',
      description: "We exist to make credit accessible to every hardworking Nigerian, regardless of collateral, connections, or paperwork. Our vision is a Nigeria where no one's growth is limited by lack of access to capital.",
      points: [
        { title: 'Simplify Access to Capital', description: "No collateral, no complicated forms. Just simple requirements anyone can meet, and fast decisions that don't leave you waiting.", icon: asMedia('/assets/about-capital.svg', '') },
        { title: 'Empower Growth', description: 'We help employees stay financially steady and give traders and business owners the capital to keep moving forward, one loan at a time.', icon: asMedia('/assets/about-growth.svg', '') },
      ],
      media: asMedia('/assets/about-our-mission.webp', 'A team celebrating progress together'),
    },
    values: {
      title: 'What we stand for',
      description: 'Everything we do is guided by a few simple beliefs, the same ones that shape how we lend, how we treat people, and how we build trust every single day.',
      heading: 'Our Values',
      items: ['Trust (No hidden charges)', 'Speed (Same-day approval)', 'Dignity (Respect all customers)', 'Accessibility (no complicated forms)'],
      media: asMedia('/assets/about-what-we-stand-for.webp', 'A team reviewing their work together'),
    },
    team: {
      label: 'OUR TEAM',
      title: 'Meet The Team Making It Happen',
      members: [
        { name: 'Emmanuel Ononibe', role: 'CEO, IOU Finance', photo: asMedia('/assets/emmanuel-ononibe-ceo.jpg', 'Emmanuel Ononibe, CEO of IOU Finance', '50% 55%') },
        { name: 'Jenifer Okeh Ononibe', role: 'Second Director', photo: asMedia('/assets/jenifer-okeh-ononibe-second-director.jpg', 'Jenifer Okeh Ononibe, Second Director of IOU Finance', '50% 48%') },
        { name: 'Precious Onyeji', role: 'Senior Staff', photo: asMedia('', 'Portrait of Precious Onyeji') },
        { name: 'Yemisi Adeniyi', role: 'Junior Staff Member', photo: asMedia('', 'Portrait of Yemisi Adeniyi') },
      ],
    },
    cta: {
      title: 'Join our Family and get funded today',
      description: 'Apply today and see why thousands of traders and business owners trust IOU Finance.',
      primaryLabel: 'Apply for a Loan',
      secondaryLabel: 'Explore our Services',
    },
  },
  contactPage: {
    hero: {
      label: '~Contact Us~',
      title: "Have a Question, Need Help Or Want To Know More, We're Here For You.",
      media: asMedia('/assets/contact-hero-women-meeting.webp', 'A business leader speaking with colleagues in a bright meeting room', '72% 50%'),
    },
    sectionTitle: 'Get in touch with our team',
    cards: [
      { type: 'Email', description: 'Get the latest updates and offers.', value: 'contact@ioufinanceltd.com', href: 'mailto:contact@ioufinanceltd.com', icon: asMedia('/assets/contact-email.svg', '') },
      { type: 'Office', description: 'Visit or write to us at:', value: '20 mojidi street, off toyin street ikeja, Lagos', href: '', icon: asMedia('/assets/contact-office.svg', '') },
      { type: 'Phone', description: 'Speak to our team for support.', value: '+234-702-5700-040', href: 'tel:+2347025700040', icon: asMedia('/assets/contact-phone.svg', '') },
    ],
    cta: {
      title: 'Ready to Get Funded?',
      description: "Skip the wait, apply for a loan now and let's get you sorted.",
      primaryLabel: 'Apply for a Loan',
      secondaryLabel: 'Explore our Services',
    },
  },
  applicationPage: {
    hero: {
      label: '~Application~',
      title: 'Start Your Application Today',
      media: asMedia('/assets/contact-hero-team-meeting.webp', 'A group of business professionals discussing growth and funding', '55% 50%'),
    },
    form: {
      firstNameLabel: 'First Name', firstNamePlaceholder: 'eg. John',
      lastNameLabel: 'Last Name', lastNamePlaceholder: 'eg. Doe',
      phoneLabel: 'Phone Number', phonePlaceholder: '+123-456-7890-123',
      emailLabel: 'E-mail Address', emailPlaceholder: 'name@email.com',
      employerLabel: 'Business/Employer', employerPlaceholder: 'eg. Your Company',
      incomeLabel: 'Monthly income (₦)', amountLabel: 'Amount needed (₦)', durationLabel: 'Duration (months)',
      addressLabel: 'Home Address', addressPlaceholder: 'Enter your full residential address',
      bvnLabel: 'BVN (11 digits)', ninLabel: 'NIN', passportLabel: 'Passport Photograph', utilityBillLabel: 'Utility Bill',
      passportPrompt: 'Click to upload a Passport photograph', passportHelp: 'JPG or PNG | clear & recent image | Max 5MB',
      utilityPrompt: 'Click to upload a recent utility bill', utilityHelp: 'PDF, JPG or PNG | proof of home address | Max 5MB',
      consentPrefix: 'By clicking this button, you confirm that you have read and agree to our',
      submitLabel: 'Apply for a Loan', submittingLabel: 'Submitting…',
      uploadIcon: asMedia('/assets/application-upload.svg', ''),
    },
  },
  serviceDetail: {
    cta: {
      title: 'Ready to Handle Your Emergency?',
      description: 'Apply now and get funded the same day, no stress, no delays.',
      primaryLabel: 'Apply for a Loan',
      secondaryLabel: 'Contact Us',
    },
  },
  legal: {
    lastUpdated: 'Last updated: Jan 2025',
    terms: { title: 'Terms of use', sections: termsSections },
    privacy: { title: 'Privacy Policy', sections: privacySections },
  },
  notFound: {
    title: 'This page took a wrong turn.',
    description: 'The link may be outdated or the page may have moved. Your next move is still right here.',
    primaryLabel: 'Back to homepage',
    secondaryLabel: 'Browse loan options',
  },
};

function upgradeLegacyTeamContent(content) {
  const team = content?.aboutPage?.team;
  if (!Array.isArray(team?.members)) return content;

  const replacementsByLegacyName = {
    'David Mitchell': defaultSiteContent.aboutPage.team.members[0],
    'Rachel Bennett': defaultSiteContent.aboutPage.team.members[1],
    "Kevin O'Brien": defaultSiteContent.aboutPage.team.members[2],
    'Laura Simmons': defaultSiteContent.aboutPage.team.members[3],
  };
  let upgraded = false;
  const members = team.members.map((member) => {
    const replacement = replacementsByLegacyName[member?.name];
    if (!replacement) return member;
    upgraded = true;
    return replacement;
  });
  if (!upgraded) return content;

  return {
    ...content,
    aboutPage: {
      ...content.aboutPage,
      team: { ...team, members },
    },
  };
}

const mergeSiteContent = (stored) => upgradeLegacyTeamContent(deepMergeContent(defaultSiteContent, stored));
const siteContent = mergeSiteContent(window.__IOU_CMS__?.content);

const defaultServiceDetailContentBySlug = {
  'emergency-loan': {
    title: 'Emergency Loan',
    summary: "Life doesn't wait, and neither do we. Get cash in hand within hours to handle urgent needs no long stories, no delays.",
    cardImage: '/assets/service-emergency.webp',
    image: null,
    overviewTitle: 'Get the funds you need, fast and stress-free',
    overview: [
      "Life doesn't wait for business hours, and neither do we. Whether it's a sudden medical bill, a family emergency, or an urgent expense that can't wait till payday, our Emergency Loan gets cash into your account fast, no long forms, no delays.",
      "Built for real, urgent moments, we've made the process quick enough to match the pace of your emergency, so you can focus on what matters instead of chasing paperwork.",
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Fast approval: Get a decision within hours of applying.',
      'Flexible loan amounts: Borrow what fits your emergency, from small urgent needs to larger expenses.',
      'No collateral required: We lend based on trust, not property.',
      'No hidden fees: What you see is what you owe, nothing more.',
      "Same-day disbursement: Funds hit your account the day you're approved.",
    ],
  },
  'personal-loan': {
    title: 'Personal Loan',
    summary: 'For school fees, rent, or that thing only you understand, get funds fast with repayment terms that respect your pocket.',
    cardImage: '/assets/service-personal.webp',
    image: null,
    imagePosition: '50% 20%',
    overviewTitle: "Handle Life's Personal Expenses Without the Stress",
    overview: [
      "Whether it's school fees, rent, a family event, or an unexpected personal expense, our Personal Loan puts cash in your account quickly so you can handle what matters most without borrowing from ten different people.",
      'We built this loan to move at the speed of real life. No long forms, no awkward explanations, just a simple application and a fast decision, so you can take care of your personal needs on your own terms.',
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Fast approval: Get a decision within hours of applying.',
      'Flexible loan amounts: Borrow what fits your specific need.',
      'No collateral required: We lend based on trust, not property.',
      'Clear repayment terms: Know exactly what you owe from day one.',
      "Same-day disbursement: Funds hit your account the day you're approved.",
    ],
  },
  'pay-day-loan': {
    title: 'Pay-Day Loan',
    summary: "Can't wait till payday? Borrow against your next alert and pay back the moment it drops. Simple, fast, stress-free.",
    cardImage: '/assets/service-payday.webp',
    image: null,
    overviewTitle: 'Bridge the Gap Between Now and Payday',
    overview: [
      "Payday can feel far away when an urgent expense shows up first. Our Pay-Day Loan lets salary earners borrow against their next paycheck, so you're never stuck waiting when you need cash now.",
      "Repayment is simple: the loan is settled the moment your salary drops, with no stress and no confusion. It's built specifically for people earning a fixed income who need short-term breathing room.",
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Fast approval: Get a decision within hours of applying.',
      'Aligned repayment: Pay back automatically when your salary lands.',
      'No collateral required: We lend based on your income, not property.',
      'No hidden fees: What you see is what you owe, nothing more.',
      "Same-day disbursement: Funds hit your account the day you're approved.",
    ],
  },
  'business-loan': {
    title: 'Business Loan',
    summary: 'Restock, expand, or seize that next big order. We fund the moves that grow your business, not just cover the gaps.',
    cardImage: '/assets/service-business.webp',
    image: null,
    imagePosition: '50% 10%',
    overviewTitle: 'Fund the Moves That Grow Your Business',
    overview: [
      'Every business owner knows the feeling: a good opportunity shows up and you need capital fast to seize it. Our Business Loan gives you the funding to restock inventory, expand your shop, or fulfil a big order, without slowing your momentum.',
      "We understand that businesses don't grow on a fixed schedule. That's why our process is fast enough to match your pace, so you can act on opportunities the moment they appear.",
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Fast approval: Get a decision within hours of applying.',
      'Flexible loan amounts: Funding that scales with your business needs.',
      'No collateral required: We lend based on trust in your hustle.',
      'No hidden fees: What you see is what you owe, nothing more.',
      "Same-day disbursement: Funds hit your account the day you're approved.",
    ],
  },
  'group-loan': {
    title: 'Group Loan',
    summary: 'Trade together, borrow together. Designed for market groups and cooperatives who grow stronger by lifting each other up.',
    cardImage: '/assets/service-group-loan.webp',
    image: '/assets/service-group-loan.webp',
    imagePosition: '50% 70%',
    overviewTitle: 'Grow Stronger Together',
    overview: [
      'Market groups and cooperatives have always understood the power of collective strength. Our Group Loan is designed for trading groups and cooperatives who want to borrow together and grow together, with terms that work for every member.',
      "By pooling trust and shared accountability, groups often unlock better terms than an individual application alone. It's funding built the way Nigerian markets have always worked: together.",
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Fast approval: Get a decision within hours of applying.',
      'Shared accountability: Terms built around group trust and cooperation.',
      'No collateral required: We lend based on trust, not property.',
      'No hidden fees: What you see is what you owe, nothing more.',
      "Same-day disbursement: Funds hit your group account the day you're approved.",
    ],
  },
  'lpo-financing': {
    title: 'LPO Financing',
    summary: 'Got a local purchase order but no capital to fulfil it? We bridge the gap so you never turn down a good contract again.',
    cardImage: '/assets/service-lpo-financing.webp',
    image: '/assets/service-lpo-financing.webp',
    imagePosition: '54% 50%',
    overviewTitle: 'Never Turn Down a Good Contract Again',
    overview: [
      'Winning a Local Purchase Order is a big deal, but fulfilling it without upfront capital can be a challenge. Our LPO Financing bridges that gap, giving you the funds to deliver on your contract without draining your business.',
      'We assess your purchase order and provide the working capital you need to fulfil it confidently, so you can take on bigger contracts without worrying about cash flow.',
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Fast approval: Get a decision within hours of applying.',
      'Contract-based funding: Financing sized to match your purchase order.',
      'No traditional collateral required: We assess based on your contract.',
      'No hidden fees: What you see is what you owe, nothing more.',
      'Fast disbursement: Get funded quickly so you can deliver on time.',
    ],
  },
  'asset-financing': {
    title: 'Asset Financing',
    summary: 'Get the equipment, tools, or inventory your business needs today, and spread the cost over time while you put it to work.',
    cardImage: '/assets/service-asset-financing.webp',
    image: '/assets/service-asset-financing.webp',
    imagePosition: '50% 50%',
    overviewTitle: 'Get the Tools You Need to Work and Earn',
    overview: [
      "Whether it's a new sewing machine, a generator, or essential equipment for your trade, our Asset Financing lets you get what you need today and pay for it over time, while it's already helping you earn.",
      "We believe the right tools shouldn't be out of reach just because of upfront cost. This loan is built to help you invest in your business without draining your working capital.",
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Fast approval: Get a decision within hours of applying.',
      'Flexible repayment: Spread the cost over a term that suits you.',
      'No extra collateral required: The asset itself supports the financing.',
      'No hidden fees: What you see is what you owe, nothing more.',
      'Quick processing: Get your equipment or tools without long delays.',
    ],
  },
  'savings-and-investment': {
    title: 'Savings & Investment',
    summary: 'Spend. Save. Earn. Grow your money with a plan that works as hard as you do, so your hustle today builds your future tomorrow.',
    cardImage: '/assets/service-savings-investment.webp',
    image: '/assets/service-savings-investment.webp',
    imagePosition: '50% 48%',
    overviewTitle: 'Build a Future While You Handle Today',
    overview: [
      'Managing daily expenses is only one part of financial health, building for tomorrow is the other. Our Savings & Investment plan helps you set money aside consistently, so your hard work today grows into real financial security.',
      'No complicated investment jargon, no confusing terms. Just a simple plan that lets you save steadily and earn returns, built for people who want to grow without the guesswork.',
    ],
    benefitsTitle: 'Why choose this loan?',
    benefits: [
      'Simple setup: Start saving in minutes, no complicated forms.',
      'Flexible contributions: Save an amount that fits your income.',
      'Real returns: Your money grows the longer you save.',
      'No hidden fees: What you see is what you keep.',
      'Easy access: Track your savings and growth anytime.',
    ],
  },
};

const SERVICE_CMS_STORAGE_KEY = 'iou-finance-services-cms-v2';
const LEGACY_SERVICE_CMS_STORAGE_KEY = 'iou-finance-services-cms-v1';
const RETIRED_SERVICE_SLUGS = new Set([
  'personal-loan',
  'group-loan',
  'lpo-financing',
  'asset-financing',
]);
const refreshedServiceImageSlugs = new Set([
  'group-loan',
  'lpo-financing',
  'asset-financing',
  'savings-and-investment',
]);
const OPTIMIZED_SERVICE_IMAGE_BY_LEGACY_URL = Object.freeze({
  '/assets/service-emergency.png': '/assets/service-emergency.webp',
  '/assets/service-payday.png': '/assets/service-payday.webp',
  '/assets/service-business.png': '/assets/service-business.webp',
  '/assets/service-savings-investment.jpg': '/assets/service-savings-investment.webp',
});

function createDefaultServiceRecords() {
  return Object.entries(defaultServiceDetailContentBySlug)
    .filter(([slug]) => !RETIRED_SERVICE_SLUGS.has(slug))
    .map(([slug, service], index) => ({
      ...service,
      slug,
      published: true,
      order: index,
      updatedAt: null,
    }));
}

function readServiceCmsRecords() {
  try {
    const serverRecords = window.__IOU_CMS__?.services || window.__IOU_SERVICES__;
    const currentRecords = window.localStorage.getItem(SERVICE_CMS_STORAGE_KEY);
    const legacyRecords = window.localStorage.getItem(LEGACY_SERVICE_CMS_STORAGE_KEY);
    const isLegacyMigration = !currentRecords && Boolean(legacyRecords);
    const storedRecords = Array.isArray(serverRecords)
      ? serverRecords
      : JSON.parse(currentRecords || legacyRecords || 'null');
    if (!Array.isArray(storedRecords) || !storedRecords.length) return createDefaultServiceRecords();

    const normalisedRecords = storedRecords
      .filter((service) => service
        && typeof service.slug === 'string'
        && typeof service.title === 'string'
        && !RETIRED_SERVICE_SLUGS.has(service.slug))
      .map((service, index) => {
        const defaults = defaultServiceDetailContentBySlug[service.slug] || {};
        const useRefreshedImage = isLegacyMigration && refreshedServiceImageSlugs.has(service.slug);
        const storedImage = service.cardImage || service.image || defaults.cardImage || null;
        const canonicalImage = useRefreshedImage
          ? defaults.cardImage
          : OPTIMIZED_SERVICE_IMAGE_BY_LEGACY_URL[storedImage] || storedImage;
        let imagePosition = useRefreshedImage
          ? defaults.imagePosition
          : service.imagePosition || defaults.imagePosition || '50% 50%';
        const needsDefaultFocusCorrection = ['business-loan', 'personal-loan'].includes(service.slug)
          && canonicalImage === defaults.cardImage
          && (!service.imagePosition || service.imagePosition === '50% 50%');
        if (needsDefaultFocusCorrection) imagePosition = defaults.imagePosition;

        return {
          summary: '',
          cardImage: canonicalImage,
          image: canonicalImage,
          imagePosition,
          overviewTitle: '',
          overview: [],
          benefitsTitle: 'Why choose this loan?',
          benefits: [],
          published: true,
          order: index,
          updatedAt: null,
          ...service,
          cardImage: canonicalImage,
          image: canonicalImage,
          imagePosition,
        };
      })
      .sort((a, b) => a.order - b.order);

    if (isLegacyMigration) {
      window.localStorage.setItem(SERVICE_CMS_STORAGE_KEY, JSON.stringify(normalisedRecords));
    }

    return normalisedRecords;
  } catch {
    return createDefaultServiceRecords();
  }
}

function saveServiceCmsRecords(records) {
  const orderedRecords = records
    .filter((service) => !RETIRED_SERVICE_SLUGS.has(service.slug))
    .map((service, index) => {
    const canonicalImage = service.cardImage || service.image || null;
    return { ...service, cardImage: canonicalImage, image: canonicalImage, order: index };
    });
  const serialisedRecords = JSON.stringify(orderedRecords);
  if (serialisedRecords.length > 4_000_000) throw new Error('CMS_STORAGE_LIMIT');
  window.localStorage.setItem(SERVICE_CMS_STORAGE_KEY, serialisedRecords);
  return orderedRecords;
}

const serviceCmsRecords = readServiceCmsRecords();
const serviceDetailContentBySlug = Object.fromEntries(
  serviceCmsRecords
    .filter((service) => service.published)
    .map(({ slug, published, order, updatedAt, ...service }) => [slug, service]),
);

const servicesCatalog = Object.entries(serviceDetailContentBySlug).map(([slug, service]) => ({
  slug,
  title: service.title,
  description: service.summary,
  image: service.cardImage,
  imagePosition: service.imagePosition,
  href: `/services/${slug}`,
}));

const services = servicesCatalog.slice(0, 4);

function toServiceSlug(title) {
  return title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 8);
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';

  const isCurrentPage = (href) => {
    const targetPath = href.split('#')[0] || '/';

    if (targetPath === '/services') {
      return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
    }

    return currentPath === targetPath;
  };

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 8);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <header className={`site-header${isScrolled ? ' site-header-scrolled' : ''}`} data-node-id="53:2012">
      <div className="site-header-inner">
        <a className="brand" href="/#home" aria-label="IOU Finance home">
          <img src={siteContent.global.brand.headerLogo.src} alt={siteContent.global.brand.headerLogo.alt} style={{ objectPosition: siteContent.global.brand.headerLogo.position }} fetchPriority="high" decoding="async" />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteContent.global.navigation.items.map(({ label, href }) => {
            const isActive = isCurrentPage(href);

            return (
              <a
                className={`navigation-link${isActive ? ' navigation-link-active' : ''}`}
                key={label}
                href={href}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <a className="button button-primary nav-cta" href="/application">{siteContent.global.navigation.applicationLabel}</a>

        <details className="mobile-menu">
          <summary aria-label="Toggle navigation menu"><span /><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {siteContent.global.navigation.items.map(({ label, href }) => {
              const isActive = isCurrentPage(href);

              return (
                <a
                  className={`navigation-link${isActive ? ' navigation-link-active' : ''}`}
                  key={label}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </a>
              );
            })}
            <a className="button button-primary" href="/application">{siteContent.global.navigation.applicationLabel}</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

const loanCurrencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

const formatMoneyInput = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? Number(digits).toLocaleString('en-NG') : '';
};

function LoanCalculator() {
  const minAmount = 50000;
  const maxAmount = 5000000;
  const minDuration = 1;
  const maxDuration = 12;
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(500000);
  const [duration, setDuration] = useState(6);
  const calculatorRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsidePress = (event) => {
      if (calculatorRef.current && !calculatorRef.current.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const principal = Number(amount) || 0;
  const months = Number(duration) || 0;
  const interest = principal * 0.2 * months;
  const totalRepayment = principal + interest;
  const monthlyRepayment = months ? totalRepayment / months : 0;
  const amountProgress = ((principal - minAmount) / (maxAmount - minAmount)) * 100;
  const durationProgress = ((months - minDuration) / (maxDuration - minDuration)) * 100;
  const hasValidValues = principal >= minAmount && principal <= maxAmount && months >= minDuration && months <= maxDuration;
  const applicationHref = `/application?amount=${principal}&duration=${months}`;

  return (
    <div className={`loan-calculator${isOpen ? ' loan-calculator-open' : ''}`} ref={calculatorRef}>
      {isOpen && (
        <>
          <button className="loan-calculator-backdrop" type="button" aria-label="Close loan calculator" onClick={() => setIsOpen(false)} />
          <section
            className="loan-calculator-panel"
            id="loan-calculator-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loan-calculator-title"
          >
          <div className="loan-calculator-panel-header">
            <h2 id="loan-calculator-title">{siteContent.calculator.title}</h2>
            <button
              className="loan-calculator-close"
              type="button"
              aria-label="Close loan calculator"
              onClick={() => setIsOpen(false)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          <div className="loan-calculator-fields">
            <div className="loan-calculator-field">
              <div className="loan-calculator-field-heading">
                <label htmlFor="loan-amount">{siteContent.calculator.amountLabel}</label>
                <span className="loan-calculator-value loan-calculator-value-amount">
                  <span aria-hidden="true">₦</span>
                  <input
                    id="loan-amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={formatMoneyInput(amount)}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, '');
                      setAmount(digits ? Number(digits) : '');
                    }}
                  />
                </span>
              </div>
              <input
                className="loan-calculator-range"
                type="range"
                min={minAmount}
                max={maxAmount}
                step="50000"
                value={Math.min(maxAmount, Math.max(minAmount, principal || minAmount))}
                style={{ '--range-progress': `${Math.min(100, Math.max(0, amountProgress))}%` }}
                aria-label="Loan amount"
                onChange={(event) => setAmount(Number(event.target.value))}
              />
              <div className="loan-calculator-limits"><span>{siteContent.calculator.minimumAmountLabel}</span><span>{siteContent.calculator.maximumAmountLabel}</span></div>
            </div>

            <div className="loan-calculator-field">
              <div className="loan-calculator-field-heading">
                <label htmlFor="loan-duration">{siteContent.calculator.durationLabel}</label>
                <span className="loan-calculator-value loan-calculator-value-duration">
                  <input
                    id="loan-duration"
                    type="number"
                    min={minDuration}
                    max={maxDuration}
                    placeholder="0"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value === '' ? '' : Number(event.target.value))}
                  />
                  <span aria-hidden="true">{siteContent.calculator.durationUnit}</span>
                </span>
              </div>
              <input
                className="loan-calculator-range"
                type="range"
                min={minDuration}
                max={maxDuration}
                value={Math.min(maxDuration, Math.max(minDuration, months || minDuration))}
                style={{ '--range-progress': `${Math.min(100, Math.max(0, durationProgress))}%` }}
                aria-label="Loan duration in months"
                onChange={(event) => setDuration(Number(event.target.value))}
              />
              <div className="loan-calculator-limits"><span>{siteContent.calculator.minimumDurationLabel}</span><span>{siteContent.calculator.maximumDurationLabel}</span></div>
            </div>
          </div>

          <div className="loan-calculator-summary-block">
            <div className="loan-calculator-summary" aria-live="polite">
              <div><span>{siteContent.calculator.totalLabel}</span><strong>{loanCurrencyFormatter.format(totalRepayment)}</strong></div>
              <div><span>{siteContent.calculator.monthlyLabel}</span><strong>{loanCurrencyFormatter.format(monthlyRepayment)}</strong></div>
              <div><span>{siteContent.calculator.interestLabel}</span><strong>{loanCurrencyFormatter.format(interest)}</strong></div>
            </div>
          </div>

          <a
            className={`button button-primary loan-calculator-apply${hasValidValues ? '' : ' loan-calculator-apply-disabled'}`}
            href={hasValidValues ? applicationHref : undefined}
            aria-disabled={!hasValidValues}
          >
            {siteContent.calculator.applyLabel}
          </a>
          </section>
        </>
      )}

      <button
        className="loan-calculator-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="loan-calculator-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{siteContent.calculator.toggleLabel}</span>
      </button>
    </div>
  );
}

function Hero() {
  const content = siteContent.home.hero;
  return (
    <section className="hero" id="home" data-node-id="15:72">
      <img className="hero-image" src={content.media.src} alt={content.media.alt} style={{ objectPosition: content.media.position }} fetchPriority="high" decoding="async" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-copy">
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <div className="hero-actions">
          <a className="button button-primary" href="/application">{content.primaryLabel}</a>
          <a className="button button-secondary" href="/services">{content.secondaryLabel}</a>
        </div>
      </div>
      <LoanCalculator />
    </section>
  );
}

function AboutSection() {
  const content = siteContent.home.about;
  return (
    <section className="about-section" id="about" data-node-id="30:2">
      <div className="about-content">
        <div className="about-heading" data-node-id="30:6">
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
        </div>

        <div className="about-summary" data-node-id="30:9">
          <p>{content.description}</p>
          <a className="button button-primary" href="/about">{content.buttonLabel}</a>
        </div>
      </div>
    </section>
  );
}

function ServicesHero() {
  const content = siteContent.servicesPage.hero;
  return (
    <section className="services-hero" data-node-id="100:479">
      <img className="services-hero-image services-page-hero-image" src={content.media.src} alt={content.media.alt} style={{ objectPosition: content.media.position }} fetchPriority="high" decoding="async" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content">
        <p>{content.label}</p>
        <h1>{content.title}</h1>
      </div>
    </section>
  );
}

function FaqHero() {
  const content = siteContent.faqPage.hero;
  return (
    <section className="services-hero" data-node-id="107:746">
      <img className="services-hero-image faq-hero-image" src={content.media.src} alt={content.media.alt} style={{ objectPosition: content.media.position }} fetchPriority="high" decoding="async" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content">
        <p>{content.label}</p>
        <h1>{content.title}</h1>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="faq-section" id="faqs" data-node-id="107:750">
      <div className="faq-list">
        {siteContent.faqPage.items.map(({ question, answer }) => (
          <details
            className="faq-item"
            key={question}
            onClick={(event) => {
              if (event.target.closest('summary')) return;
              event.currentTarget.open = !event.currentTarget.open;
            }}
          >
            <summary>
              <span>{question}</span>
              <span className="faq-chevron" aria-hidden="true">
                <img className="faq-chevron-open" src="/assets/faq-chevron-down.svg" alt="" />
                <img className="faq-chevron-closed" src="/assets/faq-chevron-up.svg" alt="" />
              </span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function AboutPageHero() {
  const content = siteContent.aboutPage.hero;
  return (
    <section className="services-hero about-page-hero" data-node-id="142:1955">
      <img className="services-hero-image about-hero-image" src={content.media.src} alt={content.media.alt} style={{ objectPosition: content.media.position }} fetchPriority="high" decoding="async" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content about-hero-content">
        <p>{content.label}</p>
        <h1>{content.title}</h1>
      </div>
    </section>
  );
}

function ContactPageHero() {
  const content = siteContent.contactPage.hero;
  return (
    <section className="services-hero contact-page-hero">
      <img className="services-hero-image contact-hero-image" src={content.media.src} alt={content.media.alt} style={{ objectPosition: content.media.position }} fetchPriority="high" decoding="async" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content contact-hero-content">
        <p>{content.label}</p>
        <h1>{content.title}</h1>
      </div>
    </section>
  );
}

function ApplicationPageHero() {
  const content = siteContent.applicationPage.hero;
  return (
    <section className="services-hero application-page-hero">
      <img className="services-hero-image application-hero-image" src={content.media.src} alt={content.media.alt} style={{ objectPosition: content.media.position }} fetchPriority="high" decoding="async" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content contact-hero-content application-hero-content">
        <p>{content.label}</p>
        <h1>{content.title}</h1>
      </div>
    </section>
  );
}

function AboutStatementSection() {
  return (
    <section className="about-statement-section" data-node-id="142:1959">
      <p>{siteContent.aboutPage.statement}</p>
    </section>
  );
}

function AboutMissionSection() {
  const mission = siteContent.aboutPage.mission;
  const values = siteContent.aboutPage.values;

  return (
    <section className="about-mission-section" data-node-id="148:2212">
      <div className="about-detail-row">
        <div className="about-mission-copy">
          <div className="about-mission-intro">
            <p className="about-mission-label">{mission.label}</p>
            <h2>{mission.title}</h2>
            <p>{mission.description}</p>
          </div>

          <div className="about-mission-points">
            {mission.points.map((point) => (
              <article key={point.title}>
                <span className="about-point-icon"><img src={point.icon.src} alt={point.icon.alt} /></span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="about-media-placeholder about-mission-media">
          <img src={mission.media.src} alt={mission.media.alt} style={{ objectPosition: mission.media.position }} loading="lazy" decoding="async" />
        </div>
      </div>

      <div className="about-detail-row about-values-row">
        <div className="about-media-placeholder about-values-media">
          <img src={values.media.src} alt={values.media.alt} style={{ objectPosition: values.media.position }} loading="lazy" decoding="async" />
        </div>
        <div className="about-values-copy">
          <div>
            <h2>{values.title}</h2>
            <p>{values.description}</p>
          </div>

          <div className="about-values-block">
            <h3>{values.heading}</h3>
            <div className="about-values-grid">
              {values.items.map((value) => (
                <div className="about-value-item" key={value}>
                  <img src="/assets/checkmark-circle.svg" alt="" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-values-actions">
            <a className="button button-primary" href="/application">{siteContent.global.buttons.apply}</a>
            <a className="button button-dark-outline" href="/services">{siteContent.global.buttons.exploreServices}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutTeamSection() {
  const content = siteContent.aboutPage.team;

  return (
    <section className="about-team-section" data-node-id="148:2286">
      <div className="about-team-container">
        <div className="about-team-heading">
          <p>{content.label}</p>
          <h2>{content.title}</h2>
        </div>

        <div className="about-team-grid">
          {content.members.map(({ name, role, photo }) => (
            <article className="about-team-member" key={name}>
              <div className="about-team-photo">{photo.src && <img src={photo.src} alt={photo.alt} style={{ objectPosition: photo.position }} loading="lazy" decoding="async" />}</div>
              <div className="about-team-meta">
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const content = siteContent.contactPage;

  return (
    <section className="contact-section" data-node-id="155:2795">
      <div className="contact-section-container">
        <h2>{content.sectionTitle}</h2>
        <div className="contact-cards">
          {content.cards.map(({ type, description, value, href, icon }) => (
            <article className="contact-card" key={type}>
              <span className="contact-card-icon"><img src={icon.src} alt={icon.alt} /></span>
              <div className="contact-card-content">
                <div className="contact-card-copy">
                  <h3>{type}</h3>
                  <p>{description}</p>
                </div>
                {href ? <a className="contact-card-link" href={href}>{value}</a> : <p className="contact-card-link">{value}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApplicationFormSection() {
  const content = siteContent.applicationPage.form;
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [utilityBillFileName, setUtilityBillFileName] = useState('');
  const [utilityBillError, setUtilityBillError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [submitError, setSubmitError] = useState('');
  const applicationParams = new URLSearchParams(window.location.search);
  const amountParam = applicationParams.get('amount') || '';
  const durationParam = applicationParams.get('duration') || '';
  const prefilledAmount = /^\d+$/.test(amountParam) ? amountParam : '';
  const prefilledDuration = /^\d+$/.test(durationParam) ? durationParam : '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (fileError || isSubmitting) return;
    const form = event.currentTarget;

    setIsSubmitting(true);
    setSubmitStatus('');
    setSubmitError('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: new FormData(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not submit your application right now.');

      setSubmitStatus(result.message || 'Your application has been submitted successfully.');
      form.reset();
      setFileName('');
      setUtilityBillFileName('');
      setIsFormComplete(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We could not submit your application right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormValidity = (event) => {
    setIsFormComplete(event.currentTarget.checkValidity());
  };

  const handleMoneyInput = (event) => {
    event.currentTarget.value = formatMoneyInput(event.currentTarget.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      event.target.value = '';
      setFileName('');
      setFileError('Please choose a JPG or PNG smaller than 5MB.');
      return;
    }

    setFileName(file?.name || '');
    setFileError('');
  };

  const handleUtilityBillChange = (event) => {
    const file = event.target.files?.[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (file && (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024)) {
      event.target.value = '';
      setUtilityBillFileName('');
      setUtilityBillError('Please choose a PDF, JPG or PNG smaller than 5MB.');
      return;
    }

    setUtilityBillFileName(file?.name || '');
    setUtilityBillError('');
  };

  return (
    <section className="application-form-section" data-node-id="159:3292">
      <form className="application-form" onSubmit={handleSubmit} onInput={handleFormValidity} onChange={handleFormValidity}>
        <div className="application-form-row">
          <label className="application-field">
            <span>{content.firstNameLabel} <b aria-hidden="true">*</b></span>
            <input name="firstName" autoComplete="given-name" placeholder={content.firstNamePlaceholder} required />
          </label>
          <label className="application-field">
            <span>{content.lastNameLabel} <b aria-hidden="true">*</b></span>
            <input name="lastName" autoComplete="family-name" placeholder={content.lastNamePlaceholder} required />
          </label>
        </div>

        <div className="application-form-row">
          <label className="application-field">
            <span>{content.phoneLabel} <b aria-hidden="true">*</b></span>
            <input name="phone" type="tel" autoComplete="tel" placeholder={content.phonePlaceholder} required />
          </label>
          <label className="application-field">
            <span>{content.emailLabel} <b aria-hidden="true">*</b></span>
            <input name="email" type="email" autoComplete="email" placeholder={content.emailPlaceholder} required />
          </label>
        </div>

        <div className="application-form-row">
          <label className="application-field">
            <span>{content.employerLabel} <b aria-hidden="true">*</b></span>
            <input name="employer" autoComplete="organization" placeholder={content.employerPlaceholder} required />
          </label>
          <label className="application-field">
            <span>{content.incomeLabel} <b aria-hidden="true">*</b></span>
            <input name="monthlyIncome" inputMode="numeric" onInput={handleMoneyInput} required />
          </label>
        </div>

        <div className="application-form-row">
          <label className="application-field">
            <span>{content.amountLabel} <b aria-hidden="true">*</b></span>
            <input name="amountNeeded" inputMode="numeric" defaultValue={formatMoneyInput(prefilledAmount)} onInput={handleMoneyInput} required />
          </label>
          <label className="application-field">
            <span>{content.durationLabel} <b aria-hidden="true">*</b></span>
            <input name="duration" type="number" inputMode="numeric" min="1" max="12" defaultValue={prefilledDuration} required />
          </label>
        </div>

        <label className="application-field application-address-field">
          <span>{content.addressLabel} <b aria-hidden="true">*</b></span>
          <textarea
            name="homeAddress"
            autoComplete="street-address"
            placeholder={content.addressPlaceholder}
            rows="3"
            required
          />
        </label>

        <div className="application-form-row application-identification-row">
          <label className="application-field">
            <span>{content.bvnLabel} <b aria-hidden="true">*</b></span>
            <input name="bvn" inputMode="numeric" minLength="11" maxLength="11" required />
          </label>
          <label className="application-field">
            <span>{content.ninLabel} <b aria-hidden="true">*</b></span>
            <input name="nin" inputMode="numeric" maxLength="11" required />
          </label>
        </div>

        <label className="application-upload-field">
          <span className="application-upload-label">{content.passportLabel} <b aria-hidden="true">*</b></span>
          <span className="application-upload-box">
            <input
              name="passportPhotograph"
              type="file"
              accept="image/jpeg,image/png"
              aria-describedby="passport-upload-help passport-upload-error"
              required
              onChange={handleFileChange}
            />
            <img src={content.uploadIcon.src} alt={content.uploadIcon.alt} />
            <span className="application-upload-copy">
              <strong>{fileName || content.passportPrompt}</strong>
              <small id="passport-upload-help">{content.passportHelp.split('|').map((item, index) => <span key={item.trim()}>{index > 0 && <i />}{item.trim()}</span>)}</small>
            </span>
          </span>
          {fileError && <span className="application-upload-error" id="passport-upload-error" role="alert">{fileError}</span>}
        </label>

        <label className="application-upload-field">
          <span className="application-upload-label">{content.utilityBillLabel} <b aria-hidden="true">*</b></span>
          <span className="application-upload-box">
            <input
              name="utilityBill"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              aria-describedby="utility-bill-upload-help utility-bill-upload-error"
              required
              onChange={handleUtilityBillChange}
            />
            <img src={content.uploadIcon.src} alt={content.uploadIcon.alt} />
            <span className="application-upload-copy">
              <strong>{utilityBillFileName || content.utilityPrompt}</strong>
              <small id="utility-bill-upload-help">{content.utilityHelp.split('|').map((item, index) => <span key={item.trim()}>{index > 0 && <i />}{item.trim()}</span>)}</small>
            </span>
          </span>
          {utilityBillError && <span className="application-upload-error" id="utility-bill-upload-error" role="alert">{utilityBillError}</span>}
        </label>

        <p className="application-consent">
          {content.consentPrefix}{' '}
          <a href="/terms-and-conditions">{siteContent.global.footer.termsLabel}</a> and{' '}
          <a href="/privacy-policy">{siteContent.global.footer.privacyLabel}</a>
        </p>

        <button className="button button-primary application-submit" type="submit" disabled={isSubmitting || !isFormComplete || Boolean(fileError) || Boolean(utilityBillError)}>
          {isSubmitting ? content.submittingLabel : content.submitLabel}
        </button>
        {submitStatus && (
          <p className="application-form-status" role="status">
            {submitStatus}
          </p>
        )}
        {submitError && <p className="application-form-status application-form-status-error" role="alert">{submitError}</p>}
      </form>
    </section>
  );
}

function ServiceDetailIntro({ title, summary }) {
  return (
    <section className="service-detail-intro" data-node-id="131:1839">
      <div>
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
    </section>
  );
}

function ServiceDetailMedia({ image, imagePosition, title }) {
  return (
    <section className="service-detail-media-section" data-node-id="131:1843">
      <div className="service-detail-media">
        {image && <img src={image} alt={`${title} service`} style={{ objectPosition: imagePosition }} loading="lazy" decoding="async" />}
      </div>
    </section>
  );
}

function ServiceDetailOverview({ overviewTitle, overview, benefitsTitle, benefits }) {
  return (
    <section className="service-detail-overview" data-node-id="131:1408">
      <div className="service-detail-overview-container">
        <div className="service-detail-description">
          <h2>{overviewTitle}</h2>
          <div>{overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
        <div className="service-detail-benefits">
          <h2>{benefitsTitle}</h2>
          <ul>{benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ title, description, image, imagePosition, arrow = '/assets/arrow-forward.svg', href }) {
  const detailHref = href || `/services/${toServiceSlug(title)}`;

  return (
    <a className="service-card" href={detailHref}>
      <div className="service-image" aria-hidden="true">
        {image && <img src={image} alt="" style={{ objectPosition: imagePosition }} loading="lazy" decoding="async" />}
      </div>
      <div className="service-card-content">
        <div className="service-copy">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="service-link">
          <span>{siteContent.global.buttons.learnMore}</span>
          <img src={arrow} alt="" />
        </span>
      </div>
    </a>
  );
}

function ServicesSection() {
  const content = siteContent.home.services;
  return (
    <section className="services-section" id="services" data-node-id="32:19">
      <div className="services-container">
        <div className="services-heading">
          <div className="services-title">
            <p className="section-label">{content.label}</p>
            <h2>{content.title}</h2>
          </div>
          <a className="button button-primary services-heading-cta" href="/services">{content.buttonLabel}</a>
        </div>

        <div className="services-grid">
          {services.map((service) => <ServiceCard key={service.title} {...service} />)}
        </div>

        <div className="services-actions">
          <a className="button button-primary" href="/services">{content.buttonLabel}</a>
        </div>
      </div>
    </section>
  );
}

function ServicesCatalogSection() {
  return (
    <section className="services-catalog-section" data-node-id="100:584">
      <div className="services-catalog-grid">
        {servicesCatalog.map((service) => (
          <ServiceCard
            {...service}
            arrow="/assets/service-catalog-arrow.svg"
            key={service.title}
          />
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  const content = siteContent.home.benefits;
  const contentBenefits = content.items;
  const listRef = useRef(null);
  const stickyMediaRef = useRef(null);
  const stickyImageRefs = useRef([]);

  useEffect(() => {
    const list = listRef.current;
    const stickyMedia = stickyMediaRef.current;
    if (!list || !stickyMedia) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = null;

    const updateImages = () => {
      animationFrame = null;
      if (window.innerWidth <= 900) return;

      const listRect = list.getBoundingClientRect();
      const mediaRect = stickyMedia.getBoundingClientRect();
      const cardHeight = list.scrollHeight / contentBenefits.length;
      const mediaCenter = mediaRect.top + (mediaRect.height / 2);
      const rawProgress = ((mediaCenter - listRect.top) / cardHeight) - 0.5;
      const progress = Math.max(0, Math.min(contentBenefits.length - 1, rawProgress));
      const reducedIndex = Math.round(progress);

      stickyImageRefs.current.forEach((image, index) => {
        if (!image) return;
        const distance = Math.min(Math.abs(progress - index), 1);
        const opacity = reducedMotion.matches ? Number(index === reducedIndex) : 1 - distance;
        image.style.opacity = opacity.toFixed(3);
        image.style.transform = reducedMotion.matches ? 'none' : `scale(${1 + (distance * 0.025)})`;
        image.style.filter = reducedMotion.matches ? 'none' : `blur(${distance * 4}px)`;
      });
    };

    const scheduleUpdate = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(updateImages);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    reducedMotion.addEventListener('change', scheduleUpdate);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
    };
  }, []);

  return (
    <section className="benefits-section" id="benefits" data-node-id="37:93">
      <div className="benefits-container">
        <div className="benefits-heading">
          <p className="section-label">{content.label}</p>
          <h2>{content.title}</h2>
        </div>

        <div className="benefits-content">
          <div className="benefits-list" ref={listRef}>
            {contentBenefits.map((benefit) => (
              <article className="benefit-card" key={benefit.title}>
                <img
                  className="benefit-media-mobile"
                  src={benefit.media.src}
                  alt={benefit.media.alt}
                  style={{ objectPosition: benefit.media.position }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="benefit-copy">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="benefit-sticky-media" aria-hidden="true" data-node-id="37:110" ref={stickyMediaRef}>
            {contentBenefits.map((benefit, index) => (
              <img
                className="benefit-sticky-image"
                src={benefit.media.src}
                alt=""
                style={{ objectPosition: benefit.media.position }}
                loading="lazy"
                decoding="async"
                ref={(image) => { stickyImageRefs.current[index] = image; }}
                key={benefit.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const content = siteContent.home.stats;
  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setProgress(1);
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      observer.disconnect();
      const startedAt = performance.now();
      const duration = 1600;

      const animate = (timestamp) => {
        const elapsed = Math.min((timestamp - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        setProgress(eased);
        if (elapsed < 1) animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, { threshold: 0.35 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const formatStat = ({ target, decimals = 0, prefix = '', suffix = '' }, currentProgress) => {
    const currentValue = target * currentProgress;
    const number = decimals ? currentValue.toFixed(decimals) : Math.round(currentValue).toString();
    return `${prefix}${number}${suffix}`;
  };

  return (
    <section className="stats-section" id="stats" aria-label={content.accessibleLabel} data-node-id="40:113" ref={sectionRef}>
      <div className="stats-container">
        {content.items.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <strong>
              <span className="sr-only">{formatStat(stat, 1)}</span>
              <span aria-hidden="true">{formatStat(stat, progress)}</span>
            </strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessImage({ src, alt, position = 'center' }) {
  return (
    <div className="process-placeholder">
      <img
        key={src}
        className="process-supporting-image"
        src={src}
        alt={alt}
        style={{ objectPosition: position }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const content = siteContent.home.process;
  const step = content.steps[activeStep];

  return (
    <section className="process-section" id="process" data-node-id="45:485">
      <div className="process-row step-row">
        <ProcessImage src={step.media.src} alt={step.media.alt} position={step.media.position} />

        <div className="step-panel">
          <div className="step-copy" aria-live="polite">
            <span className="step-number">{activeStep + 1}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
          </div>

          <div className="step-controls">
            <button
              type="button"
              onClick={() => setActiveStep((current) => current - 1)}
              disabled={activeStep === 0}
              aria-label={content.previousLabel}
            >
              <img src={activeStep === 0 ? '/assets/step-back-disabled.svg' : '/assets/step-back.svg'} alt="" />
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((current) => current + 1)}
              disabled={activeStep === content.steps.length - 1}
              aria-label={content.nextLabel}
            >
              <img src={activeStep === content.steps.length - 1 ? '/assets/step-forward-disabled.svg' : '/assets/step-forward.svg'} alt="" />
            </button>
          </div>
        </div>
      </div>

      <div className="process-row eligibility-row">
        <div className="eligibility-content">
          <div className="eligibility-intro">
            <h2>{content.eligibility.title}</h2>
            <p>{content.eligibility.description}</p>
          </div>

          <div className="documents-block">
            <h3>{content.eligibility.documentsHeading}</h3>
            <div className="documents-grid">
              {content.eligibility.documents.map((document) => (
                <div className="document-item" key={document}>
                  <img src="/assets/checkmark-circle.svg" alt="" />
                  <span>{document}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="eligibility-actions">
            <a className="button button-primary" href="/application">{siteContent.global.buttons.apply}</a>
            <a className="button button-dark-outline" href="/services">{siteContent.global.buttons.exploreServices}</a>
          </div>
        </div>

        <ProcessImage
          src={content.eligibility.media.src}
          alt={content.eligibility.media.alt}
          position={content.eligibility.media.position}
        />
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const content = siteContent.home.testimonials;
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const visibleTestimonials = window.innerWidth >= 1350 ? 4 : window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  const lastTestimonial = content.items.length - visibleTestimonials;

  useEffect(() => {
    const resetCarousel = () => {
      setActiveTestimonial(0);
      viewportRef.current?.scrollTo({ left: 0 });
    };

    window.addEventListener('resize', resetCarousel);
    return () => window.removeEventListener('resize', resetCarousel);
  }, []);

  const moveCarousel = (direction) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;

    if (!viewport || !track || !firstCard) return;

    const next = Math.min(Math.max(activeTestimonial + direction, 0), lastTestimonial);
    const step = firstCard.getBoundingClientRect().width + 20;
    const left = Math.min(next * step, track.scrollWidth - viewport.clientWidth);

    viewport.scrollTo({ left, behavior: 'smooth' });
    setActiveTestimonial(next);
  };

  const syncActiveTestimonial = () => {
    const viewport = viewportRef.current;
    const firstCard = trackRef.current?.firstElementChild;
    if (!viewport || !firstCard) return;

    const step = firstCard.getBoundingClientRect().width + 20;
    setActiveTestimonial(Math.min(Math.round(viewport.scrollLeft / step), lastTestimonial));
  };

  return (
    <section className="testimonials-section" id="testimonials" data-node-id="53:1822">
      <div className="testimonials-container">
        <div className="testimonials-heading">
          <div className="testimonials-title">
            <p className="section-label">{content.label}</p>
            <h2>{content.title}</h2>
          </div>

          <div className="testimonial-controls">
            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              disabled={activeTestimonial === 0}
              aria-label={content.previousLabel}
            >
              <img
                className={activeTestimonial === 0 ? '' : 'arrow-reversed'}
                src={activeTestimonial === 0 ? '/assets/testimonial-back-disabled.svg' : '/assets/testimonial-forward.svg'}
                alt=""
              />
            </button>
            <button
              type="button"
              onClick={() => moveCarousel(1)}
              disabled={activeTestimonial === lastTestimonial}
              aria-label={content.nextLabel}
            >
              <img
                className={activeTestimonial === lastTestimonial ? 'arrow-reversed' : ''}
                src={activeTestimonial === lastTestimonial ? '/assets/testimonial-back-disabled.svg' : '/assets/testimonial-forward.svg'}
                alt=""
              />
            </button>
          </div>
        </div>

        <div
          className="testimonials-viewport"
          ref={viewportRef}
          onScroll={syncActiveTestimonial}
          tabIndex="0"
          aria-label={content.viewportLabel}
        >
          <div
            className="testimonials-track"
            ref={trackRef}
          >
            {content.items.map((testimonial, index) => (
              <article className={`testimonial-card ${index % 2 === 1 ? 'testimonial-card-dark' : ''}`} key={testimonial.name}>
                <div className="testimonial-stars" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, star) => (
                    <img src="/assets/testimonial-star.svg" alt="" key={star} />
                  ))}
                </div>

                <blockquote>{testimonial.quote}</blockquote>

                <div className="testimonial-author">
                  <img className="testimonial-avatar" src={testimonial.media.src} alt={testimonial.media.alt} style={{ objectPosition: testimonial.media.position }} loading="lazy" decoding="async" />
                  <div>
                    <cite>{testimonial.name}</cite>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FundingCtaSection({
  title = siteContent.home.cta.title,
  description = siteContent.home.cta.description,
  primaryHref = '/application',
  primaryLabel = siteContent.home.cta.primaryLabel,
  secondaryLabel = siteContent.home.cta.secondaryLabel,
  secondaryHref = '/services',
  sectionId = 'apply',
  nodeId = '56:2013',
  variant = '',
}) {
  return (
    <section className={`funding-cta ${variant}`} id={sectionId} data-node-id={nodeId}>
      <div className="funding-cta-background" aria-hidden="true">
        <div className="funding-cta-grid-lines">
          {Array.from({ length: 37 }, (_, index) => (
            <img
              className="funding-cta-vertical-line"
              src="/assets/cta-grid-line.svg"
              style={{ left: `${(index / 36) * 100}%` }}
              alt=""
              key={`vertical-${index}`}
            />
          ))}
          {Array.from({ length: 21 }, (_, index) => (
            <img
              className="funding-cta-horizontal-line"
              src="/assets/cta-grid-like.svg"
              style={{ top: `${(index / 20) * 100}%` }}
              alt=""
              key={`horizontal-${index}`}
            />
          ))}
        </div>
        <img className="funding-cta-highlights" src="/assets/cta-grid-highlight.svg" alt="" />
        <div className="funding-cta-fade" />
      </div>

      <div className="funding-cta-content">
        <div className="funding-cta-copy">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="funding-cta-actions">
          <a className="button button-primary" href={primaryHref}>{primaryLabel}</a>
          <a className="button button-dark-outline" href={secondaryHref}>{secondaryLabel}</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const content = siteContent.global.footer;
  const footerLogo = siteContent.global.brand.footerLogo;
  return (
    <footer className="site-footer" id="contact" data-node-id="59:2131">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-intro">
            <a className="footer-brand" href="/#home" aria-label="IOU Finance home">
              <img src={footerLogo.src} alt={footerLogo.alt} style={{ objectPosition: footerLogo.position }} decoding="async" />
            </a>
            <p>{content.description}</p>
          </div>

          <img className="footer-divider" src="/assets/footer-divider.svg" alt="" />

          <nav className="footer-navigation" aria-label="Footer navigation">
            <div className="footer-column">
              <h2>{content.menuHeading}</h2>
              <div className="footer-links">
                {siteContent.global.navigation.items.map(({ label, href }) => <a href={href} key={label}>{label}</a>)}
              </div>
            </div>

            <div className="footer-column">
              <h2>{content.servicesHeading}</h2>
              <div className="footer-links">
                {servicesCatalog.slice(0, 5).map((service) => (
                  <a href={service.href} key={service.slug}>{service.title}</a>
                ))}
                <a className="footer-services-link" href="/services">
                  <span>{content.servicesLink}</span>
                  <img src="/assets/footer-arrow.svg" alt="" />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h2>{content.securityHeading}</h2>
              <div className="footer-links">
                <a href="/terms-and-conditions">{content.termsLabel}</a>
                <a href="/privacy-policy">{content.privacyLabel}</a>
              </div>
            </div>

            <div className="footer-column footer-contact-column">
              <h2>{content.socialHeading}</h2>
              <address className="footer-contact-list">
                <a href={`mailto:${content.email}`}>
                  <img src="/assets/footer-mail.svg" alt="" />
                  <span>{content.email}</span>
                </a>
                <a href={`tel:${content.phoneHref}`}>
                  <img src="/assets/footer-call.svg" alt="" />
                  <span>{content.phoneDisplay}</span>
                </a>
                <div>
                  <img src="/assets/footer-location.svg" alt="" />
                  <span>{content.address}</span>
                </div>
              </address>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <img className="footer-divider" src="/assets/footer-divider.svg" alt="" />
          <p>{content.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <main>
      <div className="hero-shell">
        <Hero />
        <NavBar />
      </div>
      <AboutSection />
      <ServicesSection />
      <BenefitsSection />
      <StatsSection />
      <ProcessSection />
      <TestimonialsSection />
      <FundingCtaSection />
      <Footer />
    </main>
  );
}

function ServicesPage() {
  const cta = siteContent.servicesPage.cta;
  return (
    <main className="services-page">
      <div className="services-page-shell">
        <ServicesHero />
        <NavBar />
      </div>
      <ServicesCatalogSection />
      <FundingCtaSection
        title={cta.title}
        description={cta.description}
        primaryHref="/application"
        primaryLabel={cta.primaryLabel}
        secondaryLabel={cta.secondaryLabel}
        secondaryHref="/contact"
        sectionId="services-cta"
        nodeId="100:585"
        variant="funding-cta-services"
      />
      <Footer />
    </main>
  );
}

function FaqPage() {
  const cta = siteContent.faqPage.cta;
  return (
    <main className="faq-page">
      <div className="faq-page-shell">
        <FaqHero />
        <NavBar />
      </div>
      <FaqSection />
      <FundingCtaSection
        title={cta.title}
        description={cta.description}
        primaryHref="/application"
        primaryLabel={cta.primaryLabel}
        secondaryLabel={cta.secondaryLabel}
        secondaryHref="/contact"
        sectionId="faq-cta"
      />
      <Footer />
    </main>
  );
}

function AboutPage() {
  const cta = siteContent.aboutPage.cta;
  return (
    <main className="about-page">
      <div className="about-page-shell">
        <AboutPageHero />
        <NavBar />
      </div>
      <AboutStatementSection />
      <AboutMissionSection />
      <StatsSection />
      <AboutTeamSection />
      <FundingCtaSection
        title={cta.title}
        description={cta.description}
        primaryHref="/application"
        primaryLabel={cta.primaryLabel}
        secondaryLabel={cta.secondaryLabel}
        secondaryHref="/services"
        sectionId="about-cta"
        variant="funding-cta-services"
      />
      <Footer />
    </main>
  );
}

function ContactPage() {
  const cta = siteContent.contactPage.cta;
  return (
    <main className="contact-page">
      <div className="contact-page-shell">
        <ContactPageHero />
        <NavBar />
      </div>
      <ContactSection />
      <FundingCtaSection
        title={cta.title}
        description={cta.description}
        primaryHref="/application"
        primaryLabel={cta.primaryLabel}
        secondaryLabel={cta.secondaryLabel}
        sectionId="contact-cta"
      />
      <Footer />
    </main>
  );
}

function ApplicationPage() {
  return (
    <main className="application-page">
      <div className="application-page-shell">
        <ApplicationPageHero />
        <NavBar />
      </div>
      <ApplicationFormSection />
      <Footer />
    </main>
  );
}

function NotFoundPage() {
  const content = siteContent.notFound;
  return (
    <main className="not-found-page">
      <NavBar />
      <section className="not-found-section" aria-labelledby="not-found-title">
        <div className="not-found-layout">
          <div className="not-found-copy">
            <h1 id="not-found-title">{content.title}</h1>
            <p>{content.description}</p>
            <div className="not-found-actions">
              <a className="button button-primary" href="/#home">{content.primaryLabel}</a>
              <a className="button button-dark-outline" href="/services">{content.secondaryLabel}</a>
            </div>
          </div>

          <div className="not-found-code" aria-hidden="true">
            <span>4</span>
            <span className="not-found-zero">0<i /></span>
            <span>4</span>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function ServiceDetailPage({ service }) {
  const cta = siteContent.serviceDetail.cta;
  return (
    <main className="service-detail-page">
      <NavBar />
      <ServiceDetailIntro title={service.title} summary={service.summary} />
      <ServiceDetailMedia image={service.cardImage || service.image} imagePosition={service.imagePosition} title={service.title} />
      <ServiceDetailOverview
        overviewTitle={service.overviewTitle}
        overview={service.overview}
        benefitsTitle={service.benefitsTitle}
        benefits={service.benefits}
      />
      <ProcessSection />
      <FundingCtaSection
        title={cta.title}
        description={cta.description}
        primaryHref="/application"
        primaryLabel={cta.primaryLabel}
        secondaryLabel={cta.secondaryLabel}
        secondaryHref="/contact"
        sectionId="service-detail-cta"
        variant="funding-cta-services"
      />
      <Footer />
    </main>
  );
}

function LegalContent({ title, sections, nodeId }) {
  return (
    <section className="legal-content" data-node-id={nodeId}>
      <div className="legal-content-container">
        <header className="legal-heading">
          <h1>{title}</h1>
          <p>{siteContent.legal.lastUpdated}</p>
        </header>
        <div className="legal-sections">
          {sections.map(({ title: sectionTitle, body, intro, items, outro }) => (
            <section className="legal-section" key={sectionTitle}>
              <h2>{sectionTitle}</h2>
              <div className="legal-section-copy">
                {body && <p>{body}</p>}
                {intro && <p>{intro}</p>}
                {items && <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>}
                {outro && <p>{outro}</p>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function LegalPage({ title, sections, nodeId }) {
  return (
    <main className="legal-page">
      <NavBar />
      <LegalContent title={title} sections={sections} nodeId={nodeId} />
      <Footer />
    </main>
  );
}

function AdminLogin({ configured, onAuthenticated, onRetry }) {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const signIn = async (event) => {
    event.preventDefault();
    if (!password || isSubmitting || !configured) return;
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.authenticated) throw new Error(result.error || 'Sign-in failed. Please try again.');
      setPassword('');
      onAuthenticated();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand-panel" aria-label="IOU Finance CMS">
        <a className="admin-login-logo" href="/#home" aria-label="IOU Finance website">
          <img src="/assets/logo-raw-2.png" alt="IOU Finance Ltd." />
        </a>
        <div>
          <span>IOU Finance CMS</span>
          <h1>Manage the services your customers see.</h1>
          <p>Secure access for updating service cards, page content, imagery, and publishing status.</p>
        </div>
      </section>

      <section className="admin-login-form-panel">
        <form className="admin-login-form" onSubmit={signIn}>
          <div className="admin-login-heading">
            <h2>Welcome back</h2>
            <p>Enter your admin password to continue.</p>
          </div>

          <label className="admin-login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              autoFocus
              required
              disabled={!configured || isSubmitting}
            />
          </label>

          {!configured && (
            <div className="admin-login-message admin-login-message-warning" role="status">
              Add <code>ADMIN_PASSWORD</code> to your <code>.env</code> file, then restart the website server.
            </div>
          )}
          {error && <div className="admin-login-message" role="alert">{error}</div>}

          <button className="admin-login-submit" type="submit" disabled={!configured || !password || isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
          <button className="admin-login-retry" type="button" onClick={onRetry}>Check configuration again</button>
        </form>
      </section>
    </main>
  );
}

function AdminAccess() {
  const isLocalCmsPreview = import.meta.env.DEV && new URLSearchParams(window.location.search).has('cms-preview');
  const [authState, setAuthState] = useState('checking');
  const [configured, setConfigured] = useState(true);

  const checkSession = async () => {
    setAuthState('checking');
    try {
      const response = await fetch('/api/admin/session', { credentials: 'same-origin' });
      const result = await response.json().catch(() => ({}));
      setConfigured(Boolean(result.configured));
      setAuthState(response.ok && result.authenticated ? 'authenticated' : 'unauthenticated');
    } catch {
      setConfigured(false);
      setAuthState('unauthenticated');
    }
  };

  useEffect(() => {
    if (isLocalCmsPreview) return undefined;
    checkSession();
    return undefined;
  }, [isLocalCmsPreview]);

  const signOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      setAuthState('unauthenticated');
    }
  };

  if (isLocalCmsPreview) {
    return <AdminDashboard onSignOut={() => window.location.assign('/admin')} onSessionExpired={() => {}} />;
  }

  if (authState === 'checking') {
    return (
      <main className="admin-auth-loading" aria-live="polite">
        <img src="/assets/logo-raw-2.png" alt="" />
        <p>Checking secure access…</p>
      </main>
    );
  }

  if (authState !== 'authenticated') {
    return <AdminLogin configured={configured} onAuthenticated={() => setAuthState('authenticated')} onRetry={checkSession} />;
  }

  return <AdminDashboard onSignOut={signOut} onSessionExpired={() => setAuthState('unauthenticated')} />;
}

function AdminDashboard({ onSignOut, onSessionExpired }) {
  const initialContent = mergeSiteContent(window.__IOU_CMS__?.content);
  const [workspace, setWorkspace] = useState('content');
  const [contentDraft, setContentDraft] = useState(() => initialContent);
  const [savedContent, setSavedContent] = useState(() => initialContent);
  const [contentRevision, setContentRevision] = useState(() => window.__IOU_CMS__?.revision || null);
  const [serviceRecords, setServiceRecords] = useState(() => readServiceCmsRecords());
  const [servicesRevision, setServicesRevision] = useState(() => window.__IOU_CMS__?.servicesRevision || null);
  const [selectedSlug, setSelectedSlug] = useState(() => readServiceCmsRecords()[0]?.slug || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [uploadingField, setUploadingField] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false);
  const [aiDetailsStatus, setAiDetailsStatus] = useState('AI drafts from the service name and summary. Nothing is published until you save.');
  const selectedService = serviceRecords.find((service) => service.slug === selectedSlug) || serviceRecords[0];
  const [draft, setDraft] = useState(selectedService || null);
  const [draftFocusX = '50%', draftFocusY = '50%'] = String(draft?.imagePosition || '50% 50%').split(/\s+/);

  useEffect(() => {
    let cancelled = false;
    const loadContent = async () => {
      try {
        const response = await fetch('/api/cms/content', { credentials: 'same-origin' });
        const result = await response.json().catch(() => ({}));
        if (response.status === 401) {
          onSessionExpired();
          return;
        }
        if (!response.ok || !result.content || cancelled) return;
        const merged = mergeSiteContent(result.content);
        setContentDraft(merged);
        setSavedContent(merged);
        setContentRevision(result.revision || null);
      } catch {
        if (!cancelled) setNotice('The latest CMS content could not be loaded. The bundled website content is shown instead.');
      }
    };
    loadContent();
    return () => { cancelled = true; };
  }, [onSessionExpired]);

  useEffect(() => {
    setDraft(selectedService ? { ...selectedService } : null);
    setAiDetailsStatus('AI drafts from the service name and summary. Nothing is published until you save.');
  }, [selectedSlug]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const visibleServices = serviceRecords.filter((service) => {
    const matchesSearch = `${service.title} ${service.slug}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' ? service.published : !service.published);
    return matchesSearch && matchesStatus;
  });
  const publishedCount = serviceRecords.filter((service) => service.published).length;
  const draftCount = serviceRecords.length - publishedCount;
  const hasUnsavedChanges = Boolean(draft && selectedService && JSON.stringify(draft) !== JSON.stringify(selectedService));

  const updateDraft = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const updateDraftImage = (value) => setDraft((current) => ({ ...current, cardImage: value, image: value }));

  const saveContent = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/cms/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ content: contentDraft, baseRevision: contentRevision }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        onSessionExpired();
        throw new Error('Your admin session expired. Please sign in again.');
      }
      if (response.status === 409) throw new Error('Another administrator published changes first. Refresh the dashboard before trying again.');
      if (!response.ok || !result.content) throw new Error(result.error || 'The website content could not be published.');
      const merged = mergeSiteContent(result.content);
      setContentDraft(merged);
      setSavedContent(merged);
      setContentRevision(result.revision || null);
      setNotice('Website content published globally. Open or refresh the website to verify it.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The website content could not be published.');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadContentImage = async (file, fieldPath) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setNotice('Use a JPG, PNG, or WebP image no larger than 5MB.');
      return null;
    }
    setUploadingField(fieldPath);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/cms/images', { method: 'POST', body: formData, credentials: 'same-origin' });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        onSessionExpired();
        throw new Error('Your admin session expired. Please sign in again.');
      }
      if (!response.ok || !result.url) throw new Error(result.error || 'The image could not be uploaded.');
      setNotice('Image uploaded. Publish the content changes when you are ready.');
      return result.url;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The image could not be uploaded.');
      return null;
    } finally {
      setUploadingField('');
    }
  };

  const persistRecords = async (nextRecords, message) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/cms/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ records: nextRecords, baseRevision: servicesRevision }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        onSessionExpired();
        throw new Error('Your admin session expired. Please sign in again.');
      }
      if (response.status === 409) throw new Error('Another administrator published service changes first. Refresh the dashboard before trying again.');
      if (!response.ok || !Array.isArray(result.records)) {
        throw new Error(result.error || 'The service content could not be saved.');
      }
      const savedRecords = saveServiceCmsRecords(result.records);
      setServicesRevision(result.revision || null);
      setServiceRecords(savedRecords);
      setNotice(message);
      return savedRecords;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The service content could not be saved.');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const selectService = (nextSlug) => {
    if (nextSlug === selectedSlug) return;
    if (hasUnsavedChanges && !window.confirm('Discard your unsaved changes and open another service?')) return;
    setSelectedSlug(nextSlug);
  };

  const addService = async () => {
    if (hasUnsavedChanges && !window.confirm('Discard your unsaved changes and create a new service?')) return;
    let suffix = 1;
    let slug = 'new-service';
    while (serviceRecords.some((service) => service.slug === slug)) {
      suffix += 1;
      slug = `new-service-${suffix}`;
    }

    const newService = {
      slug,
      title: 'Untitled Service',
      summary: '',
      cardImage: null,
      image: null,
      imagePosition: '50% 50%',
      overviewTitle: '',
      overview: [''],
      benefitsTitle: 'Why choose this loan?',
      benefits: [''],
      published: false,
      order: serviceRecords.length,
      updatedAt: null,
    };
    const savedRecords = await persistRecords([...serviceRecords, newService], 'New draft created.');
    if (!savedRecords) return;
    setSelectedSlug(slug);
  };

  const saveDraft = async (event) => {
    event.preventDefault();
    if (!draft) return;

    const nextSlug = toServiceSlug(draft.slug || draft.title);
    if (!draft.title.trim() || !nextSlug) {
      setNotice('Add a service title and a valid URL slug.');
      return;
    }
    if (serviceRecords.some((service) => service.slug === nextSlug && service.slug !== selectedSlug)) {
      setNotice('That URL slug is already in use.');
      return;
    }

    const cleanService = {
      ...draft,
      slug: nextSlug,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      cardImage: draft.cardImage || null,
      image: draft.cardImage || null,
      imagePosition: draft.imagePosition || '50% 50%',
      overviewTitle: draft.overviewTitle.trim(),
      overview: draft.overview.filter((item) => item.trim()).map((item) => item.trim()),
      benefitsTitle: draft.benefitsTitle.trim(),
      benefits: draft.benefits.filter((item) => item.trim()).map((item) => item.trim()),
      updatedAt: new Date().toISOString(),
    };
    const savedRecords = await persistRecords(
      serviceRecords.map((service) => (service.slug === selectedSlug ? cleanService : service)),
      `${cleanService.title} published to the CMS.`,
    );
    if (!savedRecords) return;
    setSelectedSlug(nextSlug);
    setDraft(cleanService);
  };

  const deleteService = async () => {
    if (!selectedService || !window.confirm(`Delete ${selectedService.title}? This removes it from the CMS.`)) return;
    const remainingServices = serviceRecords.filter((service) => service.slug !== selectedService.slug);
    const savedRecords = await persistRecords(remainingServices, `${selectedService.title} deleted.`);
    if (!savedRecords) return;
    setSelectedSlug(savedRecords[0]?.slug || '');
  };

  const moveService = async (direction) => {
    const currentIndex = serviceRecords.findIndex((service) => service.slug === selectedSlug);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= serviceRecords.length) return;
    const nextRecords = [...serviceRecords];
    [nextRecords[currentIndex], nextRecords[targetIndex]] = [nextRecords[targetIndex], nextRecords[currentIndex]];
    await persistRecords(nextRecords, 'Service order updated.');
  };

  const generateServiceDetails = async () => {
    if (!draft?.title?.trim()) {
      setAiDetailsStatus('Add a service name before generating its copy.');
      return;
    }
    setIsGeneratingDetails(true);
    setAiDetailsStatus('Generating the summary, overview paragraphs, and benefit items from the service name…');
    try {
      const response = await fetch('/api/admin/ai/service-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          service: {
            title: draft.title,
          },
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        onSessionExpired();
        throw new Error('Your admin session expired. Please sign in again.');
      }
      if (!response.ok || !result.details) {
        throw new Error(result.error || 'AI could not generate the service details.');
      }
      setDraft((current) => ({ ...current, ...result.details }));
      setAiDetailsStatus('Service copy generated. The overview and benefits headings were left unchanged.');
    } catch (error) {
      setAiDetailsStatus(error instanceof Error ? error.message : 'AI could not generate the service details.');
    } finally {
      setIsGeneratingDetails(false);
    }
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setNotice('Use a JPG, PNG, or WebP image no larger than 5MB.');
      event.target.value = '';
      return;
    }

    setUploadingField('serviceImage');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/cms/images', { method: 'POST', body: formData });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        onSessionExpired();
        throw new Error('Your admin session expired. Please sign in again.');
      }
      if (!response.ok || !result.url) throw new Error(result.error || 'The image could not be uploaded.');

      const nextService = {
        ...selectedService,
        cardImage: result.url,
        image: result.url,
        updatedAt: new Date().toISOString(),
      };
      const savedRecords = await persistRecords(
        serviceRecords.map((service) => (service.slug === selectedSlug ? nextService : service)),
        'Image uploaded and saved.',
      );
      if (savedRecords) updateDraftImage(result.url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The image could not be uploaded.');
    } finally {
      setUploadingField('');
      event.target.value = '';
    }
  };

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/#home" aria-label="IOU Finance website">
          <strong>IOU Finance</strong>
          <span>Content management</span>
        </a>
        <nav className="admin-nav" aria-label="Admin navigation">
          <button className={`admin-nav-item${workspace === 'content' ? ' admin-nav-item-active' : ''}`} type="button" onClick={() => setWorkspace('content')}>
            Website content
          </button>
          <button className={`admin-nav-item${workspace === 'services' ? ' admin-nav-item-active' : ''}`} type="button" onClick={() => setWorkspace('services')}>
            Services
          </button>
          <a className="admin-nav-item" href="/#home" target="_blank" rel="noreferrer">
            View website
          </a>
        </nav>
        <div className="admin-sidebar-footer">
          <span>Cloud workspace</span>
          <p>Website content and uploaded images are stored securely in Cloudflare KV for every authorised device.</p>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-overline">IOU Finance CMS</span>
            <h1>{workspace === 'content' ? 'Website content' : 'Services'}</h1>
          </div>
          <div className="admin-topbar-actions">
            <a className="admin-button admin-button-secondary" href={workspace === 'content' ? '/#home' : '/services'} target="_blank" rel="noreferrer">Preview website</a>
            <button className="admin-button admin-button-secondary" type="button" onClick={onSignOut}>Sign out</button>
            {workspace === 'services' && <button className="admin-button admin-button-primary" type="button" onClick={addService} disabled={isSaving}>Add service</button>}
          </div>
        </header>

        {workspace === 'services' && <div className="admin-metrics" aria-label="Service content summary">
          <div><strong>{serviceRecords.length}</strong><span>Total services</span></div>
          <div><strong>{publishedCount}</strong><span>Published</span></div>
          <div><strong>{draftCount}</strong><span>Drafts</span></div>
          <div><strong>KV</strong><span>Storage mode</span></div>
        </div>}

        {workspace === 'content' ? (
          <AdminContentEditor
            content={contentDraft}
            savedContent={savedContent}
            onChange={setContentDraft}
            onSave={saveContent}
            onUpload={uploadContentImage}
            uploadingPath={uploadingField}
            isSaving={isSaving}
          />
        ) : <div className="admin-content-grid">
          <section className="admin-service-list" aria-label="Services list">
            <div className="admin-panel-heading">
              <div>
                <h2>Service library</h2>
                <p>Select an item to update its public content.</p>
              </div>
              <span>{visibleServices.length} shown</span>
            </div>

            <div className="admin-list-tools">
              <label className="admin-search">
                <span className="sr-only">Search services</span>
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search services" />
              </label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter services by status">
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>

            <div className="admin-service-rows">
              {visibleServices.map((service) => (
                <button
                  className={`admin-service-row${service.slug === selectedSlug ? ' admin-service-row-active' : ''}`}
                  type="button"
                  key={service.slug}
                  onClick={() => selectService(service.slug)}
                >
                  <span className="admin-service-thumbnail">
                    {service.cardImage ? <img src={service.cardImage} alt="" style={{ objectPosition: service.imagePosition }} /> : <span>{service.title.slice(0, 1)}</span>}
                  </span>
                  <span className="admin-service-row-copy">
                    <strong>{service.title}</strong>
                    <small>/{service.slug}</small>
                  </span>
                  <span className={`admin-status admin-status-${service.published ? 'published' : 'draft'}`}>
                    {service.published ? 'Published' : 'Draft'}
                  </span>
                </button>
              ))}
              {!visibleServices.length && (
                <div className="admin-empty-state"><strong>No services found</strong><span>Try another search or status filter.</span></div>
              )}
            </div>
          </section>

          <section className="admin-editor" aria-label="Service editor">
            {draft ? (
              <form onSubmit={saveDraft}>
                <div className="admin-editor-heading">
                  <div>
                    <span className={`admin-status admin-status-${draft.published ? 'published' : 'draft'}`}>
                      {draft.published ? 'Published' : 'Draft'}
                    </span>
                    <h2>{draft.title || 'Untitled Service'}</h2>
                    <p>{hasUnsavedChanges ? 'You have unsaved changes.' : 'All local changes are saved.'}</p>
                  </div>
                  <div className="admin-order-actions" aria-label="Reorder service">
                    <button type="button" onClick={() => moveService(-1)} disabled={isSaving || serviceRecords[0]?.slug === selectedSlug}>Move up</button>
                    <button type="button" onClick={() => moveService(1)} disabled={isSaving || serviceRecords.at(-1)?.slug === selectedSlug}>Move down</button>
                  </div>
                </div>

                <div className="admin-form-section">
                  <div className="admin-form-section-heading"><h3>Card content</h3><p>Shown on the homepage and services page.</p></div>
                  <div className="admin-form-grid">
                    <label><span>Service name</span><input required value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} /></label>
                    <label><span>URL slug</span><input required value={draft.slug} onChange={(event) => updateDraft('slug', event.target.value)} /></label>
                    <label className="admin-field-full"><span>Summary</span><textarea required rows="3" value={draft.summary} onChange={(event) => updateDraft('summary', event.target.value)} /></label>
                  </div>

                  <div className="admin-image-field">
                    <div className="admin-image-preview">
                      {draft.cardImage ? <img src={draft.cardImage} alt="Service preview" style={{ objectPosition: draft.imagePosition }} /> : <span>No service image</span>}
                    </div>
                    <div>
                      <strong>Service image</strong>
                      <p>Used on the service card and service details page. JPG, PNG, or WebP up to 5MB.</p>
                      <label className="admin-upload-button">{uploadingField === 'serviceImage' ? 'Uploading…' : 'Choose image'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={Boolean(uploadingField)} onChange={uploadImage} /></label>
                      {draft.cardImage && <button className="admin-text-button" type="button" onClick={() => updateDraftImage(null)}>Remove image</button>}
                    </div>
                  </div>
                  <div className="admin-focal-grid admin-service-focal-grid">
                    <label>
                      <span>Horizontal focal point <b>{Number.parseInt(draftFocusX, 10) || 50}%</b></span>
                      <input type="range" min="0" max="100" value={Number.parseInt(draftFocusX, 10) || 50} onChange={(event) => updateDraft('imagePosition', `${event.target.value}% ${draftFocusY}`)} />
                    </label>
                    <label>
                      <span>Vertical focal point <b>{Number.parseInt(draftFocusY, 10) || 50}%</b></span>
                      <input type="range" min="0" max="100" value={Number.parseInt(draftFocusY, 10) || 50} onChange={(event) => updateDraft('imagePosition', `${draftFocusX} ${event.target.value}%`)} />
                    </label>
                  </div>
                </div>

                <div className="admin-form-section">
                  <div className="admin-form-section-heading admin-form-section-heading-actions">
                    <div><h3>Service details</h3><p>Generate the summary, overview paragraphs, and benefit items. Your headings remain unchanged.</p></div>
                    <button className="admin-button admin-button-secondary admin-ai-generate-button" type="button" onClick={generateServiceDetails} disabled={isGeneratingDetails || isSaving} aria-busy={isGeneratingDetails}>
                      {isGeneratingDetails ? 'Generating service copy…' : 'Generate service copy with AI'}
                    </button>
                  </div>
                  <p className="admin-ai-status" role="status" aria-live="polite">{aiDetailsStatus}</p>
                  <label className="admin-field-full"><span>Overview heading</span><input required value={draft.overviewTitle} onChange={(event) => updateDraft('overviewTitle', event.target.value)} /></label>
                  <label className="admin-field-full"><span>Overview paragraphs</span><textarea rows="6" value={draft.overview.join('\n\n')} onChange={(event) => updateDraft('overview', event.target.value.split(/\n\s*\n/))} /><small>Separate paragraphs with a blank line.</small></label>
                  <label className="admin-field-full"><span>Benefits heading</span><input required value={draft.benefitsTitle} onChange={(event) => updateDraft('benefitsTitle', event.target.value)} /></label>
                  <label className="admin-field-full"><span>Benefits</span><textarea rows="7" value={draft.benefits.join('\n')} onChange={(event) => updateDraft('benefits', event.target.value.split('\n'))} /><small>Place each benefit on a new line.</small></label>
                </div>

                <div className="admin-publish-row">
                  <label className="admin-switch">
                    <input type="checkbox" checked={draft.published} onChange={(event) => updateDraft('published', event.target.checked)} />
                    <span aria-hidden="true" />
                    <div><strong>Publish this service</strong><small>Published services appear on the public website.</small></div>
                  </label>
                </div>

                <div className="admin-editor-footer">
                  <button className="admin-delete-button" type="button" onClick={deleteService} disabled={isSaving}>Delete service</button>
                  <div>
                    <a className="admin-button admin-button-secondary" href={`/services/${draft.slug}`} target="_blank" rel="noreferrer">Open page</a>
                    <button className="admin-button admin-button-primary" type="submit" disabled={isSaving || !hasUnsavedChanges}>{isSaving ? 'Saving…' : 'Save changes'}</button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="admin-empty-editor"><h2>Create your first service</h2><p>Add a service to begin managing its website content.</p><button className="admin-button admin-button-primary" type="button" onClick={addService}>Add service</button></div>
            )}
          </section>
        </div>}
      </section>

      {notice && <div className="admin-notice" role="status">{notice}</div>}
    </main>
  );
}

export default function App() {
  const pagePath = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const serviceSlug = pagePath.startsWith('/services/') ? pagePath.slice('/services/'.length) : '';
  const serviceDetail = serviceDetailContentBySlug[serviceSlug];
  let page;
  if (pagePath === '/admin') page = <AdminAccess />;
  else if (pagePath === '/services') page = <ServicesPage />;
  else if (serviceDetail) page = <ServiceDetailPage service={serviceDetail} />;
  else if (pagePath === '/faq') page = <FaqPage />;
  else if (pagePath === '/about') page = <AboutPage />;
  else if (pagePath === '/contact') page = <ContactPage />;
  else if (pagePath === '/application' || pagePath === '/apply') page = <ApplicationPage />;
  if (pagePath === '/terms-and-conditions' || pagePath === '/terms') {
    page = <LegalPage title={siteContent.legal.terms.title} sections={siteContent.legal.terms.sections} nodeId="170:3766" />;
  }
  else if (pagePath === '/privacy-policy' || pagePath === '/privacy') {
    page = <LegalPage title={siteContent.legal.privacy.title} sections={siteContent.legal.privacy.sections} nodeId="175:592" />;
  }
  else if (pagePath === '/') page = <HomePage />;
  else if (!page) page = <NotFoundPage />;

  return (
    <>
      <SiteMetadata pagePath={pagePath} service={serviceDetail} />
      <DeferredImageWarmup disabled={pagePath === '/admin'} />
      {page}
    </>
  );
}
