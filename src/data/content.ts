/* ----------------------------------------------------------------------------
   Content + i18n for the avocloud.net redesign.
   Default render language is EN (ships in the static HTML for SEO); the client
   toggles to DE. Ported 1:1 from the original inline _i18nData.
   -------------------------------------------------------------------------- */

export type Lang = 'en' | 'de';

export const messages: Record<Lang, Record<string, string>> = {
  en: {
    'hero.eyebrow': 'Open-source · Since 2024',
    'hero.claim': 'A small crew building open-source tools',
    'about.label': 'ABOUT US',
    'about.heading': "Hi, we're Avocloud.",
    'about.intro':
      "Hey, we're Avocloud.net — a small crew of developers and moderators from Austria and Germany who like to build things in their spare time. Since 2024, what started as a handful of hobby projects has grown into an ongoing playground where we experiment, break stuff, learn, and ship software we actually find useful.",
    'about.body2':
      "Our work spans Discord moderation tools, Minecraft plugins, web utilities, and our own hosting infrastructure. Everything we build is open source under the MIT license and freely available on GitHub — whether it's a suggested feature or something we cooked up on the spot, we just want to make useful things and share them.",
    'about.opensource.heading': 'Open Source',
    'about.opensource.body':
      "Every project we ship is open source under the MIT license and freely available on GitHub. We believe in transparency and community-driven development — if something we built helps you, that's more than enough reason to keep going.",
    'about.community.heading': 'Community',
    'about.community.body':
      'Join our Discord server to follow along, suggest features, report bugs, or just hang out. We’re always happy to hear from people who find our tools useful.',
    'mission.label': 'MISSION',
    'mission.big':
      'Everything we build is <span class="mark">open source</span> — <span class="coral">free, forever</span>.',
    'team.label': 'THE TEAM',
    'team.heading': 'About our Team',
    'team.rwolf.desc': 'Owner of Avocloud.net, Python / Java developer and server manager.',
    'team.tfj.desc': 'Administrator at Avocloud.net and organizer of several independent projects.',
    'team.mod.desc': 'Moderator in Avocloud.net Minecraft projects.',
    'projects.label': 'PROJECTS',
    'projects.heading': 'Our Projects',
    'baxi.desc': 'A verified Discord bot with intelligent chat filter, global spammer database, and much more.',
    'craftattack.desc':
      'Open Craft Attack community Minecraft server — Season 2: The Ashes of Aerlon. Java + Bedrock crossplay, clans, jobs, BlueMap. Free, no application form.',
    'safetext.desc': 'API server scanning text for offensive language. Powers Baxi and AvoFilter.',
    'skyfire.desc':
      'A MicroServer hosting service by us. Host your projects, websites, and status monitoring — from Python to Minecraft servers.',
    'qrgate.desc':
      'A full-featured ticketing system with integrated shop, PayPal payment, automated email delivery, and QR code check-in.',
    'ember.desc': 'Our own Instagram-like social media. Now a <span class="mark">public archive</span>.',
    'avofilter.desc':
      "A Minecraft plugin powered by SafeText that checks and blocks inappropriate messages in your server's chat.",
    'edugrade.desc':
      'A secure web app for educators to manage student grades, classes, and performance tracking — with AES-256-GCM encryption and built-in analytics.',
    'helene.desc':
      'Website and ticketing system for the parish theater group in Sattledt, Austria. We built and maintain their website and operate QrGate as their custom ticketing & shop solution.',
    'avolink.desc':
      'A link shortener and Linktree alternative. Create short, custom links and share all your profiles in one place.',
    'collab.label': 'COLLABORATIONS',
    'collab.heading': 'Our Collaborations',
    'cee.desc': 'A streamer on Twitch with a nice, friendly community.',
    'support.label': 'SUPPORT US',
    'support.heading': 'Buy Us A Coffee',
    'contact.label': 'CONTACT',
    'contact.heading': 'Get In Touch',
    'contact.discord.text': 'Join our Discord server:',
    'contact.support.text': 'Send us an email:',
    'contact.legal.text': 'Legal information:',
    'stat.projects': 'Projects',
    'stat.members': 'Members',
    'stat.founded': 'Founded',
    'footer.text': 'Avocloud.net — An open-source software development group',
  },
  de: {
    'hero.eyebrow': 'Open-Source · Seit 2024',
    'hero.claim': 'Ein kleines Team baut Open-Source-Tools',
    'about.label': 'ÜBER UNS',
    'about.heading': 'Hallo, wir sind Avocloud.',
    'about.intro':
      'Hey, wir sind Avocloud.net — ein kleines Team aus Entwicklern und Moderatoren aus Österreich und Deutschland, das in seiner Freizeit gerne Dinge baut. Seit 2024 ist aus einigen Hobby-Projekten ein laufendes Spielfeld geworden, auf dem wir experimentieren, Fehler machen, lernen und Software veröffentlichen, die wir selbst nützlich finden.',
    'about.body2':
      'Unsere Arbeit umfasst Discord-Moderationstools, Minecraft-Plugins, Web-Utilities und unsere eigene Hosting-Infrastruktur. Alles, was wir bauen, ist Open Source unter der MIT-Lizenz und frei auf GitHub verfügbar — ob vorgeschlagenes Feature oder spontane Idee, wir wollen nützliche Dinge bauen und teilen.',
    'about.opensource.heading': 'Open Source',
    'about.opensource.body':
      'Jedes Projekt, das wir veröffentlichen, ist Open Source unter der MIT-Lizenz und frei auf GitHub verfügbar. Wir glauben an Transparenz und community-getriebene Entwicklung — wenn etwas, das wir gebaut haben, jemandem hilft, ist das Grund genug weiterzumachen.',
    'about.community.heading': 'Community',
    'about.community.body':
      'Tritt unserem Discord-Server bei, um mitzuverfolgen, Features vorzuschlagen, Bugs zu melden oder einfach abzuhängen. Wir freuen uns immer über Menschen, die unsere Tools nützlich finden.',
    'mission.label': 'MISSION',
    'mission.big':
      'Alles, was wir bauen, ist <span class="mark">Open Source</span> — <span class="coral">kostenlos, für immer</span>.',
    'team.label': 'DAS TEAM',
    'team.heading': 'Unser Team',
    'team.rwolf.desc': 'Inhaber von Avocloud.net, Python/Java-Entwickler und Server-Administrator.',
    'team.tfj.desc': 'Administrator bei Avocloud.net und Organisator mehrerer eigener Projekte.',
    'team.mod.desc': 'Moderator in den Avocloud.net Minecraft-Projekten.',
    'projects.label': 'PROJEKTE',
    'projects.heading': 'Unsere Projekte',
    'baxi.desc': 'Ein verifizierter Discord-Bot mit intelligentem Chat-Filter, globaler Spammer-Datenbank und vielem mehr.',
    'craftattack.desc':
      'Offener Craft Attack Community Minecraft-Server — Season 2: Die Asche von Aerlon. Java + Bedrock Crossplay, Clans, Jobs, BlueMap. Kostenlos, kein Bewerbungsformular.',
    'safetext.desc': 'API-Server zur Erkennung anstößiger Sprache. Betreibt Baxi und AvoFilter.',
    'skyfire.desc':
      'Ein MicroServer-Hosting-Dienst von uns. Hoste deine Projekte, Websites und Status-Monitoring — von Python bis Minecraft-Servern.',
    'qrgate.desc':
      'Ein vollständiges Ticketing-System mit integriertem Shop, PayPal-Zahlung, automatisiertem E-Mail-Versand und QR-Code-Check-in.',
    'ember.desc': 'Unser eigenes Instagram-ähnliches soziales Netzwerk. Jetzt <span class="mark">öffentliches Archiv</span>.',
    'avofilter.desc':
      'Ein Minecraft-Plugin auf Basis von SafeText, das unangemessene Nachrichten im Server-Chat erkennt und blockiert.',
    'edugrade.desc':
      'Eine sichere Web-App für Lehrkräfte zur Notenverwaltung — AES-256-GCM-verschlüsselt mit integrierter Analyse.',
    'helene.desc':
      'Website und Ticketing-System für die Pfarrtheatergruppe in Sattledt, Österreich. Wir haben ihre Website erstellt und betreiben QrGate als hauseigenes Ticketing- & Shop-System.',
    'avolink.desc':
      'Ein Link-Shortener und Linktree-Alternative. Erstelle kurze, individuelle Links und teile alle deine Profile an einem Ort.',
    'collab.label': 'KOOPERATIONEN',
    'collab.heading': 'Unsere Kooperationen',
    'cee.desc': 'Ein Streamer auf Twitch mit einer netten, freundlichen Community.',
    'support.label': 'UNTERSTÜTZE UNS',
    'support.heading': 'Spendier uns einen Kaffee',
    'contact.label': 'KONTAKT',
    'contact.heading': 'Kontakt aufnehmen',
    'contact.discord.text': 'Tritt unserem Discord-Server bei:',
    'contact.support.text': 'Schreib uns eine E-Mail:',
    'contact.legal.text': 'Rechtliche Informationen:',
    'stat.projects': 'Projekte',
    'stat.members': 'Mitglieder',
    'stat.founded': 'Gegründet',
    'footer.text': 'Avocloud.net — Eine Open-Source-Softwareentwicklungsgruppe',
  },
};

