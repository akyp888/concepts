// NobleServe facts: the only knowledge the assistant uses. Shared by the browser chat and the /api/chat function.
export const FACTS = [
  { id: 'vendor', k: ['lender', 'lend', 'lending', 'bank', 'insurer', 'underwriter'],
    a: 'NobleServe is a mortgage services company. It does back-office work for lenders, title agents and servicers across originations, title, curative, settlement, servicing and valuations. For licensing or role questions, write to info@nobleserve.com.',
    src: 'mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'what', k: ['what', 'do', 'does', 'company', 'who', 'service', 'founded', 'year', 'since', 'old', 'history', 'business', 'nobleserve'],
    a: 'NobleServe is a mortgage services company founded in 2017. Teams in Pittsburgh, Bangalore and Coimbatore work across six practices: originations, title, curative, settlement, servicing and valuations.',
    src: 'nobleserve.com and mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'where', k: ['where', 'office', 'center', 'centre', 'location', 'pittsburgh', 'bangalore', 'coimbatore', 'india', 'address', 'team', 'based'],
    a: 'Three centers. Pittsburgh: Two Penn Center West, Suite 400. Bangalore: Embassy Manyata Business Park, Hebbal. Coimbatore: Hanudev Infopark, Nava India.',
    src: 'nobleserve.com/contact-us, read Nov 1, 2026' },
  { id: 'size', k: ['people', 'staff', 'employee', 'headcount', 'employ', 'size', 'big', 'large'],
    a: 'NobleServe works from three centers: Pittsburgh, Bangalore and Coimbatore. For current team size, write to info@nobleserve.com.',
    src: 'nobleserve.com/contact-us, read Nov 1, 2026' },
  { id: 'qualia', k: ['qualia', 'marketplace', 'order', 'ordering', 'inside'],
    a: 'NobleServe has been a Qualia Marketplace vendor since 2017. Title agents order title search reports, commitment typing, tax search reports and release tracking from inside Qualia. Qualia\'s case study reports 12,000+ orders through the Marketplace in a nine-month period.',
    src: 'Qualia case study on NobleServe, qualia.com, undated' },
  { id: 'closeville', k: ['closeville', 'ocr', 'commitment', 'typing', 'handwritten', 'production'],
    a: 'CloseVille is NobleServe\'s AI-powered title production platform, from search package to commitment. It covers automated property reports and commitment typing, prompt-driven underwriting rules, workflow orchestration with production visibility, and API integrations, including two-way sync with Qualia.',
    src: 'NobleServe NS3 2026 product sheet; Qualia case study on NobleServe' },
  { id: 'pcr', k: ['pcr', 'post-closing', 'postclosing', 'lifecycle', 'shipping', 'stacking'],
    a: 'PCR is NobleServe\'s post-closing and recording platform: AI-driven classification, extraction and indexing, intelligent stacking, automated exception detection and QC, and lifecycle visibility from the closing table to county recording and shipping.',
    src: 'NobleServe NS3 2026 product sheet' },
  { id: 'products', k: ['product', 'platform', 'tool', 'proprietary', 'ai', 'artificial', 'automation', 'automate', 'technology', 'tech', 'software', 'machine'],
    a: 'NobleServe runs three proprietary AI platforms: CloseVille for title production, PCR for post-closing and recording, and NobleDox for document intelligence. In NobleServe\'s words: AI and automation provide the structure. People provide the judgment and accountability.',
    src: 'NobleServe NS3 2026 product sheet' },
  { id: 'ai', k: ['nobledox', 'document', 'intelligence', 'trailing', 'investor'],
    a: 'NobleDox is NobleServe\'s document intelligence platform. It turns mortgage documents into structured, searchable, workflow-ready data: AI-driven classification, extraction and indexing, automated package stacking and audit readiness, and investor and agency package preparation. In NobleServe\'s words: AI and automation provide the structure. People provide the judgment and accountability.',
    src: 'NobleServe NS3 2026 product sheet; NobleServe LinkedIn, Sep 2026' },
  { id: 'title', k: ['title', 'search', 'tax', 'easement', 'county', 'record', 'nationwide', 'residential'],
    a: 'The title practice covers order entry, nationwide residential title search, commitment typing, tax search, vendor management and easement plotting.',
    src: 'mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'curative', k: ['curative', 'lien', 'release', 'payoff', 'judgment', 'hoa', 'hoi', 'cure'],
    a: 'Curative covers end-to-end curative work, payoff ordering, release requests, HOA and HOI ordering and judgment payoffs. Lien release and payoff quotes also sit in servicing.',
    src: 'mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'settlement', k: ['settlement', 'closing', 'close', 'notary', 'recording', 'funding', 'disclosure', 'policy'],
    a: 'Settlement covers the closing disclosure, notary scheduling, pre-closing and post-closing, recording, funding and policy typing.',
    src: 'mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'originations', k: ['origination', 'originate', 'loan', 'setup', 'underwriting', 'processing', 'indexing', 'secondary'],
    a: 'Originations covers new loan setup, indexing and data extraction, processing, underwriting support, post-closing services and secondary market support.',
    src: 'mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'servicing', k: ['servicing', 'servicer', 'escrow', 'default', 'foreclosure', 'bankruptcy', 'collection', 'payment', 'customer'],
    a: 'Servicing covers new loan setup, document management, lien release and payoff quotes, escrow, payment collection, default management, foreclosure, bankruptcy and customer service support.',
    src: 'mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'valuations', k: ['valuation', 'appraisal', 'appraise', 'bpo', 'preservation', 'worth', 'value'],
    a: 'Valuations covers appraisal QC, BPO QC, vendor management and property preservation review.',
    src: 'mortgage.nobleserve.com, read Nov 1, 2026' },
  { id: 'other', k: ['healthcare', 'medical', 'coding', 'rcm', 'cycle', 'it-services', 'development', 'mobile', 'web'],
    a: 'Beyond mortgage, NobleServe runs healthcare coding and revenue cycle services, and IT services covering enterprise, web and mobile development.',
    src: 'nobleserve.com, read Nov 1, 2026' },
  { id: 'start', k: ['start', 'contact', 'email', 'talk', 'reach', 'hire', 'begin', 'sales', 'call', 'onboard', 'engage', 'started'],
    a: 'Write to info@nobleserve.com with your volume, states and the work you want off your desk.',
    src: 'nobleserve.com, read Nov 1, 2026' }
];
export const PEOPLE = { id: 'people',
  a: 'In NobleServe\'s words: AI and automation provide the structure. People provide the judgment and accountability.',
  src: 'NobleServe LinkedIn, Sep 2026' };
