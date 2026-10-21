/*
  Starting content for the site of PS Mary Muthoni Muriuki, CBS, HSC.
  Sources: her executive CV, the Ministry of Health, World Health Summit and
  CPHIA 2024 speaker pages, Kukha speaker page, and the news articles linked
  on each story. Anything in [square brackets] is a placeholder to replace in /admin.
  Once Firebase is connected, the dashboard takes over and this file is only
  the fallback for fields that have never been saved.
*/
import site from "../../site.config.js";

export const DEFAULT_SETTINGS = {
  name: site.name,
  postNominals: site.postNominals,
  honorific: "PS",
  role: site.role,
  agency: site.agency,
  ministry: "Ministry of Health",
  alsoServing: "Chairperson, African Permanent and Principal Secretaries for Health",
  basedIn: "Nairobi, Kenya",
  inServiceSince: "2022",
  theme: { ...site.theme },
  intro:
    "Leading Kenya’s public health and professional standards agenda, from Community Health Promoters at the household door to health cooperation across Africa.",
  heroImage: "",
  introVideo: { title: "", url: "", caption: "" },
  stats: [
    { value: "2", label: "State Departments led as Principal Secretary" },
    { value: "1st", label: "Woman elected KNCCI Director since 1965" },
    { value: "3", label: "Global conferences in Nairobi where she coordinated the private sector" },
    { value: "CBS", label: "Chief of the Order of the Burning Spear, 2022" },
  ],
  profileHeading: "A career in service, told through results.",
  profileSummary:
    "Principal Secretary for Public Health and Professional Standards and Chairperson of the African Permanent and Principal Secretaries for Health, with a career that runs from the classroom through enterprise and trade diplomacy to two State Departments.",
  bio: [
    "Mary Muthoni Muriuki began her working life in the classroom, spending ten years teaching and mentoring learners at Moi High School, Mbiruri and Moi Girls School, Nairobi. She went on to found St. Petroc Premier Schools in Embu and to build national platforms for women in enterprise as President and CEO of the Women in Business Community Network and founder of the Women in Business Magazine and Awards.",
    "In trade and investment she became the first woman elected Director of the Kenya National Chamber of Commerce and Industry since its founding in 1965, chairing its work on economic empowerment for women and youth. She coordinated private sector participation at three global meetings hosted in Nairobi: the WTO Tenth Ministerial Conference, UNCTAD 14 and the Second High-Level Meeting of the Global Partnership for Effective Development Co-operation.",
    "Appointed Principal Secretary for Correctional Services in December 2022, she led the “One Bed, One Mattress” initiative to restore dignity and health standards in correctional facilities. She now leads the State Department for Public Health and Professional Standards, steering the rollout of Community Health Promoters as the foundation of primary health care under Universal Health Coverage. In May 2026 she was elected Chairperson of the African Permanent and Principal Secretaries for Health.",
  ],
  education: [
    { year: "Ongoing", what: "PhD in Development Studies", where: "Mount Kenya University" },
    { year: "", what: "Master of Business Administration (Management and Marketing)", where: "University of Eastern Africa, Baraton" },
    { year: "", what: "Bachelor of Education (English Language and Literature)", where: "Catholic University of Eastern Africa" },
    { year: "", what: "Diploma in Humanities", where: "Kagumo College" },
    { year: "2017", what: "Women in Trade Programme", where: "Colombo, Sri Lanka" },
    { year: "", what: "EMPRETEC Entrepreneurship and Leadership Programme", where: "UNCTAD" },
  ],
  focus: [
    { title: "Health systems and Universal Health Coverage", text: "Community health, primary health care, public health standards and the professional regulation of health workers." },
    { title: "Correctional reform and human dignity", text: "Living conditions, welfare and rehabilitation of persons in custody, and a corrective approach to the justice chain." },
    { title: "Trade, gender and enterprise", text: "Women’s economic empowerment, access to government procurement, investment promotion and trade policy dialogue." },
    { title: "Multilateral and health diplomacy", text: "Continental cooperation on health security and financing, and Kenya’s voice at the WTO, UNCTAD and IORA." },
  ],
  memberships: [
    { body: "Kenya Private Sector Alliance (KEPSA)", detail: "Member" },
    { body: "Women in Business Community Network", detail: "President and Chief Executive Officer" },
    { body: "Women in Healthcare Kenya Caucus", detail: "Launched July 2026" },
  ],
  quote: "Deeply honoured by the trust placed in me.",
  quoteBy: "On her election as Chairperson of the African Permanent and Principal Secretaries for Health, May 2026",
  projectsIntro:
    "Programmes she has led or shaped across public health, correctional services, trade and women’s enterprise, from 2015 to today.",
  contact: {
    address: "State Department for Public Health and Professional Standards, Afya House, Cathedral Road, Nairobi",
    email: "",
    phone: "",
    hours: "Monday to Friday, 8.00 am to 5.00 pm",
    mediaNote: "Media, partnership and speaking requests are answered by the office.",
  },
  socials: {
    x: "https://x.com/psmuthoni",
    facebook: "https://www.facebook.com/muthonikenya/",
    instagram: "https://www.instagram.com/muthonike/",
    linkedin: "https://ke.linkedin.com/in/mary-muthoni-cbs-hsc-2bb94917",
    youtube: "",
  },
};