export const seo: Record<Lang, { title: string; description: string }> = {
  en: {
    title: 'Avocloud.net — Open-Source Discord Bots, Minecraft Plugins & Web Tools',
    description:
      'Avocloud.net — open-source developer group from Austria & Germany. We build Discord bots (Baxi), Minecraft plugins (AvoFilter), an open Craft Attack community server, EduGrade, QrGate, PWGEN, and more. Free, MIT-licensed.',
  },
  de: {
    title: 'Avocloud.net — Open-Source Discord-Bots, Minecraft-Plugins & Web-Tools',
    description:
      'Avocloud.net — Open-Source-Entwicklergruppe aus Österreich & Deutschland. Wir bauen Discord-Bots (Baxi), Minecraft-Plugins (AvoFilter), eine offene Craft Attack Community, EduGrade, QrGate, PWGEN und mehr. Kostenlos, MIT-Lizenz.',
  },
};

export type Chip = { label: string; href?: string };
export type IconKey =
  | 'cube' | 'chat' | 'shield' | 'server' | 'qr'
  | 'globe' | 'layers' | 'cap' | 'ticket' | 'link';

export type Project = {
  num: string;
  name: string;
  icon: IconKey;
  descKey: string;
  descHtml?: boolean;
  chips: Chip[];
  ghost: string;
};