export const CONCEPT = { id: 'concept',
  a: 'This is an unsolicited concept by pulplabs.ai, built from NobleServe\'s public information on Nov 2, 2026. It is not NobleServe\'s official website.',
  src: 'This concept' };
export const REFUSE = { id: 'refuse',
  a: 'That one needs a person. Write to info@nobleserve.com and the team will answer it directly.',
  src: '' };
export const NOMATCH = { id: 'nomatch',
  a: 'I could not find that in the facts I use. Try a product, a practice, Qualia or the offices. Or write to info@nobleserve.com.',
  src: 'No match' };
// fixed, checked answers: the /api/chat function serves these without the model
export const BADGES = { id: 'badges',
  a: 'nobleserve.com shows six badges: MBA, NASSCOM, AICPA SOC, ISO 27001, HIPAA and AAPC. The mortgage site shows the first four; HIPAA and AAPC belong to NobleServe\'s healthcare practice. For the current SOC report, the ISO certificate and what each covers, write to info@nobleserve.com.',
  src: 'nobleserve.com and mortgage.nobleserve.com, read Nov 1, 2026' };
export const INTEG = { id: 'integ',
  a: 'The integration NobleServe has published is CloseVille\'s two-way sync with Qualia for orders, status and documents. Title agents can also order NobleServe\'s title services inside Qualia Marketplace. Integrations for PCR or NobleDox, or with systems such as Encompass, ResWare or SoftPro, are not published; write to info@nobleserve.com.',
  src: 'Qualia case study on NobleServe; NobleServe NS3 2026 product sheet' };