export const SECTORS = ["Public health", "Correctional services", "Trade and investment", "Women and enterprise", "Health diplomacy", "Education"];
export const STATUSES = ["Ongoing", "Completed", "Launched"];
export const POSITION_KINDS = ["Public office", "Boards and committees", "Institutional leadership", "Earlier career"];
export const NEWS_CATEGORIES = ["Public health", "Appointments", "Health diplomacy", "Correctional services", "Speeches", "Statements"];
export const EVENT_TYPES = ["Conference", "Site visit", "Launch", "Meeting", "Speech"];
export const ALBUMS = ["Public health", "Field visits", "Conferences", "Ceremonies"];

/* ---------- Projects ---------- */
export const SAMPLE_PROJECTS = [
  {
    slug: "community-health-promoters",
    title: "Community Health Promoters: UHC from the household up",
    sector: "Public health",
    year: "2023 – present",
    place: "National, with county governments",
    status: "Ongoing",
    featured: true,
    budget: "",
    summary: "National deployment of Community Health Promoters (CHPs) to take essential health services to households, linked to health facilities as the entry point of primary health care.",
    body: "As Principal Secretary for Public Health and Professional Standards, she provides strategic leadership for community-centred Universal Health Coverage, overseeing the national deployment of Community Health Promoters to take essential services to households and grassroots communities.\n\nThe programme links community health services with health facilities across the counties, so that primary health care becomes the entry point of the health system. It is delivered with county governments, development partners, faith-based organisations and civil society.\n\nCHP stipends are paid with county governments after both levels of government verify the lists, and each promoter’s activity is tracked through the electronic device issued to them.",
    outcomes: [
      { value: "116,767", label: "Households registered by CHPs in Nandi County (June 2024)" },
      { value: "440,419", label: "People covered in Nandi County" },
      { value: "24,500", label: "People screened for diabetes in Nandi" },
    ],
    image: "",
    videoUrl: "",
  },
  {
    slug: "one-bed-one-mattress",
    title: "One Bed, One Mattress",
    sector: "Correctional services",
    year: "2023",
    place: "Correctional facilities nationwide",
    status: "Launched",
    featured: true,
    budget: "",
    summary: "A nationwide campaign to give every person in custody a bed and a mattress, restoring dignity and health standards as the foundation of rehabilitation.",
    body: "As Principal Secretary for Correctional Services she conceived and led the “one prisoner, one bed, one mattress” campaign. Existing resources were redirected to the goal, prison workshops were empowered to make beds, and partners were invited to close the gap.\n\nShe argued that a suitable environment speeds up reform, and that the mandate of the department is to correct the individual to become a productive, law-abiding citizen.\n\nAlongside the campaign she called for a review of sentences for mothers held in custody with their children, noting that more than 300 children were living in prison facilities.",
    outcomes: [
      { value: "60,000", label: "Beds and mattresses sought for the campaign" },
      { value: "1,000", label: "Mattresses received by March 2023" },
      { value: "300+", label: "Children in prisons whose mothers’ cases she asked to review" },
    ],
    image: "",
    videoUrl: "",
  },
  {
    slug: "african-health-secretaries",
    title: "Continental health cooperation",
    sector: "Health diplomacy",
    year: "2026 – present",
    place: "Africa",
    status: "Ongoing",
    featured: true,
    budget: "",
    summary: "As Chairperson of the African Permanent and Principal Secretaries for Health, she leads peer learning and cooperation on health security, financing and Universal Health Coverage.",
    body: "She was elected Chairperson of the African Permanent and Principal Secretaries for Health at a high-level consultative meeting on cross-border collaboration for health security held in Brazzaville in May 2026.\n\nThe forum brings together the chief administrative and accounting officers of health ministries across the continent. Under her chairmanship it promotes the sharing of best practice on Universal Health Coverage, health financing, disease surveillance and health systems strengthening.\n\nShe has said the role elevates Kenya’s place in shaping continental health priorities and gives the country access to shared expertise and best practice.",
    outcomes: [],
    image: "",
    videoUrl: "",
  },
  {
    slug: "women-in-healthcare-caucus",
    title: "Women in Healthcare Kenya Caucus",
    sector: "Public health",
    year: "2026",
    place: "Nairobi",
    status: "Launched",
    featured: true,
    budget: "",
    summary: "A platform for women in the health workforce to connect, find mentors and move into leadership, launched with a call to apply for government-funded training.",
    body: "In July 2026 she launched the Women in Healthcare Kenya Caucus in Nairobi, co-hosting the launch dinner with Dr Jacqueline Kitulu, President of the World Medical Association, under the theme “Connect. Share. Grow.”\n\nShe urged women across the health workforce, from Community Health Promoters to nurses and doctors, to apply for government-funded advanced training, noting that most applications for these scholarships were coming from men.",
    outcomes: [],
    image: "",
    videoUrl: "",
  },
  {
    slug: "wto-mc10-private-sector",
    title: "Private sector at the WTO Tenth Ministerial Conference",
    sector: "Trade and investment",
    year: "2015",
    place: "Nairobi",
    status: "Completed",
    featured: false,
    budget: "",
    summary: "Coordinated private sector participation at MC10, the first WTO Ministerial Conference held in Africa.",
    body: "She coordinated private sector participation at the WTO Tenth Ministerial Conference in Nairobi, the first WTO Ministerial Conference hosted in Africa.\n\nThe Conference adopted the “Nairobi Package”, a set of six Ministerial Decisions on agriculture, cotton and issues relating to Least Developed Countries.",
    outcomes: [{ value: "6", label: "Ministerial Decisions in the Nairobi Package" }],
    image: "",
    videoUrl: "",
  },
  {
    slug: "unctad14-and-hlm2",
    title: "UNCTAD 14 and the Global Partnership HLM2",
    sector: "Trade and investment",
    year: "2016",
    place: "Nairobi",
    status: "Completed",
    featured: false,
    budget: "",
    summary: "Coordinated private sector engagement at two global meetings hosted by Kenya in 2016.",
    body: "She coordinated private sector participation at the Fourteenth United Nations Conference on Trade and Development (UNCTAD 14), held in Nairobi from 17 to 22 July 2016 under the theme “From Decision to Action”.\n\nLater that year she coordinated private sector engagement at the Second High-Level Meeting of the Global Partnership for Effective Development Co-operation (HLM2), Nairobi, 28 November to 1 December 2016, under the theme “Towards Inclusive and Accelerated Implementation of the 2030 Agenda”.",
    outcomes: [],
    image: "",
    videoUrl: "",
  },
  {
    slug: "women-in-business-network",
    title: "Women in Business Community Network",
    sector: "Women and enterprise",
    year: "",
    place: "National",
    status: "Ongoing",
    featured: false,
    budget: "",
    summary: "A national network promoting women in commerce and industry, with the Women in Business Magazine and Awards.",
    body: "As President and Chief Executive Officer she leads a national network promoting, coordinating and engaging women in commerce and industry.\n\nThe Network works through five pillars: mentorship and capacity building; financial inclusion; market linkages and partnerships; networking, events and awards; and policy and advocacy. She founded the Women in Business Magazine and Awards to recognise women’s leadership in enterprise.",
    outcomes: [{ value: "5", label: "Programme pillars" }],
    image: "",
    videoUrl: "",
  },
  {
    slug: "agpo-gender-responsive-delivery",
    title: "Access to Government Procurement Opportunities for women",
    sector: "Women and enterprise",
    year: "2017",
    place: "Counties",
    status: "Completed",
    featured: false,
    budget: "",
    summary: "Championed women’s access to public procurement (AGPO) and gender-responsive service delivery, recognised by the Council of Governors.",
    body: "She championed Access to Government Procurement Opportunities (AGPO) and women’s empowerment in public service delivery.\n\nThe work earned her the Devolution Warrior Award from the Council of Governors in March 2017, in the Gender Responsive Delivery category.",
    outcomes: [],
    image: "",
    videoUrl: "",
  },
  {
    slug: "covid-19-sanitiser-drive",
    title: "COVID-19 market sanitiser drive",
    sector: "Women and enterprise",
    year: "COVID-19",
    place: "Low-income markets",
    status: "Completed",
    featured: false,
    budget: "",
    summary: "Mobilised businesswomen to distribute sanitisers to markets, matatu and boda boda operators during COVID-19.",
    body: "She mobilised businesswomen to distribute sanitisers to low-income markets and to matatu and boda boda operators, so that these high-contact groups would not become active spreaders of COVID-19.\n\nThe effort was recognised by H.E. the President with the Uzalendo Award.",
    outcomes: [],
    image: "",
    videoUrl: "",
  },
].map((p, i) => ({ ...p, id: `p-${p.slug}`, order: i }));

