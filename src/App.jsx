import { useEffect, useRef, useState } from 'react';

const navItems = [
  ['Home', '/#home'],
  ['About us', '/about'],
  ['Services', '/services'],
  ['FAQs', '/faq'],
  ['Contact Us', '/contact'],
];

const faqItems = [
  {
    question: 'What is IOU Finance?',
    answer: 'IOU Finance is a lending platform built for market women, traders, small business owners, and salary earners across Nigeria. We provide fast, collateral-free loans so you can handle emergencies, grow your business, or bridge the gap till payday.',
  },
  {
    question: 'Who can apply for a loan?',
    answer: "Anyone earning a legitimate income, whether you trade in the market, run a small business, or work a salaried job, can apply. As long as you meet our basic requirements, you're eligible.",
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
    description: "Business doesn't wait for approval letters, and neither do we. Apply today, get approved, and see the money in your account before the day is out.",
    image: '/assets/benefit-same-day.jpg',
    imageAlt: 'A financial professional presenting a performance chart',
    imagePosition: '50% 42%',
  },
  {
    title: 'No Collateral, No Wahala',
    description: 'No landed property, no guarantor drama, no complicated paperwork. We lend based on trust in your hustle, not what you own.',
    image: '/assets/benefit-no-collateral.jpg',
    imageAlt: 'A business professional giving a confident thumbs up',
    imagePosition: '50% 38%',
  },
  {
    title: 'Transparent Repayment Terms',
    description: "No hidden charges or surprise deductions. We tell you exactly what you owe and when, before you sign anything — so there's never a nasty surprise.",
    image: '/assets/benefit-transparent-terms.jpg',
    imageAlt: 'A financial adviser explaining repayment details',
    imagePosition: '50% 36%',
  },
];

const stats = [
  { target: 1.2, decimals: 1, suffix: 'k+', label: 'Loans Disbursed' },
  { target: 200, prefix: '₦', suffix: 'M+', label: 'Total Amount Funded' },
  { target: 24, suffix: 'hrs', label: 'Average Approval Time' },
  { target: 98, suffix: '%', label: 'Customer Satisfaction Rate' },
];

const applicationSteps = [
  {
    title: 'Apply for a loan',
    description: 'Fill a quick form with your basic details. Takes less than 5 minutes, no long forms, no wahala.',
    image: '/assets/process-apply.jpg',
    imageAlt: 'A customer applying for a loan on his phone',
    imagePosition: '50% 48%',
  },
  {
    title: 'Get Approval',
    description: 'Our team reviews your application and gives you a decision fast, most times within hours.',
    image: '/assets/process-approval.jpg',
    imageAlt: 'A finance professional reviewing an application',
    imagePosition: '48% 42%',
  },
  {
    title: 'Receive Funds',
    description: 'Once approved, the money hits your account the same day, ready to use for whatever you need.',
    image: '/assets/process-funds.jpg',
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
  },
  {
    quote: '"As market woman, e no easy to get loan. But IOU Finance no stress me at all."',
    name: 'Adaobi Nwosu',
    role: 'Provision Store Owner, Lagos',
  },
  {
    quote: '"I applied for a payday loan and had the money before my next alert even dropped."',
    name: 'Emeka Ibe',
    role: 'Market Woman, Mile 12',
  },
  {
    quote: '"My business grew because IOU Finance believed in me when nobody else would give me a chance."',
    name: 'Ify Uche',
    role: 'Small Business Owner',
  },
  {
    quote: '"Fast approval, clear terms, no hidden charges. This is the lender every trader has been searching for."',
    name: 'Tunde Adebayo',
    role: 'Salary Earner',
  },
  {
    quote: '"I no get collateral, but IOU Finance still help me. Money enter my account same day sharp."',
    name: 'Ngozi Eze',
    role: 'Civil Servant, Abuja',
  },
];