export const VALUE = { id: 'value',
  a: 'In NobleServe\'s words, its technology-driven services have helped clients increase profitability, with service levels set to each client\'s requirements. NobleServe has not published standard SLAs, prices or savings figures; write to info@nobleserve.com for terms.',
  src: 'nobleserve.com, read Nov 1, 2026' };
export const COVERAGE = { id: 'coverage',
  a: 'NobleServe lists nationwide residential title search among its title services. It has not published state or county coverage or volume capacity; for a specific state, county or volume, write to info@nobleserve.com.',
  src: 'mortgage.nobleserve.com, read Nov 1, 2026' };
export const ONSHORE = { id: 'onshore',
  a: 'NobleServe runs US onshore operations from its Pittsburgh center, alongside teams in Bangalore and Coimbatore. To ask which work on your files would be done onshore, write to info@nobleserve.com.',
  src: 'mortgage.nobleserve.com; nobleserve.com/contact-us, read Nov 1, 2026' };
export const AISINCE = { id: 'aisince',
  a: 'NobleServe was founded in 2017. It has not published when each of its platforms, CloseVille, PCR and NobleDox, was introduced; for a timeline, write to info@nobleserve.com.',
  src: 'nobleserve.com, read Nov 1, 2026' };
export const SERVICES = { id: 'services',
  a: 'NobleServe works across six practices:\n\n- **Originations:** new loan setup, processing and underwriting support\n- **Title:** title search, commitment typing and tax search\n- **Curative:** payoff ordering, release requests and judgment payoffs\n- **Settlement:** closing disclosure, notary scheduling and recording\n- **Servicing:** escrow, default management, lien release and payoff quotes\n- **Valuations:** appraisal QC, BPO QC and property preservation review',
  src: 'mortgage.nobleserve.com, read Nov 1, 2026' };
export const CHATLOG = { id: 'chatlog',
  a: 'This chat is a concept by pulplabs.ai. Your question is sent to an AI model to answer it, so please do not enter borrower or personal details. Your browser keeps this conversation until you close the tab.',
  src: 'This concept' };