/* ---------- Positions ---------- */
export const SAMPLE_POSITIONS = [
  { kind: "Public office", title: "Principal Secretary", org: "State Department for Public Health and Professional Standards, Ministry of Health", years: "2023 – present", current: true,
    mandate: "Administrative head and Accounting Officer for public health policy, preventive and promotive health, disease control and the standards and regulation of health professionals.",
    highlights: ["Leads the national rollout of Community Health Promoters under Universal Health Coverage", "Coordinates devolved health functions with the Council of Governors and county health departments", "Chairs the Health Sector MTEF Budget Working Groups", "Chairs the Kenya Coordinating Mechanism for the Global Fund grant"] },
  { kind: "Public office", title: "Chairperson", org: "African Permanent and Principal Secretaries for Health", years: "May 2026 – present", current: true,
    mandate: "Leads continental dialogue, peer learning and collaboration among senior health officials.",
    highlights: ["Elected in Brazzaville at a high-level meeting on cross-border collaboration for health security"] },
  { kind: "Public office", title: "Deputy Dean, then Dean, of Principal Secretaries", org: "Government of Kenya", years: "To 2025", current: false, mandate: "", highlights: [] },
  { kind: "Public office", title: "Principal Secretary", org: "State Department for Correctional Services, Ministry of Interior and National Administration", years: "Dec 2022 – 2023", current: false,
    mandate: "Administrative head and Accounting Officer for the Kenya Prisons Service and the Probation and Aftercare Service.",
    highlights: ["Conceived and led the “One Bed, One Mattress” initiative", "Modernised the management of correctional services", "Promoted rehabilitation and reintegration of offenders"] },
  { kind: "Boards and committees", title: "Vice Chairperson", org: "Kirinyaga Investment and Development Authority", years: "", current: false,
    mandate: "Promotes and coordinates investment in commercial and industrial ventures to drive county growth and jobs.", highlights: [] },
  { kind: "Boards and committees", title: "Board Member (private sector)", org: "Tobacco Control Board, Ministry of Health", years: "", current: false,
    mandate: "Advised the Cabinet Secretary for Health on national tobacco control policy.", highlights: [] },
  { kind: "Boards and committees", title: "National Director (Women and Gender)", org: "Kenya National Chamber of Commerce and Industry", years: "2018", current: false,
    mandate: "First woman elected Director since 1965; represented the Central region and chaired Economic Empowerment for Women and Youth.", highlights: ["Best Performing Director, 2017"] },
  { kind: "Boards and committees", title: "Board Member", org: "Moi High School, Mbiruri", years: "2019", current: false, mandate: "", highlights: [] },
  { kind: "Boards and committees", title: "Board Member", org: "Kabare Girls High School", years: "3 years", current: false, mandate: "", highlights: [] },
  { kind: "Institutional leadership", title: "President and Chief Executive Officer", org: "Women in Business Community Network", years: "", current: false,
    mandate: "Leads a national network for women in commerce and industry; founder of the Women in Business Magazine and Awards.", highlights: [] },
  { kind: "Institutional leadership", title: "Founder and Chairperson", org: "St. Petroc Premier Schools, Embu", years: "", current: false, mandate: "", highlights: [] },
  { kind: "Institutional leadership", title: "Head of Programme, Kenya", org: "British Council Schools Programme", years: "", current: false,
    mandate: "Represented Sub-Saharan Africa in Cornwall, United Kingdom, alongside the Kenyan music group Sauti Sol.", highlights: [] },
  { kind: "Earlier career", title: "Teacher and trainer", org: "Moi High School, Mbiruri and Moi Girls School, Nairobi", years: "10 years", current: false, mandate: "", highlights: [] },
].map((p, i) => ({ ...p, id: `pos-${i}`, order: i }));