const defaultServiceDetailContentBySlug = {
  'emergency-loan': {
    title: 'Emergency Loan',
    summary: "Life doesn't wait, and neither do we. Get cash in hand within hours to handle urgent needs no long stories, no delays.",
    cardImage: '/assets/service-emergency.png',
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
    summary: 'For school fees, rent, or that thing only you understand — get funds fast, with repayment terms that respect your pocket.',
    cardImage: '/assets/service-personal.png',
    image: null,
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
    cardImage: '/assets/service-payday.png',
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
    cardImage: '/assets/service-business.png',
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
    cardImage: '/assets/service-group-loan.jpg',
    image: '/assets/service-group-loan.jpg',
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
    cardImage: '/assets/service-lpo-financing.jpg',
    image: '/assets/service-lpo-financing.jpg',
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
    cardImage: '/assets/service-asset-financing.jpg',
    image: '/assets/service-asset-financing.jpg',
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
    cardImage: '/assets/service-savings-investment.jpg',
    image: '/assets/service-savings-investment.jpg',
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
const refreshedServiceImageSlugs = new Set([
  'group-loan',
  'lpo-financing',
  'asset-financing',
  'savings-and-investment',
]);

function createDefaultServiceRecords() {
  return Object.entries(defaultServiceDetailContentBySlug).map(([slug, service], index) => ({
    ...service,
    slug,
    published: true,
    order: index,
    updatedAt: null,
  }));
}

function readServiceCmsRecords() {
  try {
    const currentRecords = window.localStorage.getItem(SERVICE_CMS_STORAGE_KEY);
    const legacyRecords = window.localStorage.getItem(LEGACY_SERVICE_CMS_STORAGE_KEY);
    const isLegacyMigration = !currentRecords && Boolean(legacyRecords);
    const storedRecords = JSON.parse(currentRecords || legacyRecords || 'null');
    if (!Array.isArray(storedRecords) || !storedRecords.length) return createDefaultServiceRecords();

    const normalisedRecords = storedRecords
      .filter((service) => service && typeof service.slug === 'string' && typeof service.title === 'string')
      .map((service, index) => {
        const defaults = defaultServiceDetailContentBySlug[service.slug] || {};
        const useRefreshedImage = isLegacyMigration && refreshedServiceImageSlugs.has(service.slug);
        const canonicalImage = useRefreshedImage
          ? defaults.cardImage
          : service.cardImage || service.image || defaults.cardImage || null;
        let imagePosition = useRefreshedImage
          ? defaults.imagePosition
          : service.imagePosition || defaults.imagePosition || '50% 50%';
        const needsBusinessFocusCorrection = service.slug === 'business-loan'
          && canonicalImage === defaults.cardImage
          && (!service.imagePosition || service.imagePosition === '50% 50%');
        if (needsBusinessFocusCorrection) imagePosition = defaults.imagePosition;

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
  const orderedRecords = records.map((service, index) => {
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
          <img src="/assets/logo-raw-2.png" alt="IOU Finance Ltd." />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => {
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

        <a className="button button-primary nav-cta" href="/application">Apply for a Loan</a>

        <details className="mobile-menu">
          <summary aria-label="Toggle navigation menu"><span /><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {navItems.map(([label, href]) => {
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
            <a className="button button-primary" href="/application">Apply for a Loan</a>
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

    const mobileViewport = window.matchMedia('(max-width: 600px)');
    const previousOverflow = document.body.style.overflow;
    const syncPageScroll = () => {
      document.body.style.overflow = mobileViewport.matches ? 'hidden' : previousOverflow;
    };

    syncPageScroll();
    mobileViewport.addEventListener('change', syncPageScroll);
    return () => {
      mobileViewport.removeEventListener('change', syncPageScroll);
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
        <section className="loan-calculator-panel" id="loan-calculator-panel" aria-label="Loan calculator">
          <div className="loan-calculator-panel-header">
            <h2>Loan Calculator</h2>
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
                <label htmlFor="loan-amount">I Need</label>
                <span className="loan-calculator-value loan-calculator-value-amount">
                  <span aria-hidden="true">₦</span>
                  <input
                    id="loan-amount"
                    type="text"
                    inputMode="numeric"
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
              <div className="loan-calculator-limits"><span>₦50,000</span><span>₦5,000,000</span></div>
            </div>

            <div className="loan-calculator-field">
              <div className="loan-calculator-field-heading">
                <label htmlFor="loan-duration">I Need</label>
                <span className="loan-calculator-value loan-calculator-value-duration">
                  <input
                    id="loan-duration"
                    type="number"
                    min={minDuration}
                    max={maxDuration}
                    value={duration}
                    onChange={(event) => setDuration(event.target.value === '' ? '' : Number(event.target.value))}
                  />
                  <span aria-hidden="true">mths</span>
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
              <div className="loan-calculator-limits"><span>1 month</span><span>12 months</span></div>
            </div>
          </div>

          <div className="loan-calculator-summary" aria-live="polite">
            <div><span>You Repay</span><strong>{loanCurrencyFormatter.format(totalRepayment)}</strong></div>
            <div><span>Monthly</span><strong>{loanCurrencyFormatter.format(monthlyRepayment)}</strong></div>
            <div><span>Interest</span><strong>{loanCurrencyFormatter.format(interest)}</strong></div>
          </div>

          <a
            className={`button button-primary loan-calculator-apply${hasValidValues ? '' : ' loan-calculator-apply-disabled'}`}
            href={hasValidValues ? applicationHref : undefined}
            aria-disabled={!hasValidValues}
          >
            Apply for a Loan
          </a>
        </section>
      )}

      <button
        className="loan-calculator-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="loan-calculator-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        <img src="/assets/calculator-icon.png" alt="" />
        <span>Loan Calculator</span>
      </button>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" data-node-id="15:72">
      <img className="hero-image" src="/assets/hero-home-executive-wide.png" alt="A smiling business professional in a navy suit" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-copy">
          <h1>Quick Loans? No Wahala, Get Cash in Your Hands Today.</h1>
          <p>From restocking your shop to funding your next big order, we lend money that moves with your hustle.</p>
        </div>
        <div className="hero-actions">
          <a className="button button-primary" href="/application">Apply for a Loan</a>
          <a className="button button-secondary" href="/services">Explore our Services</a>
        </div>
      </div>
      <LoanCalculator />
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-section" id="about" data-node-id="30:2">
      <div className="about-content">
        <div className="about-heading" data-node-id="30:6">
          <p className="section-label">ABOUT US</p>
          <h2>At IOU Finance, we give market women, traders and small business owners fast access to the cash they need — no collateral, no long queues, no wahala.</h2>
        </div>

        <div className="about-summary" data-node-id="30:9">
          <p>Built for everyday hustlers. We understand how Nigerian businesses really run, so we lend money that moves as fast as your business does.</p>
          <a className="button button-primary" href="/about">Learn More</a>
        </div>
      </div>
    </section>
  );
}

function ServicesHero() {
  return (
    <section className="services-hero" data-node-id="100:479">
      <img className="services-hero-image services-page-hero-image" src="/assets/about-hero-executive-office.png" alt="A smiling business professional seated at his office desk" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content">
        <p>~SERVICES~</p>
        <h1>Loans Built Around Your Hustle</h1>
      </div>
    </section>
  );
}

function FaqHero() {
  return (
    <section className="services-hero" data-node-id="107:746">
      <img className="services-hero-image faq-hero-image" src="/assets/faq-hero-advisor-office.png" alt="A financial advisor seated at her desk ready to answer questions" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content">
        <p>~FAQs~</p>
        <h1>Got Questions? We&apos;ve Got Answers.</h1>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="faq-section" id="faqs" data-node-id="107:750">
      <div className="faq-list">
        {faqItems.map(({ question, answer }) => (
          <details className="faq-item" key={question}>
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
  return (
    <section className="services-hero about-page-hero" data-node-id="142:1955">
      <img className="services-hero-image about-hero-image" src="/assets/about-hero-woman-office.png" alt="A confident business professional standing in a modern office" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content about-hero-content">
        <p>~About Us~</p>
        <h1>We&apos;re Here for the People Banks Overlook</h1>
      </div>
    </section>
  );
}

function ContactPageHero() {
  return (
    <section className="services-hero contact-page-hero">
      <img className="services-hero-image contact-hero-image" src="/assets/contact-hero-women-meeting.png" alt="A business leader speaking with colleagues in a bright meeting room" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content contact-hero-content">
        <p>~Contact Us~</p>
        <h1>Have a Question, Need Help Or Want To Know More, We&apos;re Here For You.</h1>
      </div>
    </section>
  );
}

function ApplicationPageHero() {
  return (
    <section className="services-hero application-page-hero">
      <img className="services-hero-image application-hero-image" src="/assets/contact-hero-team-meeting.png" alt="A group of business professionals discussing growth and funding" />
      <div className="services-hero-overlay" />
      <div className="services-hero-content contact-hero-content application-hero-content">
        <p>~Application~</p>
        <h1>Start Your Application Today</h1>
      </div>
    </section>
  );
}

function AboutStatementSection() {
  return (
    <section className="about-statement-section" data-node-id="142:1959">
      <p>
        At IOU Finance, We are committed to putting fast, honest funding in the hands of market women, traders, and small business owners across Nigeria. Our team understands the unique challenges hustlers and everyday earners face, offering simple loan options built around how you actually work and earn.
      </p>
    </section>
  );
}

function AboutMissionSection() {
  const values = [
    'Trust (No hidden charges)',
    'Speed (Same-day approval)',
    'Dignity (Respect all customers)',
    'Accessibility (no complicated forms)',
  ];

  return (
    <section className="about-mission-section" data-node-id="148:2212">
      <div className="about-detail-row">
        <div className="about-mission-copy">
          <div className="about-mission-intro">
            <p className="about-mission-label">OUR MISSION</p>
            <h2>Turning Everyday Hustles Into Lasting Growth</h2>
            <p>We exist to make credit accessible to every hardworking Nigerian, regardless of collateral, connections, or paperwork. Our vision is a Nigeria where no one&apos;s growth is limited by lack of access to capital.</p>
          </div>

          <div className="about-mission-points">
            <article>
              <span className="about-point-icon"><img src="/assets/about-capital.svg" alt="" /></span>
              <h3>Simplify Access to Capital</h3>
              <p>No collateral, no complicated forms. Just simple requirements anyone can meet, and fast decisions that don&apos;t leave you waiting.</p>
            </article>
            <article>
              <span className="about-point-icon"><img src="/assets/about-growth.svg" alt="" /></span>
              <h3>Empower Growth</h3>
              <p>We fund the traders, sellers and business owners building Nigeria&apos;s economy from the ground up, one loan at a time</p>
            </article>
          </div>
        </div>
        <div className="about-media-placeholder about-mission-media">
          <img src="/assets/about-our-mission.jpg" alt="A team celebrating progress together" />
        </div>
      </div>

      <div className="about-detail-row about-values-row">
        <div className="about-media-placeholder about-values-media">
          <img src="/assets/about-what-we-stand-for.jpg" alt="A team reviewing their work together" />
        </div>
        <div className="about-values-copy">
          <div>
            <h2>What we stand for</h2>
            <p>Everything we do is guided by a few simple beliefs, the same ones that shape how we lend, how we treat people, and how we build trust every single day.</p>
          </div>

          <div className="about-values-block">
            <h3>Our Values</h3>
            <div className="about-values-grid">
              {values.map((value) => (
                <div className="about-value-item" key={value}>
                  <img src="/assets/checkmark-circle.svg" alt="" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-values-actions">
            <a className="button button-primary" href="/application">Apply for a Loan</a>
            <a className="button button-dark-outline" href="/services">Explore our Services</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutTeamSection() {
  const team = [
    ['David Mitchell', 'Junior Plumbing Technician'],
    ['Rachel Bennett', 'Junior Plumbing Technician'],
    ["Kevin O'Brien", 'Associate Plumbing Technician'],
    ['Laura Simmons', 'Associate Plumbing Technician'],
  ];

  return (
    <section className="about-team-section" data-node-id="148:2286">
      <div className="about-team-container">
        <div className="about-team-heading">
          <p>OUR TEAM</p>
          <h2>Meet The Team Making It Happen</h2>
        </div>

        <div className="about-team-grid">
          {team.map(([name, role]) => (
            <article className="about-team-member" key={name}>
              <div className="about-team-photo" aria-hidden="true" />
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
  const contactCards = [
    {
      type: 'Email',
      description: 'Get the latest updates and offers.',
      value: 'contact@ioufinanceltd.com',
      href: 'mailto:contact@ioufinanceltd.com',
      icon: '/assets/contact-email.svg',
    },
    {
      type: 'Office',
      description: 'Visit or write to us at:',
      value: '20 mojidi street, off toyin street ikeja, Lagos',
      icon: '/assets/contact-office.svg',
    },
    {
      type: 'Phone',
      description: 'Speak to our team for support.',
      value: '+234-702-5700-040',
      href: 'tel:+2347025700040',
      icon: '/assets/contact-phone.svg',
    },
  ];

  return (
    <section className="contact-section" data-node-id="155:2795">
      <div className="contact-section-container">
        <h2>Get in touch with our team</h2>
        <div className="contact-cards">
          {contactCards.map(({ type, description, value, href, icon }) => (
            <article className="contact-card" key={type}>
              <span className="contact-card-icon"><img src={icon} alt="" /></span>
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
            <span>First Name <b aria-hidden="true">*</b></span>
            <input name="firstName" autoComplete="given-name" placeholder="eg. John" required />
          </label>
          <label className="application-field">
            <span>Last Name <b aria-hidden="true">*</b></span>
            <input name="lastName" autoComplete="family-name" placeholder="eg. Doe" required />
          </label>
        </div>

        <div className="application-form-row">
          <label className="application-field">
            <span>Phone Number <b aria-hidden="true">*</b></span>
            <input name="phone" type="tel" autoComplete="tel" placeholder="+123-456-7890-123" required />
          </label>
          <label className="application-field">
            <span>E-mail Address <b aria-hidden="true">*</b></span>
            <input name="email" type="email" autoComplete="email" placeholder="name@email.com" required />
          </label>
        </div>

        <div className="application-form-row">
          <label className="application-field">
            <span>Business/Employer <b aria-hidden="true">*</b></span>
            <input name="employer" autoComplete="organization" placeholder="eg. Your Company" required />
          </label>
          <label className="application-field">
            <span>Monthly income (₦) <b aria-hidden="true">*</b></span>
            <input name="monthlyIncome" inputMode="numeric" onInput={handleMoneyInput} required />
          </label>
        </div>

        <div className="application-form-row">
          <label className="application-field">
            <span>Amount needed (₦) <b aria-hidden="true">*</b></span>
            <input name="amountNeeded" inputMode="numeric" defaultValue={formatMoneyInput(prefilledAmount)} onInput={handleMoneyInput} required />
          </label>
          <label className="application-field">
            <span>Duration (months) <b aria-hidden="true">*</b></span>
            <input name="duration" type="number" inputMode="numeric" min="1" max="12" defaultValue={prefilledDuration} required />
          </label>
        </div>

        <label className="application-field application-address-field">
          <span>Home Address <b aria-hidden="true">*</b></span>
          <textarea
            name="homeAddress"
            autoComplete="street-address"
            placeholder="Enter your full residential address"
            rows="3"
            required
          />
        </label>

        <div className="application-form-row application-identification-row">
          <label className="application-field">
            <span>BVN (11 digits) <b aria-hidden="true">*</b></span>
            <input name="bvn" inputMode="numeric" minLength="11" maxLength="11" required />
          </label>
          <label className="application-field">
            <span>NIN <b aria-hidden="true">*</b></span>
            <input name="nin" inputMode="numeric" maxLength="11" required />
          </label>
        </div>

        <label className="application-upload-field">
          <span className="application-upload-label">Passport Photograph <b aria-hidden="true">*</b></span>
          <span className="application-upload-box">
            <input
              name="passportPhotograph"
              type="file"
              accept="image/jpeg,image/png"
              aria-describedby="passport-upload-help passport-upload-error"
              required
              onChange={handleFileChange}
            />
            <img src="/assets/application-upload.svg" alt="" />
            <span className="application-upload-copy">
              <strong>{fileName || 'Click to upload a Passport photograph'}</strong>
              <small id="passport-upload-help"><span>JPG or PNG</span><i /><span>clear &amp; recent image</span><i /><span>Max 5MB</span></small>
            </span>
          </span>
          {fileError && <span className="application-upload-error" id="passport-upload-error" role="alert">{fileError}</span>}
        </label>

        <label className="application-upload-field">
          <span className="application-upload-label">Utility Bill <b aria-hidden="true">*</b></span>
          <span className="application-upload-box">
            <input
              name="utilityBill"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              aria-describedby="utility-bill-upload-help utility-bill-upload-error"
              required
              onChange={handleUtilityBillChange}
            />
            <img src="/assets/application-upload.svg" alt="" />
            <span className="application-upload-copy">
              <strong>{utilityBillFileName || 'Click to upload a recent utility bill'}</strong>
              <small id="utility-bill-upload-help"><span>PDF, JPG or PNG</span><i /><span>proof of home address</span><i /><span>Max 5MB</span></small>
            </span>
          </span>
          {utilityBillError && <span className="application-upload-error" id="utility-bill-upload-error" role="alert">{utilityBillError}</span>}
        </label>

        <p className="application-consent">
          By clicking this button, you confirm that you have read and agree to our{' '}
          <a href="/terms-and-conditions">Terms &amp; Conditions</a> and{' '}
          <a href="/privacy-policy">Privacy Policy</a>
        </p>

        <button className="button button-primary application-submit" type="submit" disabled={isSubmitting || !isFormComplete || Boolean(fileError) || Boolean(utilityBillError)}>
          {isSubmitting ? 'Submitting…' : 'Apply for a Loan'}
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
        {image && <img src={image} alt={`${title} service`} style={{ objectPosition: imagePosition }} />}
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
        {image && <img src={image} alt="" style={{ objectPosition: imagePosition }} />}
      </div>
      <div className="service-card-content">
        <div className="service-copy">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="service-link">
          <span>Learn More</span>
          <img src={arrow} alt="" />
        </span>
      </div>
    </a>
  );
}

function ServicesSection() {
  return (
    <section className="services-section" id="services" data-node-id="32:19">
      <div className="services-container">
        <div className="services-heading">
          <div className="services-title">
            <p className="section-label">OUR SERVICES</p>
            <h2>Whatever You're Building, We Have a Loan for It.</h2>
          </div>
          <a className="button button-primary services-heading-cta" href="/services">Explore More Services</a>
        </div>

        <div className="services-grid">
          {services.map((service) => <ServiceCard key={service.title} {...service} />)}
        </div>

        <div className="services-actions">
          <a className="button button-primary" href="/services">Explore More Services</a>
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
      const cardHeight = list.scrollHeight / benefits.length;
      const mediaCenter = mediaRect.top + (mediaRect.height / 2);
      const rawProgress = ((mediaCenter - listRect.top) / cardHeight) - 0.5;
      const progress = Math.max(0, Math.min(benefits.length - 1, rawProgress));
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
          <p className="section-label">BENEFITS</p>
          <h2>Reasons Why Businesses Trust IOU Finance</h2>
        </div>

        <div className="benefits-content">
          <div className="benefits-list" ref={listRef}>
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.title}>
                <img
                  className="benefit-media-mobile"
                  src={benefit.image}
                  alt={benefit.imageAlt}
                  style={{ objectPosition: benefit.imagePosition }}
                  loading="lazy"
                />
                <div className="benefit-copy">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="benefit-sticky-media" aria-hidden="true" data-node-id="37:110" ref={stickyMediaRef}>
            {benefits.map((benefit, index) => (
              <img
                className="benefit-sticky-image"
                src={benefit.image}
                alt=""
                style={{ objectPosition: benefit.imagePosition }}
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
    <section className="stats-section" id="stats" aria-label="IOU Finance statistics" data-node-id="40:113" ref={sectionRef}>
      <div className="stats-container">
        {stats.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <strong aria-label={formatStat(stat, 1)}>
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
      />
    </div>
  );
}

function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const step = applicationSteps[activeStep];

  return (
    <section className="process-section" id="process" data-node-id="45:485">
      <div className="process-row step-row">
        <ProcessImage src={step.image} alt={step.imageAlt} position={step.imagePosition} />

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
              aria-label="Previous application step"
            >
              <img src={activeStep === 0 ? '/assets/step-back-disabled.svg' : '/assets/step-back.svg'} alt="" />
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((current) => current + 1)}
              disabled={activeStep === applicationSteps.length - 1}
              aria-label="Next application step"
            >
              <img src={activeStep === applicationSteps.length - 1 ? '/assets/step-forward-disabled.svg' : '/assets/step-forward.svg'} alt="" />
            </button>
          </div>
        </div>
      </div>

      <div className="process-row eligibility-row">
        <div className="eligibility-content">
          <div className="eligibility-intro">
            <h2>WHO CAN APPLY?</h2>
            <p>Whether you sell in the market, run a small shop, or earn a fixed salary, IOU Finance is built for you. We keep the process simple and the requirements few, so getting funded doesn't feel like a battle.</p>
          </div>

          <div className="documents-block">
            <h3>Documents Needed</h3>
            <div className="documents-grid">
              {requiredDocuments.map((document) => (
                <div className="document-item" key={document}>
                  <img src="/assets/checkmark-circle.svg" alt="" />
                  <span>{document}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="eligibility-actions">
            <a className="button button-primary" href="/application">Apply for a Loan</a>
            <a className="button button-dark-outline" href="/services">Explore our Services</a>
          </div>
        </div>

        <ProcessImage
          src="/assets/process-eligibility.jpg"
          alt="A small business owner who is eligible to apply"
          position="48% 40%"
        />
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const trackRef = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialOffset, setTestimonialOffset] = useState(0);
  const visibleTestimonials = window.innerWidth >= 1350 ? 4 : window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  const lastTestimonial = testimonials.length - visibleTestimonials;

  useEffect(() => {
    const resetCarousel = () => {
      setActiveTestimonial(0);
      setTestimonialOffset(0);
    };

    window.addEventListener('resize', resetCarousel);
    return () => window.removeEventListener('resize', resetCarousel);
  }, []);

  const moveCarousel = (direction) => {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;

    if (!track || !firstCard) return;

    const next = Math.min(Math.max(activeTestimonial + direction, 0), lastTestimonial);
    const step = firstCard.getBoundingClientRect().width + 20;
    const left = Math.min(next * step, track.scrollWidth - track.parentElement.clientWidth);

    setTestimonialOffset(left);
    setActiveTestimonial(next);
  };

  return (
    <section className="testimonials-section" id="testimonials" data-node-id="53:1822">
      <div className="testimonials-container">
        <div className="testimonials-heading">
          <div className="testimonials-title">
            <p className="section-label">TESTIMONIALS</p>
            <h2>Hear From The Hustlers Who Trust Us Every Day</h2>
          </div>

          <div className="testimonial-controls">
            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              disabled={activeTestimonial === 0}
              aria-label="Previous testimonials"
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
              aria-label="Next testimonials"
            >
              <img
                className={activeTestimonial === lastTestimonial ? 'arrow-reversed' : ''}
                src={activeTestimonial === lastTestimonial ? '/assets/testimonial-back-disabled.svg' : '/assets/testimonial-forward.svg'}
                alt=""
              />
            </button>
          </div>
        </div>

        <div className="testimonials-viewport">
          <div
            className="testimonials-track"
            ref={trackRef}
            style={{ transform: `translate3d(-${testimonialOffset}px, 0, 0)` }}
          >
            {testimonials.map((testimonial, index) => (
              <article className={`testimonial-card ${index % 2 === 1 ? 'testimonial-card-dark' : ''}`} key={testimonial.name}>
                <div className="testimonial-stars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, star) => (
                    <img src="/assets/testimonial-star.svg" alt="" key={star} />
                  ))}
                </div>

                <blockquote>{testimonial.quote}</blockquote>

                <div className="testimonial-author">
                  <img className="testimonial-avatar" src="/assets/testimonial-avatar.png" alt="" />
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
  title = 'Your Next Move Starts With Funding.',
  description = 'No collateral, no long wait. Apply now and get cash in your account, same day.',
  primaryHref = '/application',
  secondaryLabel = 'Explore our Services',
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
          <a className="button button-primary" href={primaryHref}>Apply for a Loan</a>
          <a className="button button-dark-outline" href={secondaryHref}>{secondaryLabel}</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="contact" data-node-id="59:2131">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-intro">
            <a className="footer-brand" href="/#home" aria-label="IOU Finance home">
              <img src="/assets/footer-logo.png" alt="IOU Finance Ltd." />
            </a>
            <p>IOU Finance gives market women, traders and business owners fast access to loans, no collateral, no long wait. Spend. Save. Earn.</p>
          </div>

          <img className="footer-divider" src="/assets/footer-divider.svg" alt="" />

          <nav className="footer-navigation" aria-label="Footer navigation">
            <div className="footer-column">
              <h2>Menu</h2>
              <div className="footer-links">
                {navItems.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
              </div>
            </div>

            <div className="footer-column">
              <h2>Our Services</h2>
              <div className="footer-links">
                {servicesCatalog.slice(0, 5).map((service) => (
                  <a href={service.href} key={service.slug}>{service.title}</a>
                ))}
                <a className="footer-services-link" href="/services">
                  <span>View All Services</span>
                  <img src="/assets/footer-arrow.svg" alt="" />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h2>Security</h2>
              <div className="footer-links">
                <a href="/terms-and-conditions">Terms &amp; Conditions</a>
                <a href="/privacy-policy">Privacy Policy</a>
              </div>
            </div>

            <div className="footer-column footer-contact-column">
              <h2>Social</h2>
              <address className="footer-contact-list">
                <a href="mailto:contact@ioufinanceltd.com">
                  <img src="/assets/footer-mail.svg" alt="" />
                  <span>contact@ioufinanceltd.com</span>
                </a>
                <a href="tel:+2347025700040">
                  <img src="/assets/footer-call.svg" alt="" />
                  <span>+234-702-5700-040</span>
                </a>
                <div>
                  <img src="/assets/footer-location.svg" alt="" />
                  <span>20 mojidi street, off toyin street ikeja, Lagos</span>
                </div>
              </address>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <img className="footer-divider" src="/assets/footer-divider.svg" alt="" />
          <p>© 2026 IOU Finance. All rights reserved.</p>
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
  return (
    <main className="services-page">
      <div className="services-page-shell">
        <ServicesHero />
        <NavBar />
      </div>
      <ServicesCatalogSection />
      <FundingCtaSection
        title="Pick a Loan. Start Growing."
        description="Whatever you need funding for, we've got an option that fits. Apply now and get a decision fast."
        primaryHref="/application"
        secondaryLabel="Contact Us"
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
  return (
    <main className="faq-page">
      <div className="faq-page-shell">
        <FaqHero />
        <NavBar />
      </div>
      <FaqSection />
      <FundingCtaSection
        title="Ready to Get Funded?"
        description="Apply in minutes or talk to someone who can guide you. We're here either way."
        primaryHref="/application"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
        sectionId="faq-cta"
      />
      <Footer />
    </main>
  );
}

function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-page-shell">
        <AboutPageHero />
        <NavBar />
      </div>
      <AboutStatementSection />
      <AboutMissionSection />
      <StatsSection />
      <ServicesSection />
      <AboutTeamSection />
      <FundingCtaSection
        title="Join our Family and get funded today"
        description="Apply today and see why thousands of traders and business owners trust IOU Finance."
        primaryHref="/application"
        secondaryLabel="Explore our Services"
        secondaryHref="/services"
        sectionId="about-cta"
        variant="funding-cta-services"
      />
      <Footer />
    </main>
  );
}

function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-page-shell">
        <ContactPageHero />
        <NavBar />
      </div>
      <ContactSection />
      <FundingCtaSection
        title="Ready to Get Funded?"
        description="Skip the wait, apply for a loan now and let's get you sorted."
        primaryHref="/application"
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

function ServiceDetailPage({ service }) {
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
        title="Ready to Handle Your Emergency?"
        description="Apply now and get funded the same day, no stress, no delays."
        primaryHref="/application"
        secondaryLabel="Contact Us"
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
          <p>Last updated: Jan 2025</p>
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
    checkSession();
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      setAuthState('unauthenticated');
    }
  };

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
  const [serviceRecords, setServiceRecords] = useState(() => readServiceCmsRecords());
  const [selectedSlug, setSelectedSlug] = useState(() => readServiceCmsRecords()[0]?.slug || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [uploadingField, setUploadingField] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const selectedService = serviceRecords.find((service) => service.slug === selectedSlug) || serviceRecords[0];
  const [draft, setDraft] = useState(selectedService || null);

  useEffect(() => {
    setDraft(selectedService ? { ...selectedService } : null);
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

  const persistRecords = async (nextRecords, message) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/cms/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: nextRecords }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        onSessionExpired();
        throw new Error('Your admin session expired. Please sign in again.');
      }
      if (!response.ok || !Array.isArray(result.records)) {
        throw new Error(result.error || 'The service content could not be saved.');
      }
      const savedRecords = saveServiceCmsRecords(result.records);
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
          <img src="/assets/logo-raw-2.png" alt="IOU Finance Ltd." />
        </a>
        <nav className="admin-nav" aria-label="Admin navigation">
          <a className="admin-nav-item admin-nav-item-active" href="/admin">
            <span className="admin-nav-mark" aria-hidden="true" />
            Services
          </a>
          <a className="admin-nav-item" href="/#home">
            <span className="admin-nav-mark" aria-hidden="true" />
            View website
          </a>
        </nav>
        <div className="admin-sidebar-footer">
          <span>Cloud workspace</span>
          <p>Service content and uploaded images are stored securely in Cloudflare KV.</p>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-overline">IOU Finance CMS</span>
            <h1>Services</h1>
          </div>
          <div className="admin-topbar-actions">
            <a className="admin-button admin-button-secondary" href="/services" target="_blank" rel="noreferrer">Preview website</a>
            <button className="admin-button admin-button-secondary" type="button" onClick={onSignOut}>Sign out</button>
            <button className="admin-button admin-button-primary" type="button" onClick={addService} disabled={isSaving}>Add service</button>
          </div>
        </header>

        <div className="admin-metrics" aria-label="Service content summary">
          <div><strong>{serviceRecords.length}</strong><span>Total services</span></div>
          <div><strong>{publishedCount}</strong><span>Published</span></div>
          <div><strong>{draftCount}</strong><span>Drafts</span></div>
          <div><strong>KV</strong><span>Storage mode</span></div>
        </div>

        <div className="admin-content-grid">
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
                </div>

                <div className="admin-form-section">
                  <div className="admin-form-section-heading"><h3>Service details</h3><p>Controls the first three dynamic sections of the service page.</p></div>
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
        </div>
      </section>

      {notice && <div className="admin-notice" role="status">{notice}</div>}
    </main>
  );
}

export default function App() {
  const pagePath = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const serviceSlug = pagePath.startsWith('/services/') ? pagePath.slice('/services/'.length) : '';
  const serviceDetail = serviceDetailContentBySlug[serviceSlug];
  if (pagePath === '/admin') return <AdminAccess />;
  if (pagePath === '/services') return <ServicesPage />;
  if (serviceDetail) return <ServiceDetailPage service={serviceDetail} />;
  if (pagePath === '/faq') return <FaqPage />;
  if (pagePath === '/about') return <AboutPage />;
  if (pagePath === '/contact') return <ContactPage />;
  if (pagePath === '/application' || pagePath === '/apply') return <ApplicationPage />;
  if (pagePath === '/terms-and-conditions' || pagePath === '/terms') {
    return <LegalPage title="Terms of use" sections={termsSections} nodeId="170:3766" />;
  }
  if (pagePath === '/privacy-policy' || pagePath === '/privacy') {
    return <LegalPage title="Privacy Policy" sections={privacySections} nodeId="175:592" />;
  }
  return <HomePage />;
}
