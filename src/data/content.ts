/* ----------------------------------------------------------------------------
   Content + i18n for avocloud.net.
   Default render language is EN (ships in the static HTML for SEO); the client
   toggles to DE. Keep both languages at parity (BRANDING.md, Voice).
   -------------------------------------------------------------------------- */

export type Lang = 'en' | 'de';

export const messages: Record<Lang, Record<string, string>> = {
  en: {
    'hero.eyebrow': 'Software · Austria',
    'hero.claim': 'Software for communities, events and education',
    'about.label': 'ABOUT',
    'about.heading': 'Software, built in Austria.',
    'about.intro':
      'Avocloud.net develops and operates software from Wels, Austria: moderation for Discord communities, ticketing for events and grade management for teachers.',
    'about.body2':
      'We write the code, run the infrastructure and look after every product after launch. Alongside our own products we build websites and web applications, for example for a parish theater group that sells its tickets through our system.',
    'about.build.heading': 'Built and run by us',
    'about.build.body':
      'Our own code on our own infrastructure. No resold platform behind the product, and one team to talk to when something needs fixing.',
    'about.privacy.heading': 'Privacy by default',
    'about.privacy.body':
      'Products store only what a feature needs. Grade data in EduGrade is encrypted with AES-256-GCM, and our own sites run no tracking.',
    'about.fact.seat': 'Based in',
    'about.fact.since': 'Since',
    'about.fact.products': 'Products',
    'about.fact.tracking': 'Tracking',
    'about.fact.none': 'None',
    'mission.p1.h': 'Written in-house',
    'mission.p1.b': 'Our own code, written by one team.',
    'mission.p2.h': 'Run on our servers',
    'mission.p2.b': 'Our own infrastructure, no resold platform behind it.',
    'mission.p3.h': 'Maintained after launch',
    'mission.p3.b': 'We look after every product once it is live.',
    'mission.label': 'MISSION',
    'mission.big':
      'Software that <span class="mark">just runs</span>. <span class="coral">Built and maintained in Austria.</span>',
    'projects.label': 'PRODUCTS',
    'projects.heading': 'Our Products',
    'projects.lede': 'Everything here is built and run by us. Scroll through, one product at a time.',
    'projects.open': 'Learn more',
    'projects.features': 'Features',
    'projects.facts': 'Facts',
    'baxi.desc': 'A verified Discord bot with an intelligent chat filter, a global spammer database, and a web dashboard.',
    'craftattack.desc':
      'Our community Minecraft server. Season 2: The Ashes of Aerlon. Java and Bedrock crossplay, clans, jobs, BlueMap. Free to join, no application form.',
    'discordgate.desc': 'A Minecraft plugin that requires Discord account linking before players can join. Works with Baxi, Bedrock and Velocity.',
    'qrgate.desc':
      'Event ticketing with a built-in shop, PayPal payment, automatic email delivery and QR code check-in.',
    'edugrade.desc':
      'A web app for teachers to manage classes, grades and attendance, with AES-256-GCM encryption and built-in analytics.',
    'helene.desc':
      'Client project. Website and ticketing for the parish theater group in Sattledt, Austria. We built and maintain the site and run QrGate as their ticketing and shop system.',
    'avolink.desc':
      'A link shortener and Linktree alternative. Short, custom links and all your profiles in one place.',
    'collab.label': 'COLLABORATIONS',
    'collab.heading': 'Our Collaborations',
    'cee.desc': 'Twitch streamer we work with — family-friendly streams and the community around them.',
    'support.label': 'SUPPORT US',
    'support.heading': 'Buy Us A Coffee',
    'support.body':
      'Everything we run costs server time. If our tools are useful to you, a coffee helps keep them online.',
    'finale.label': 'Final scene',
    'finale.1': 'We write the code.',
    'finale.2': 'We run the servers.',
    'finale.3': 'We keep it running.',
    'finale.sub': 'Software from Wels, Austria',
    'finale.est': 'Est.',
    'contact.label': 'CONTACT',
    'contact.heading': 'Get In Touch',
    'contact.mail.text': 'Questions, offers, support:',
    'contact.discord.text': 'Community and quick answers:',
    'contact.legal.text': 'Legal information:',
    'stat.products': 'Products',
    'stat.based': 'Based in',
    'stat.founded': 'Founded',
  },
  de: {
    'hero.eyebrow': 'Software · Österreich',
    'hero.claim': 'Software für Communities, Events und Bildung',
    'about.label': 'ÜBER UNS',
    'about.heading': 'Software aus Österreich.',
    'about.intro':
      'Avocloud.net entwickelt und betreibt Software aus Wels, Österreich: Moderation für Discord-Communities, Ticketing für Veranstaltungen und Notenverwaltung für Lehrkräfte.',
    'about.body2':
      'Wir schreiben den Code, betreiben die Infrastruktur und betreuen jedes Produkt nach dem Start. Neben den eigenen Produkten entwickeln wir Websites und Webanwendungen, zum Beispiel für eine Pfarrtheatergruppe, die ihre Tickets über unser System verkauft.',
    'about.build.heading': 'Von uns gebaut und betrieben',
    'about.build.body':
      'Eigener Code auf eigener Infrastruktur. Keine zugekaufte Plattform hinter dem Produkt, und ein Ansprechpartner, wenn etwas repariert werden muss.',
    'about.privacy.heading': 'Datenschutz als Standard',
    'about.privacy.body':
      'Unsere Produkte speichern nur, was eine Funktion braucht. Notendaten in EduGrade sind mit AES-256-GCM verschlüsselt, und auf unseren eigenen Seiten läuft kein Tracking.',
    'about.fact.seat': 'Sitz',
    'about.fact.since': 'Seit',
    'about.fact.products': 'Produkte',
    'about.fact.tracking': 'Tracking',
    'about.fact.none': 'Keines',
    'mission.p1.h': 'Selbst geschrieben',
    'mission.p1.b': 'Eigener Code, geschrieben von einem Team.',
    'mission.p2.h': 'Auf eigenen Servern',
    'mission.p2.b': 'Eigene Infrastruktur, keine zugekaufte Plattform dahinter.',
    'mission.p3.h': 'Betreut nach dem Start',
    'mission.p3.b': 'Wir kümmern uns um jedes Produkt, sobald es live ist.',
    'mission.label': 'MISSION',
    'mission.big':
      'Software, die <span class="mark">einfach läuft</span>. <span class="coral">Gebaut und betreut in Österreich.</span>',
    'projects.label': 'PRODUKTE',
    'projects.heading': 'Unsere Produkte',
    'projects.lede': 'Alles hier ist von uns gebaut und betrieben. Scroll dich durch, ein Produkt nach dem anderen.',
    'projects.open': 'Mehr erfahren',
    'projects.features': 'Funktionen',
    'projects.facts': 'Fakten',
    'baxi.desc': 'Ein verifizierter Discord-Bot mit intelligentem Chat-Filter, globaler Spammer-Datenbank und Web-Dashboard.',
    'craftattack.desc':
      'Unser Community-Minecraft-Server. Season 2: Die Asche von Aerlon. Java und Bedrock Crossplay, Clans, Jobs, BlueMap. Kostenlos beitreten, kein Bewerbungsformular.',
    'discordgate.desc': 'Ein Minecraft-Plugin, das vor dem Beitritt eine Verknüpfung mit Discord verlangt. Funktioniert mit Baxi, Bedrock und Velocity.',
    'qrgate.desc':
      'Ticketing für Veranstaltungen mit integriertem Shop, PayPal-Zahlung, automatischem E-Mail-Versand und QR-Code-Check-in.',
    'edugrade.desc':
      'Eine Web-App für Lehrkräfte zur Verwaltung von Klassen, Noten und Anwesenheit, AES-256-GCM-verschlüsselt und mit integrierter Analyse.',
    'helene.desc':
      'Kundenprojekt. Website und Ticketing für die Pfarrtheatergruppe in Sattledt, Österreich. Wir haben die Seite erstellt, betreuen sie und betreiben QrGate als Ticketing- und Shop-System.',
    'avolink.desc':
      'Ein Link-Shortener und Linktree-Alternative. Kurze, individuelle Links und alle Profile an einem Ort.',
    'collab.label': 'KOOPERATIONEN',
    'collab.heading': 'Unsere Kooperationen',
    'cee.desc': 'Twitch-Streamer, mit dem wir zusammenarbeiten — familienfreundliche Streams und die Community drumherum.',
    'support.label': 'UNTERSTÜTZE UNS',
    'support.heading': 'Spendier uns einen Kaffee',
    'support.body':
      'Alles, was wir betreiben, kostet Serverzeit. Wenn dir unsere Tools etwas bringen, hält ein Kaffee sie online.',
    'finale.label': 'Schlussszene',
    'finale.1': 'Wir schreiben den Code.',
    'finale.2': 'Wir betreiben die Server.',
    'finale.3': 'Wir bleiben dran.',
    'finale.sub': 'Software aus Wels, Österreich',
    'finale.est': 'Seit',
    'contact.label': 'KONTAKT',
    'contact.heading': 'Kontakt aufnehmen',
    'contact.mail.text': 'Fragen, Anfragen, Support:',
    'contact.discord.text': 'Community und schnelle Antworten:',
    'contact.legal.text': 'Rechtliche Informationen:',
    'stat.products': 'Produkte',
    'stat.based': 'Sitz',
    'stat.founded': 'Gegründet',
  },
};