export const projects: Project[] = [
  {
    num: '01', name: 'Craft Attack Community Server', icon: 'cube', descKey: 'craftattack.desc', ghost: 'CRAFT',
    chips: [
      { label: 'Minecraft' }, { label: 'Survival' }, { label: 'Community' }, { label: 'Crossplay' },
      { label: 'Server ↗', href: '/craftattack/' },
      { label: 'Rules ↗', href: '/craftattack/rules/' },
      { label: 'Aerlon ↗', href: '/craftattack/aerlon/' },
      { label: 'Clans & Economy ↗', href: '/craftattack/clans/' },
    ],
  },
  {
    num: '02', name: 'Baxi', icon: 'chat', descKey: 'baxi.desc', ghost: 'BAXI',
    chips: [
      { label: 'Discord' }, { label: 'Moderation' }, { label: 'Security' }, { label: 'Python' }, { label: 'Open Source' },
      { label: 'Dashboard ↗', href: 'https://baxi.avocloud.net/' },
      { label: 'Invite ↗', href: '/baxi/invite/' },
      { label: 'About ↗', href: '/baxi/' },
      { label: 'GitHub ↗', href: 'https://github.com/AvoCloud-net/Baxi' },
    ],
  },
  {
    num: '03', name: 'SafeText', icon: 'shield', descKey: 'safetext.desc', ghost: 'SAFETEXT',
    chips: [
      { label: 'Python' }, { label: 'API' }, { label: 'Open Source' },
      { label: 'GitHub ↗', href: 'https://github.com/AvoCloud-net/SafeText' },
    ],
  },
  {
    num: '04', name: 'SkyFire', icon: 'server', descKey: 'skyfire.desc', ghost: 'SKYFIRE',
    chips: [
      { label: 'Server' }, { label: '24/7' }, { label: 'Gaming' }, { label: 'Free or paid' },
      { label: 'Website ↗', href: '/skyfire/' },
    ],
  },
  {
    num: '05', name: 'QrGate', icon: 'qr', descKey: 'qrgate.desc', ghost: 'QRGATE',
    chips: [
      { label: 'Python' }, { label: 'Events' }, { label: 'Ticketing' }, { label: 'Open Source' },
      { label: 'About ↗', href: '/qrgate/' },
      { label: 'GitHub ↗', href: 'https://github.com/rwolf2467/qr_gate' },
    ],
  },
  {
    num: '06', name: 'Ember', icon: 'globe', descKey: 'ember.desc', descHtml: true, ghost: 'EMBER',
    chips: [
      { label: 'Website' }, { label: 'Open Source' },
      { label: 'GitHub ↗', href: 'https://github.com/rwolf2467/ember' },
    ],
  },
  {
    num: '07', name: 'AvoFilter', icon: 'layers', descKey: 'avofilter.desc', ghost: 'AVOFILTER',
    chips: [
      { label: 'Minecraft' }, { label: 'Security' }, { label: 'Open Source' },
      { label: 'Modrinth ↗', href: 'https://modrinth.com/plugin/avofilter' },
      { label: 'GitHub ↗', href: 'https://github.com/AvoCloud-net/AvoFilter' },
    ],
  },
  {
    num: '08', name: 'EduGrade', icon: 'cap', descKey: 'edugrade.desc', ghost: 'EDUGRADE',
    chips: [
      { label: 'Python' }, { label: 'Education' }, { label: 'Encrypted' }, { label: 'Open Source' },
      { label: 'GitHub ↗', href: 'https://github.com/rwolf2467/EduGrade' },
      { label: 'Docker ↗', href: 'https://hub.docker.com/r/redwolf2467/edugrade' },
      { label: 'About ↗', href: '/edugrade/' },
    ],
  },
  {
    num: '09', name: 'Helenenbühne Sattledt', icon: 'ticket', descKey: 'helene.desc', ghost: 'HELENE',
    chips: [
      { label: 'Website' }, { label: 'Ticketing' }, { label: 'QrGate' }, { label: 'Theater' },
      { label: 'Website ↗', href: 'https://helenenbuehne.at' },
      { label: 'QrGate ↗', href: 'https://github.com/rwolf2467/qr_gate' },
    ],
  },
  {
    num: '10', name: 'AvoLink', icon: 'link', descKey: 'avolink.desc', ghost: 'AVOLINK',
    chips: [
      { label: 'Web' }, { label: 'Open Source' },
      { label: 'Website ↗', href: 'https://avolink.net' },
    ],
  },
];