const REFUSE_K = new Set(['price', 'pricing', 'cost', 'charge', 'fee', 'quote', 'much', 'rate', 'cheap', 'turnaround', 'accuracy', 'accurate', 'percent', 'certified', 'certification', 'certificate', 'soc', 'soc2', 'iso', 'hipaa', 'compliant', 'compliance', 'secure', 'security', 'safe', 'insured', 'insurance', 'licensed', 'license', 'state', 'coverage', 'salary', 'offshore', 'volume', 'capacity', 'fast', 'faster', 'quickly', 'speed', 'minute', 'hour', 'instant', 'instantly', 'store', 'stored', 'host', 'hosted', 'train', 'training', 'privacy', 'residency', 'encrypt', 'encrypted', 'encryption', 'npi', 'nonpublic', 'glba', 'trid', 'respa', 'nda', 'baa', 'cloud', 'aws', 'azure', 'llm', 'model', 'gpt', 'chatgpt', 'openai', 'minimum']);
const REFUSE_RE = /\bwho\b.*\b(lenders|banks|servicers|title agents|companies)\b.*\bwork(s|ed)? with\b|\bwho uses\b|\bbackground (checks?|screen\w*)\b|\bhow (long|fast|quick|quickly)\b|\bturn ?(around|time)\b|\bsame[- ]day\b|\bwho (are|is) your (client|customer)|\b(name|list|examples?|references?)\b.*\b(clients?|customers?)\b|\b(clients?|customers?) (list|names?|references?)\b|\b(an?|your) (clients?|customers?)\?*$|\byour (clients|customers)\b|\bwho('s| is| are)\b.*\b(clients?|customers?)\b(?! service)|\b(biggest|largest|main|top|major|key|notable|current|existing|any) (clients?|customers?)\b(?! service)|\b(clients?|customers?) (testimonials?|reviews?|case studies)\b|\b(which|what) (clients|customers|lenders|banks)\b|\b(which|what|who)\b.*\bunderwriters?\b|\b(first american|fidelity|old republic|stewart|chicago title)\b|\b(my|your|our|client|borrower|customer) data\b|\b(data|files?|documents?|records?|information|info|pii)\b.*\b(onshore|in the (us|usa|united states))\b|\bonshore\b.*\b(data|information|pii)\b|\bdata (kept|location)\b|\b(all|every|each)\b.*\b(county|counties|states?)\b|\bhow many\b(?!.*\b(offices?|centers?|centres?|locations?|practices?|products?|platforms?|years?|people|staff|employees?|orders?)\b)/;
const ROLE_RE = /^(are you|is nobleserve|is it|is this company)\s+(a|an)\s+(\w+\s)?(lender|bank|title (company|agency|agent|insurer|insurance company|underwriter)|underwriter|insurer|bpo|outsourc\w*|servicer|notary|settlement (agent|company)|appraisal management company|amc|appraiser|law firm|escrow (company|agent))\b|\b(issue|write|sell|underwrite)s?\b.*\b(polic\w*|insurance|loans?|mortgages?)\b|^do you (service|lend|make|originate) (loans|mortgages)\b/;
const PEOPLE_RE = /\b(ai|platforms?|models?|automation)\b.*\b(wrong|makes? (an? )?(mistakes?|errors?))\b|\bai or (people|humans?)\b|\b(people|humans?) or ai\b|\b(humans?|person|people|examiners?|staff)\b.*\b(check\w*|review\w*|verif\w*|approv\w*|oversee\w*)\b|\b(check\w*|review\w*|verif\w*|approv\w*)\b.*\b(humans?|person|people|examiners?)\b|\breplace\b|\b(fully|completely|100%) automat\w*|\b(decide|decides|decision|decisions)\b|\bhuman[- ]in[- ]the[- ]loop\b|\bsigns? off\b/;
const CONCEPT_RE = /\b(official|real)\b.*\b(site|website|page)\b|\bthis (site|website|page)\b|\bpulplabs\b|\bconcept\b|\bwho (made|built|designed|created|wrote) (this|the) (site|website|page|chat|concept)\b|^who (made|built|designed|created|wrote) this[?.!]*$|^is this real\b/;
const MAKER_RE = /\bwho (made|makes|built|builds|designed|created|developed|develops|owns?|wrote)\b.*\b(closeville|pcr|nobledox|platforms?|products?|tools?|software|it|them|these|those)\b/;
const BADGE_RE = /\b(soc ?(1|2|ii)?|iso|27001|hipaa|aapc|nasscom|mba|mortgage bankers|aicpa|accredit\w*|badges?|logos?|(?<!flood )certifications?|(?<!flood )certificates?|memberships?)\b/;
const CHATLOG_RE = /\b(log\w*|stor\w*|record\w*|sav\w*|keeps?|kept|track\w*|reads?|retain\w*)\s+(my |these |our |this |the |all )?(questions?|chats?|conversations?|messages?|what i (type|ask|write))\b|\b(my|these|our|this|the) (questions?|chats?|conversations?|messages?)\b.*\b(logged|stored|saved|recorded|kept|tracked|retained|private|sent)\b|\bhappens to (my|the) (questions?|messages?|chats?)\b/;
const INTEG_RE = /\b(integrat\w*|sync\w*|api|apis|plug-?ins?)\b|\b(works?|connects?|exports?|feeds?|plugs?) (with|to|into)\b.*\b(qualia|encompass|resware|softpro|ramquest|los(?! angeles)|system|systems|software)\b|\b(encompass|resware|softpro|ramquest|simplifile|csc|black knight|meridianlink|calyx|mortgagebot)\b/;
const VALUE_RE = /\b(slas?|service[- ]levels?|guarantee\w*|profit\w*|roi|savings)\b/;
const STATES = '(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)';
const COVER_RE = new RegExp(`\\b(which|what) (states?|counties)\\b|\\bcounties\\b|\\b(every|each|\\d+) states?\\b|\\b(which|what) county\\b|\\b(in|for|across|covers?|serve|serves) (\\w+ )?county\\b|\\bhandle\\b.*\\b\\d[\\d,]{2,}|(?<![\\d,])(?!12,?000\\b)\\d[\\d,]*\\+?\\s*(loans?|files?|orders?|searches|closings)\\b|\\b(loans?|files?|closings) (a|per) (day|week|month|year)\\b|\\b(in|across|for) ${STATES}\\b`);
const NOT_COVER = /\b(staff|teams?|employees?|office|offices|center|centre|located|based|address|headquarter\w*|licens\w*|insur\w*|pric\w*|costs?|fees?|charge\w*)\b/; // office questions go to where; licence and price questions refuse
const AISINCE_RE = /\b(how long (have|has)|how old|since when|when (did|was|were))\b.*\b(ai|automat\w*|platforms?|closeville|pcr|nobledox)\b/;
const ONSHORE_RE = /\b(onshore|us[- ]based|american (staff|team|employees?))\b|\b(staff|teams?|people|employees?|operations?|work(ers)? done|done|based|located)\b.*\bin the (us|usa|united states|u\.s\.)/;
const SERVICES_RE = /^(what|which) (services|practices) (do you|does nobleserve) (offer|provide|have|do)( exactly| overall)?[?.!]*$|^what are (your|nobleserve's) (services|practices)\??$|^what services\??$/;
const WHAT_RE = /\bhow long have you\b|\bhow old\b|\bwhen (were|was) (you|nobleserve) (founded|started)\b|\bwhat (does|do) (nobleserve|you) do( exactly| again| today| now| here| overall)?[?.!]*$|\btell me about (nobleserve|you|your company)\b|\bwho (are|is) (you|nobleserve)\b|\bwhat is nobleserve\b|\bwhat do you offer( exactly| overall)?[?.!]*$/;
const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'you', 'your', 'i', 'me', 'my', 'we', 'of', 'to', 'in', 'and', 'or', 'for', 'on', 'with', 'can', 'does', 'do', 'what', 'how', 'who', 'it', 'there', 'any']);
const WEIGHT = { nobleserve: 0.3, 'it-services': 3, service: 0.4, company: 0.4, business: 0.5, policy: 1.5, closeville: 2, pcr: 2, nobledox: 2 };
const YN = new Set(['are', 'is', 'do', 'does', 'can', 'will', 'did', 'have', 'has']);
const ROLE_W = new Set();
const GENERIC = new Set(['what']);