/* ---------- Awards ---------- */
export const SAMPLE_AWARDS = [
  ["2026", "Instinct Women’s Award", "", ""],
  ["2025", "SDGs Award, Winner", "", ""],
  ["2022", "Chief of the Order of the Burning Spear (CBS)", "H.E. the President", "For outstanding contribution to national priorities, including the rollout of Universal Health Coverage and correctional service reforms."],
  ["2021", "Head of State Commendation (HSC)", "H.E. the President", "For distinguished community service."],
  ["COVID-19", "Uzalendo Award", "H.E. the President", "For mobilising businesswomen to distribute sanitisers to markets, matatu and boda boda operators during COVID-19."],
  ["2019", "Regional Winner, East Africa", "Pan African Awards (CEO Global)", "After winning the country award, Business and Professional Sector, Most Influential Women in Business and Government."],
  ["2019", "African Women Impact Award", "International College of Peace", ""],
  ["2018", "Africa Business Leaders Award (Gender)", "", ""],
  ["2017", "Devolution Warrior Award", "Council of Governors", "Gender Responsive Delivery category, for promoting women’s empowerment in public service delivery and championing AGPO."],
  ["2017", "Best Performing Director", "Kenya National Chamber of Commerce and Industry", ""],
  ["2017", "Among the six most influential women in Kenya", "", ""],
  ["2008", "Patron of the Year", "Research Club Kenya Chapter (Ipsos/Synovate)", ""],
  ["", "Diligent Service Award", "Student Leadership Council (SRC)", ""],
].map(([year, name, body, citation], i) => ({ id: `aw-${i}`, year, name, body, citation, image: "", order: i }));