export const seo: Record<Lang, { title: string; description: string }> = {
  en: {
    title: 'Avocloud.net | Software from Austria',
    description:
      'Avocloud.net develops software in Wels, Austria. Discord moderation (Baxi), event ticketing (QrGate), grade management (EduGrade) and web development.',
  },
  de: {
    title: 'Avocloud.net | Software aus Österreich',
    description:
      'Avocloud.net entwickelt Software in Wels, Österreich. Discord-Moderation (Baxi), Ticketing (QrGate), Notenverwaltung (EduGrade) und Webentwicklung.',
  },
};

export type Chip = { label: string; href?: string };
export type IconKey =
  | 'cube' | 'chat' | 'shield' | 'server' | 'qr'
  | 'globe' | 'layers' | 'cap' | 'ticket' | 'link';

/* The pixel texture behind each fullscreen project card — the hero's dither,
   with its own shape and tint per product so the stack reads as six scenes,
   not one background repeated. Tints stay dark and desaturated (BRANDING.md
   §6: texture, not a colour field); coral remains the only loud colour. */
export type ProjectTone = {
  shape: 'simplex' | 'warp' | 'dots' | 'wave' | 'ripple' | 'swirl' | 'sphere';
  color: string;
};

export type Project = {
  num: string;
  name: string;
  icon: IconKey;
  descKey: string;
  descHtml?: boolean;
  chips: Chip[];
  ghost: string;
  tone: ProjectTone;
};