const KEYS = new Map();
FACTS.forEach(f => f.k.forEach(k => { if (!KEYS.has(k)) KEYS.set(k, []); KEYS.get(k).push(f); }));
const stem = w => [w, w.replace(/ies$/, 'y'), w.replace(/es$/, ''), w.replace(/s$/, ''), w.replace(/ing$/, ''), w.replace(/([^e])ed$/, '$1'), w.replace(/([^e]e)d$/, '$1')].find(x => KEYS.has(x) || REFUSE_K.has(x) || ROLE_W.has(x)) || w;

export function match(q) {
  const lower = q.toLowerCase().trim();
  const words = lower.replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean).map(stem);
  if (/\bIT\b/.test(q)) words.push('it-services');
  const yn = YN.has(words[0]);
  if (BADGE_RE.test(lower)) return BADGES;
  if (CONCEPT_RE.test(lower)) return CONCEPT;
  if (MAKER_RE.test(lower)) return FACTS.find(f => f.id === 'products');
  if (CHATLOG_RE.test(lower)) return CHATLOG;
  if (ROLE_RE.test(lower)) return FACTS[0];
  if (PEOPLE_RE.test(lower)) return PEOPLE;
  if (INTEG_RE.test(lower)) return INTEG;
  if (VALUE_RE.test(lower)) return VALUE;
  if (COVER_RE.test(lower) && !NOT_COVER.test(lower)) return COVERAGE;
  if (AISINCE_RE.test(lower)) return AISINCE;
  if (SERVICES_RE.test(lower)) return SERVICES;
  if (WHAT_RE.test(lower)) return FACTS[1];
  if (REFUSE_RE.test(lower)) return REFUSE;
  if (words.some(w => REFUSE_K.has(w) && !(w === 'state' && /united states/.test(lower)))) return REFUSE;
  if (ONSHORE_RE.test(lower)) return ONSHORE;
  if (words.includes('revenue') && !words.includes('cycle')) return REFUSE;
  let best = null, score = 0;
  for (const f of FACTS) {
    let s = 0;
    for (const w of new Set(words)) if (f.k.includes(w)) s += STOP.has(w) ? 0.2 : (WEIGHT[w] ?? 1) / Math.sqrt(KEYS.get(w).length);
    if (s > score) { score = s; best = f; }
  }
  if (!best || score < 0.9) return NOMATCH;
  if (yn && GENERIC.has(best.id)) return NOMATCH;
  return best;
}