export type Staff = {
  name: string;
  descKey: string;
  banner?: string;      // image src
  bannerColor?: string; // solid fallback
  bannerPos?: string;
  avatar: string;
  chips: Chip[];
  wide?: boolean;
};

export const team: Staff[] = [
  {
    name: 'Red_Wolf2467 // Fabian', descKey: 'team.rwolf.desc', wide: true,
    banner: '/assets/images/red_wolf2467-banner.gif', bannerPos: 'center 38%',
    avatar: '/assets/images/Red_Wolf2467.png',
    chips: [
      { label: 'Developer' }, { label: 'System Admin' }, { label: 'Networking' },
      { label: 'GitHub ↗', href: 'https://github.com/rwolf2467' },
      { label: 'E-Mail ↗', href: 'mailto:redwolf2467@avocloud.net' },
    ],
  },
  {
    name: 'TFJ', descKey: 'team.tfj.desc',
    banner: '/assets/images/tfj-banner.webp', avatar: '/assets/images/tfj.png',
    chips: [
      { label: 'Admin' }, { label: 'Developer' },
      { label: 'E-Mail ↗', href: 'mailto:tfj@avocloud.net' },
    ],
  },
  {
    name: 'The_Biest333', descKey: 'team.mod.desc',
    banner: '/assets/images/the_biest333-banner.gif', avatar: '/assets/images/the_biest333.png',
    chips: [
      { label: 'Minecraft Team' }, { label: 'Moderation' },
      { label: 'E-Mail ↗', href: 'mailto:the_biest333@avocloud.net' },
    ],
  },
  {
    name: 'LumpiFirefighter', descKey: 'team.mod.desc',
    banner: '/assets/images/lumpifirefighter-banner.gif', avatar: '/assets/images/lumpifirefighter.gif',
    chips: [
      { label: 'Minecraft Team' }, { label: 'Moderation' },
      { label: 'E-Mail ↗', href: 'mailto:lumpifirefighter@avocloud.net' },
    ],
  },
  {
    name: 'FirePheonix', descKey: 'team.mod.desc',
    bannerColor: '#6f130b', avatar: '/assets/images/firepheonix.png',
    chips: [
      { label: 'Minecraft Team' }, { label: 'Moderation' },
      { label: 'E-Mail ↗', href: 'mailto:firepheonix@avocloud.net' },
    ],
  },
];

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#staff', label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

export const tabs = [
  { href: '#top', label: 'Top' },
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#staff', label: 'Team' },
  { href: '#contact', label: 'Contact' },
];