export const projects: Project[] = [
  {
    num: '01', name: 'Baxi', icon: 'chat', descKey: 'baxi.desc', ghost: 'BAXI',
    tone: { shape: 'swirl', color: '#4a4e8e' },
    chips: [
      { label: 'Discord' }, { label: 'Moderation' }, { label: 'Security' },
      { label: 'Dashboard ↗', href: 'https://baxi.avocloud.net/' },
      { label: 'Invite ↗', href: '/baxi/invite/' },
      { label: 'About ↗', href: '/baxi/' },
    ],
  },
  {
    num: '02', name: 'QrGate', icon: 'qr', descKey: 'qrgate.desc', ghost: 'QRGATE',
    tone: { shape: 'dots', color: '#2e6676' },
    chips: [
      { label: 'Events' }, { label: 'Ticketing' }, { label: 'QR check-in' },
      { label: 'About ↗', href: '/qrgate/' },
    ],
  },
  {
    num: '03', name: 'EduGrade', icon: 'cap', descKey: 'edugrade.desc', ghost: 'EDUGRADE',
    tone: { shape: 'wave', color: '#3d6a4e' },
    chips: [
      { label: 'Education' }, { label: 'Encrypted' }, { label: 'GDPR' },
      { label: 'About ↗', href: '/edugrade/' },
    ],
  },
  {
    num: '04', name: 'DiscordGate', icon: 'shield', descKey: 'discordgate.desc', ghost: 'DISCORDGATE',
    tone: { shape: 'sphere', color: '#5b4886' },
    chips: [
      { label: 'Minecraft' }, { label: 'Discord' }, { label: 'Paper' }, { label: 'Velocity' },
      { label: 'Modrinth ↗', href: 'https://modrinth.com/plugin/discordgate' },
    ],
  },
  {
    num: '05', name: 'AvoLink', icon: 'link', descKey: 'avolink.desc', ghost: 'AVOLINK',
    tone: { shape: 'simplex', color: '#76663a' },
    chips: [
      { label: 'Web' }, { label: 'Links' },
      { label: 'Website ↗', href: 'https://avolink.net' },
    ],
  },
  {
    num: '06', name: 'Craft Attack', icon: 'cube', descKey: 'craftattack.desc', ghost: 'CRAFT',
    tone: { shape: 'ripple', color: '#8a3b22' },
    chips: [
      { label: 'Minecraft' }, { label: 'Survival' }, { label: 'Community' }, { label: 'Crossplay' },
      { label: 'Server ↗', href: '/craftattack/' },
      { label: 'Rules ↗', href: '/craftattack/rules/' },
      { label: 'Aerlon ↗', href: '/craftattack/aerlon/' },
      { label: 'Clans & Economy ↗', href: '/craftattack/clans/' },
    ],
  },
];

/* ---- Product scene details ------------------------------------------------
   What fills the right-hand spec panel on each fullscreen product scene. Every
   line is taken from the product's own page (/baxi/, /qrgate/, /edugrade/,
   /craftattack/) or its listing — nothing here is a claim those pages don't
   already make. Keyed by the descKey prefix ('baxi.desc' → 'baxi'). */
export type ProjectDetail = { features: string[]; facts: [string, string][] };