// ---------- conversational layer (used when the AI endpoint is not available) ----------
const BYID = Object.fromEntries(FACTS.map(f => [f.id, f]));
const MORE = { services: ['title', 'curative', 'settlement'], integ: ['closeville', 'qualia'], badges: ['start'], value: ['start'], coverage: ['title', 'start'], people: ['products'], onshore: ['where'], aisince: ['products'] };
const NAME = { services: 'NobleServe\'s practices', integ: 'integrations', badges: 'its badges', value: 'service levels', coverage: 'coverage', people: 'people and AI', onshore: 'onshore work', aisince: 'its platforms\' history', closeville: 'CloseVille', pcr: 'PCR', ai: 'NobleDox', qualia: 'Qualia', title: 'title', curative: 'curative', settlement: 'settlement', servicing: 'servicing', valuations: 'valuations', originations: 'originations', products: 'NobleServe\'s platforms', where: 'NobleServe\'s centers', what: 'NobleServe', start: 'getting started', other: 'healthcare and IT', vendor: 'NobleServe\'s role', size: 'NobleServe\'s team' };
const RELATED = {
  closeville: ['qualia', 'title'], pcr: ['settlement', 'curative'], ai: ['servicing', 'originations'], products: ['closeville', 'pcr', 'ai'],
  title: ['closeville', 'curative'], curative: ['servicing'], settlement: ['pcr'], servicing: ['curative', 'ai'], valuations: ['originations'],
  originations: ['ai', 'valuations'], qualia: ['closeville'], what: ['products', 'where'], where: ['start'], vendor: ['what'], start: ['where']
};
const TOPIC_RE = { closeville: /closeville/, pcr: /\bpcr\b|post-?closing platform/, ai: /nobledox/, title: /\btitle\b/, curative: /curative|\blien/, settlement: /settlement|closing|recording/, servicing: /servicing|escrow|foreclos|bankrupt/, valuations: /valuation|apprais|\bbpo\b/, originations: /originat|underwriting|loan setup/, qualia: /qualia/ };
export const SUGGEST = {
  services: ['What services do you offer?', 'How do you handle title search?', 'Do you do curative work?', 'What happens after closing?', 'Do you support servicing?', 'How do I get started?'],
  products: ['What products do you have?', 'What is CloseVille?', 'What is PCR?', 'What is NobleDox?', 'Does CloseVille work with Qualia?', 'Do people check the AI?'],
  all: ['What does NobleServe do?', 'What products do you have?', 'What services do you offer?', 'Where are your teams?', 'Do you work inside Qualia?', 'How do I start?']
};
const NEXT = {
  closeville: ['Does CloseVille work with Qualia?', 'What does the title practice cover?'], pcr: ['What does settlement cover?', 'Do you do curative work?'],
  ai: ['What is PCR?', 'What does servicing cover?'], products: ['What is CloseVille?', 'What is PCR?', 'What is NobleDox?'],
  title: ['What is CloseVille?', 'Do you do curative work?'], curative: ['What does servicing cover?', 'What is PCR?'], settlement: ['What is PCR?', 'Do you do curative work?'],
  servicing: ['What is NobleDox?', 'Do you do curative work?'], valuations: ['What does originations cover?'], originations: ['What is NobleDox?', 'Do you do valuations?'],
  qualia: ['What is CloseVille?'], what: ['What products do you have?', 'Where are your teams?'], where: ['How do I start?'], start: ['What services do you offer?'],
  services: ['How do you handle title search?', 'Do you do curative work?', 'What happens after closing?'], integ: ['What is CloseVille?', 'Do you work inside Qualia?']
};
// products mode keeps follow-ups on the platforms
const PNEXT = { closeville: ['Does CloseVille work with Qualia?', 'What is PCR?', 'What is NobleDox?'], pcr: ['What is NobleDox?', 'What is CloseVille?', 'Do people check the AI?'], ai: ['What is PCR?', 'What is CloseVille?', 'Do people check the AI?'], qualia: ['Does CloseVille work with Qualia?', 'What is CloseVille?'] };
const PREL = { pcr: ['ai', 'closeville'], ai: ['pcr', 'closeville'], closeville: ['qualia', 'pcr'], qualia: ['closeville'], products: ['closeville', 'pcr', 'ai'] };
const PROD_Q = /closeville|\bpcr\b|nobledox|qualia|products?\b|\bai\b/i;
function nextFor(id, mode, history, shown = [id]) {
  const asked = new Set(history.filter(m => m.role === 'user').map(m => m.content.trim().toLowerCase()));
  const pick = l => uniq(l).filter(q => !asked.has(q.toLowerCase()) && !shown.includes(match(q).id)).slice(0, 3);
  const own = pick(mode === 'products' ? [...(PNEXT[id] || NEXT[id] || []).filter(q => PROD_Q.test(q)), ...SUGGEST.products] : NEXT[id] || []);
  return own.length ? own : pick(SUGGEST[mode] || SUGGEST.all);
}
const greet = /^(hi|hello|hey|hiya|good (morning|afternoon|evening))\b/;
const thanks = /\b(thanks|thank you|cheers|great|perfect|awesome)\b/;
const more = /^(tell me more|more|go on|explain( more)?|details?|and\??|what else\??|more please|elaborate)\.?$|\bmore about (it|that|this)\b|\btell me more\b/;