/* ---------- News ---------- */
export const SAMPLE_NEWS = [
  {
    slug: "kenya-has-no-ebola-outbreak",
    title: "Kenya has no Ebola outbreak as surveillance intensifies, says PS Muthoni",
    category: "Public health", date: "2026-10-11",
    summary: "The Principal Secretary assured Kenyans that the country has not recorded an Ebola outbreak and that disease surveillance has been stepped up.",
    body: "Principal Secretary Mary Muthoni assured Kenyans that the country has not recorded an Ebola outbreak, and said health authorities have intensified disease surveillance.\n\nThe Ministry of Health continues to urge the public to report recent travel to affected areas and to keep up hand-washing and other preventive measures.",
    sourceName: "People Daily", sourceUrl: "https://peopledaily.digital/news/ps-muthoni-says-kenya-has-no-ebola-outbreak-as-surveillance-intensifies",
    relatedProjects: [], relatedNews: [], relatedLinks: [], image: "", videoUrl: "",
  },
  {
    slug: "women-in-healthcare-caucus-launched",
    title: "PS Muthoni launches the Women in Healthcare Kenya Caucus",
    category: "Public health", date: "2026-07-04",
    summary: "Women in the health workforce were urged to apply for government-funded training, as most scholarship applications were coming from men.",
    body: "Public Health Principal Secretary Mary Muthoni launched the Women in Healthcare Kenya Caucus in Nairobi, a platform for women in the sector to connect, share experiences and advance into leadership.\n\nShe urged women across the workforce, from Community Health Promoters to nurses and doctors, to apply for government-funded advanced training, noting that the scholarship lists reaching her were almost entirely male. She also encouraged women in health care to look after their own mental health and wellbeing.\n\nThe launch dinner, themed “Connect. Share. Grow.”, was co-hosted with Dr Jacqueline Kitulu, President of the World Medical Association.",
    sourceName: "Capital FM", sourceUrl: "https://capitalfm.africa/ps-muthoni-launches-women-in-healthcare-caucus-calls-on-female-health-workers-to-upskill-through-government-funded-training/",
    relatedProjects: ["women-in-healthcare-caucus"], relatedNews: [], relatedLinks: [], image: "", videoUrl: "",
  },
  {
    slug: "elected-chair-african-health-secretaries",
    title: "PS Muthoni elected Chairperson of the African Permanent and Principal Secretaries for Health",
    category: "Appointments", date: "2026-05-06",
    summary: "Elected in Brazzaville at a high-level consultative meeting on cross-border collaboration for health security.",
    body: "Public Health and Professional Standards Principal Secretary Mary Muthoni was elected Chairperson of the African Permanent and Principal Secretaries for Health at a high-level consultative meeting on cross-border collaboration for health security in Brazzaville.\n\nShe described the role as a collective mandate for deeper cooperation and said she was deeply honoured by the trust placed in her. The position, she said, will strengthen regional collaboration, improve coordination of disease surveillance and response, and elevate Kenya’s role in shaping continental health priorities.",
    sourceName: "Ministry of Health", sourceUrl: "https://www.health.go.ke/ps-muthoni-elected-chairperson-african-permanent-and-principal-secretaries-health",
    relatedProjects: ["african-health-secretaries"], relatedNews: [],
    relatedLinks: [{ label: "The Star: Kenya takes continental health leadership", url: "https://www.the-star.co.ke/news/2026-05-06-ps-muthoni-elected-to-africas-top-health-role" }],
    image: "", videoUrl: "",
  },
  {
    slug: "nandi-chp-programme-review",
    title: "PS Muthoni in Nandi to assess the Community Health Promoters programme",
    category: "Public health", date: "2024-06-19",
    summary: "CHPs in Nandi had registered more than 116,000 households and screened thousands for diabetes and hypertension.",
    body: "The Principal Secretary visited Nandi County to review progress of the Community Health Promoters programme. CHPs had registered 116,767 households covering 440,419 people.\n\nThey had screened 24,500 people for diabetes, referring 397 for further management, and 16,900 for hypertension, referring 1,110. At the time of the visit 279 CHPs were in a ten-day training course in Kilibwoni Ward.\n\nThe PS said the aim is a robust network of well-trained health workers able to serve every community.",
    sourceName: "County Government of Nandi", sourceUrl: "https://nandi.go.ke/news/ps-muthoni-in-nandi-to-assess-chp-program/",
    relatedProjects: ["community-health-promoters"], relatedNews: [], relatedLinks: [], image: "", videoUrl: "",
  },
  {
    slug: "prisons-upgrade-one-bed-one-mattress",
    title: "Government plans to upgrade prison facilities under “One Bed, One Mattress”",
    category: "Correctional services", date: "2023-03-13",
    summary: "At a meeting with prison directors and regional commanders, the PS set out a nationwide upgrade and called for a review of sentences for mothers held with their children.",
    body: "Speaking at a consultative meeting with prison directors and regional commanders, Correctional Services PS Mary Muthoni set out a nationwide upgrade of prison facilities under the “one prisoner, one bed, one mattress” programme.\n\nExisting resources would be redirected to the goal, alongside strategic partnerships. She said a suitable environment speeds up reform, and called for a review of sentences for mothers remanded with their children, noting more than 300 children in prison facilities.",
    sourceName: "The Star", sourceUrl: "https://www.the-star.co.ke/news/2023-03-13-government-plans-to-upgrade-prisons-facilities",
    relatedProjects: ["one-bed-one-mattress"], relatedNews: ["correctional-services-seeks-60000-beds"], relatedLinks: [], image: "", videoUrl: "",
  },
  {
    slug: "correctional-services-seeks-60000-beds",
    title: "Correctional Services seeks 60,000 beds and mattresses for inmates",
    category: "Correctional services", date: "2023-03-08",
    summary: "The State Department appealed for support to give every prisoner a bed and mattress; 1,000 mattresses had been received.",
    body: "The State Department for Correctional Services appealed for 60,000 beds and mattresses for a nationwide “one prisoner, one bed, one mattress” campaign. By then 1,000 mattresses had been received, and prison workshops were to be empowered to make beds.\n\nPS Muthoni said the campaign marks a shift towards reforming inmates, and urged the Judiciary to speed up cases involving women imprisoned with their children.",
    sourceName: "Capital FM", sourceUrl: "https://capitalfm.africa/correctional-department-seeks-60000-beds-to-relieve-suffering-inmates/",
    relatedProjects: ["one-bed-one-mattress"], relatedNews: ["prisons-upgrade-one-bed-one-mattress"], relatedLinks: [], image: "", videoUrl: "",
  },
].map((n, i) => ({ ...n, id: `n-${n.slug}`, order: i }));