export const projectDetails: Record<Lang, Record<string, ProjectDetail>> = {
  en: {
    baxi: {
      features: [
        'Three-layer chat filter: rules, AI classification, phishing links',
        'Network-wide trust scoring and a shared spammer database',
        'Tickets, polls, giveaways, leveling and more',
        'Everything configured in the web dashboard',
      ],
      facts: [['Platform', 'Discord'], ['Setup', 'Web dashboard'], ['Modules', '27']],
    },
    qrgate: {
      features: [
        'Online ticket shop, no customer account needed',
        'PDF ticket with a unique QR code, sent by email',
        'Door check-in with any smartphone',
        'Live dashboard for sales, revenue and remaining tickets',
      ],
      facts: [['Platform', 'Web, no app'], ['Roles', 'Admin · Box office · Door'], ['Status', 'In production']],
    },
    edugrade: {
      features: [
        'Classes and students, with CSV import',
        'Weighted grades, averages calculated automatically',
        'Attendance tracking with automatic warnings',
        'Grades shared with students via PIN link',
      ],
      facts: [['Platform', 'Web, any device'], ['Encryption', 'AES-256-GCM'], ['Privacy', 'GDPR compliant']],
    },
    discordgate: {
      features: [
        'Players link their Discord account before they can join',
        'Works together with Baxi',
        'Supports Bedrock players',
        'Runs on Paper and Velocity',
      ],
      facts: [['Platform', 'Minecraft'], ['Server', 'Paper · Velocity'], ['Download', 'Modrinth']],
    },
    avolink: {
      features: [
        'Short, custom links',
        'All your profiles on one page',
        'A Linktree alternative',
      ],
      facts: [['Platform', 'Web'], ['Address', 'avolink.net']],
    },
    craftattack: {
      features: [
        'Java and Bedrock crossplay',
        'Clans, jobs and an economy',
        'Live BlueMap, voice chat, opt-in PvP',
        'Free to join, no application form',
      ],
      facts: [['Season', '2 · The Ashes of Aerlon'], ['Edition', 'Java + Bedrock'], ['Address', 'craftattack.avocloud.net']],
    },
  },
  de: {
    baxi: {
      features: [
        'Chat-Filter in drei Stufen: Regeln, KI-Klassifizierung, Phishing-Links',
        'Netzwerkweites Trust-Scoring und gemeinsame Spammer-Datenbank',
        'Tickets, Umfragen, Giveaways, Leveling und mehr',
        'Alles im Web-Dashboard eingestellt',
      ],
      facts: [['Plattform', 'Discord'], ['Setup', 'Web-Dashboard'], ['Module', '27']],
    },
    qrgate: {
      features: [
        'Online-Ticketshop, ohne Kundenkonto',
        'PDF-Ticket mit eigenem QR-Code per E-Mail',
        'Einlass-Check mit jedem Smartphone',
        'Live-Dashboard für Verkäufe, Umsatz und Restkarten',
      ],
      facts: [['Plattform', 'Web, keine App'], ['Rollen', 'Admin · Kasse · Einlass'], ['Status', 'Im Einsatz']],
    },
    edugrade: {
      features: [
        'Klassen und Schüler, mit CSV-Import',
        'Gewichtete Noten, Durchschnitt automatisch berechnet',
        'Anwesenheit mit automatischer Warnung',
        'Noten per PIN-Link mit Schülern teilen',
      ],
      facts: [['Plattform', 'Web, jedes Gerät'], ['Verschlüsselung', 'AES-256-GCM'], ['Datenschutz', 'DSGVO-konform']],
    },
    discordgate: {
      features: [
        'Spieler verknüpfen Discord, bevor sie beitreten können',
        'Arbeitet mit Baxi zusammen',
        'Unterstützt Bedrock-Spieler',
        'Läuft auf Paper und Velocity',
      ],
      facts: [['Plattform', 'Minecraft'], ['Server', 'Paper · Velocity'], ['Download', 'Modrinth']],
    },
    avolink: {
      features: [
        'Kurze, individuelle Links',
        'Alle Profile auf einer Seite',
        'Eine Linktree-Alternative',
      ],
      facts: [['Plattform', 'Web'], ['Adresse', 'avolink.net']],
    },
    craftattack: {
      features: [
        'Java und Bedrock Crossplay',
        'Clans, Jobs und eine Wirtschaft',
        'Live-BlueMap, Voice-Chat, PvP freiwillig',
        'Kostenlos, kein Bewerbungsformular',
      ],
      facts: [['Season', '2 · Die Asche von Aerlon'], ['Edition', 'Java + Bedrock'], ['Adresse', 'craftattack.avocloud.net']],
    },
  },
};

/* The one value in the footer that has to be maintained by hand. */
export const COPYRIGHT_YEAR = '2026';

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Products' },
  { href: '#contact', label: 'Contact' },
];

export const tabs = [
  { href: '#top', label: 'Top' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Products' },
  { href: '#contact', label: 'Contact' },
];