function services(mode) {
  return mode === 'products' ? 'NobleServe\'s three platforms, CloseVille, PCR and NobleDox' : 'NobleServe\'s services across the mortgage journey, from originations and title to settlement and servicing';
}
// history: [{role, content, topic?}] ; returns { text, sources, topic, next }
export function localReply(history, mode = 'all') {
  const last = [...history].reverse().find(m => m.role === 'user');
  const q = (last ? last.content : '').trim();
  const lower = q.toLowerCase();
  const prevTopic = [...history].reverse().find(m => m.role === 'assistant' && m.topic)?.topic;
  if (!q) return { text: 'Ask me anything about ' + services(mode) + '.', sources: [], next: SUGGEST[mode] || SUGGEST.all };
  if (greet.test(lower) && lower.split(/\s+/).length <= 4) return { text: 'Hello. I can answer questions about ' + services(mode) + '. Answers come from what NobleServe has published, with the source shown.', sources: [], next: (SUGGEST[mode] || SUGGEST.all).slice(0, 4) };
  if (thanks.test(lower) && lower.split(/\s+/).length <= 5) return { text: 'Glad that helped. For anything I cannot answer here, write to info@nobleserve.com.', sources: [], next: nextFor(prevTopic, mode, history) };
  if (more.test(lower) && prevTopic && (RELATED[prevTopic] || MORE[prevTopic])) {
    const seen = f => history.some(m => m.role === 'assistant' && m.content.includes(f.a));
    const rel = (mode === 'products' && PREL[prevTopic] || MORE[prevTopic] || RELATED[prevTopic]).map(id => BYID[id]).filter(f => f && !seen(f));
    const lead = `That is everything NobleServe has published on ${NAME[prevTopic] || 'that'}.`;
    if (!rel.length) return { text: lead + ' For more, write to info@nobleserve.com.', sources: [], topic: prevTopic, next: nextFor(prevTopic, mode, history) };
    return { text: lead + ' Related:\n\n' + rel.map(f => `**${cap(NAME[f.id] || f.id)}.** ${f.a}`).join('\n\n'), sources: uniq(rel.map(f => f.src)), topic: rel[0].id, next: nextFor(rel[0].id, mode, history, rel.map(f => f.id)) };
  }
  // several named topics in one question: answer each
  const topics = Object.entries(TOPIC_RE).filter(([, re]) => re.test(lower)).map(([id]) => id);
  const direct = match(q);
  if (topics.length >= 2 && (direct === NOMATCH || (BYID[direct.id] === direct && direct !== FACTS[0]))) {
    const fs = uniq(topics).slice(0, 3).map(id => BYID[id]).filter(Boolean);
    return { text: fs.map(f => `**${cap(NAME[f.id])}.** ${f.a}`).join('\n\n'), sources: uniq(fs.map(f => f.src)), topic: fs[0].id, next: nextFor(fs[0].id, mode, history, fs.map(f => f.id)) };
  }
  if (direct.id === 'nomatch' && prevTopic === 'coverage' && /^(what about|and|how about)\b/.test(lower)) return { text: COVERAGE.a, sources: [COVERAGE.src], topic: 'coverage', next: nextFor('coverage', mode, history) };
  if (direct.id === 'nomatch' && prevTopic && /^(what about|and|how about)\b/.test(lower)) return { text: direct.a, sources: [], next: SUGGEST[mode] };
  if (/^(do|does|can|could|will|is|are|have|has)\b/.test(lower) && LISTED.has(direct.id)) return { text: `Here is what NobleServe lists for ${NAME[direct.id]}:\n\n${direct.a}\n\nIf what you need is not on that list, write to info@nobleserve.com.`, sources: [direct.src], topic: direct.id, next: nextFor(direct.id, mode, history) };
  return { text: direct.a, sources: direct.src && !/No match/.test(direct.src) ? [direct.src] : [], topic: ['refuse', 'nomatch', 'concept', 'chatlog'].includes(direct.id) ? prevTopic : direct.id, next: nextFor(direct.id, mode, history) };
}
const LISTED = new Set(['title', 'curative', 'settlement', 'originations', 'servicing', 'valuations', 'closeville', 'pcr', 'ai', 'other']);
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const uniq = a => [...new Set(a)];