/* ---------- Events ---------- */
export const SAMPLE_EVENTS = [
  {
    title: "World Health Summit 2026: Shaping the Global Health Architecture and Ending Diseases of Poverty",
    type: "Conference", role: "Speaker, Workshop WS 06",
    date: "2026-10-11", endDate: "", time: "16:00 – 17:30",
    venue: "Hotel InterContinental Berlin, Forum 2", town: "Berlin, Germany",
    summary: "World Health Summit 2026, “From Crisis to Resilience: Innovating for Health”, 11 to 13 October.",
    url: "https://www.worldhealthsummit.org/speaker/mary-muthoni-muriuki",
  },
  {
    title: "3rd International Conference on Public Health in Africa (CPHIA 2024)",
    type: "Conference", role: "Committee member",
    date: "2024-10-22", endDate: "2024-10-25", time: "",
    venue: "", town: "Harare, Zimbabwe",
    summary: "Served on the CPHIA 2024 committee as Principal Secretary for Public Health and Professional Standards.",
    url: "https://cphia2024.com/committee-member/mary-muthoni-muriuki/",
  },
].map((e, i) => ({ ...e, id: `ev-${i}` }));

/* ---------- Gallery ---------- */
export const SAMPLE_GALLERY = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `g-${i}`, kind: "photo", image: "", videoUrl: "", caption: "[Photo caption: event, place, date]", album: ALBUMS[i % ALBUMS.length], order: i,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `gv-${i}`, kind: "video", image: "", videoUrl: "", caption: "[Video title]", album: ["Speeches", "Interviews", "Field visits"][i], order: 8 + i,
  })),
];