// ---------- retrieval and prompt for the AI endpoint ----------
export function retrieve(text, k = 8) {
  const lower = text.toLowerCase();
  const words = new Set(lower.replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w)));
  const scored = FACTS.map(f => { const hits = f.k.filter(w => words.has(w) || words.has(w + 's')).length; return { f, hits, s: hits + (f.id === 'products' || f.id === 'what' ? 0.3 : 0) }; });
  return scored.sort((a, b) => b.s - a.s).slice(0, k).map(x => ({ ...x.f, score: x.s, hits: x.hits }));
}
export function systemPrompt(mode, facts) {
  return [
    'You are the assistant on a concept homepage for NobleServe, a US mortgage services company (founded 2017; teams in Pittsburgh, Bangalore and Coimbatore). The concept was made by pulplabs.ai and is not NobleServe\'s official website.',
    mode === 'products' ? 'The visitor asked about NobleServe\'s products: CloseVille, PCR and NobleDox.' : mode === 'services' ? 'The visitor asked about NobleServe\'s services across the mortgage journey.' : 'The visitor may ask about anything on the page.',
    'Rules: answer ONLY from the FACTS below. If the facts do not cover the question, say you do not have that and suggest writing to info@nobleserve.com.',
    'Never state or imply prices, savings or ROI, turnaround times or speeds, accuracy rates, service-level guarantees, capacity or volumes beyond the facts, headcount, client or underwriter names, certifications or compliance status, licensing or insurance, data storage, security or how client files are used to train AI, the AI models used, state or county coverage, or integrations other than CloseVille\'s two-way sync with Qualia. Never invent numbers. Never say NobleServe is a lender, title insurer or title company; it is a services company that works for lenders, title agents and servicers.',
    'Speak about NobleServe in the third person. Earlier assistant messages are conversation only, not facts: never repeat a claim from them that the FACTS do not support.',
    'Style: plain US English, short (under 120 words), friendly and direct, bullets for lists, no em dashes, no source line (the page shows sources).',
    'FACTS:', ...facts.map((f, i) => `[${i + 1}] ${f.a} (source: ${f.src})`)
  ].join('\n');
}
