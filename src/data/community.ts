/* Craftattack page (/craftattack/). Every fact on the page comes from the
   brief of 13 Oct 2026; nothing here is invented.

   Open points stay `null` in `facts` until Fabian supplies them. Wherever one
   is used the page shows a visible TODO marker instead, so nothing ships
   looking finished while it is not.

   Copy is keyed by language. German is the main language (`de`); an English
   version is a second object of the same `Copy` shape under `en`. Strings may contain inline HTML
   (<a>, <code>, <mark>) and are rendered with set:html. No dashes as
   punctuation in the copy (house style for this page). */

export const facts = {
  name: 'Craftattack' as string | null,
  address: 'craftattack.avocloud.net' as string | null,
  /** planned, not final */
  start: 'Fr. 23. Oktober 2026 (geplant)' as string | null,
  bedrock: true as boolean | null,
  mapUrl: 'https://map.craftattack.avocloud.net' as string | null,
  version: '26.2',
  discord: '/discord/',
  /** Flip once every TODO is gone: drops noindex. Also remove the
      /craftattack/ line from the sitemap filter in astro.config.mjs. */
  launched: false,
  /** Discord channels, exactly as they are named on the server */
  ticketChannel: { name: '📯〢ticket', url: 'https://discord.com/channels/1303089030996426752/1303089032162447363' },
  helpChannel: { name: '❓〢help-desk', url: 'https://discord.com/channels/1303089030996426752/1303124233903276043' },
};

/** Visible placeholder for HTML strings. */
export const todo = (what: string) => `<mark class="todo">TODO: ${what}</mark>`;
/** Same, for plain-text contexts (meta tags, the wordmark). */
export const todoText = (what: string) => `TODO: ${what}`;

const addressHtml = facts.address ? `<code>${facts.address}</code>` : todo('server address');
const startHtml = facts.start ?? todo('start date');
/** A Discord channel: its exact name in the code frame, linked to the channel. */
const channel = (c: { name: string; url: string }) =>
  `<a class="mc-channel" href="${c.url}" target="_blank" rel="noopener"><code>${c.name}</code></a>`;
const bedrockHtml =
  facts.bedrock === null ? todo('Bedrock crossplay yes or no') : facts.bedrock ? 'Java und Bedrock' : 'nur Java';

type Row = { title: string; body: string };
/** `icon`: inner markup of a 24x24 Lucide icon (stroke, no fill) */
type Card = { title: string; body: string; icon: string };
type QA = { q: string; a: string };

const icons = {
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  archive: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  play: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
};

export type Copy = {
  meta: { title: string; description: string; ogImageAlt: string };
  /** back link at the top of the join and rules pages */
  back: string;
  /** `#…` links are sections of the main page; CommunityApp prefixes them
      with /craftattack/ on the subpages */
  nav: { href: string; label: string }[];
  hero: {
    claim: string;
    stats: { n: string; l: string }[];
    join: string;
    discord: string;
  };
  about: { label: string; headline: string; body: string[]; glanceLabel: string; glance: Row[] };
  world: { label: string; title: string; body: string; rows: Row[] };
  gallery: { label: string; prev: string; next: string; slide: string; pause: string; play: string };
  features: { label: string; headline: string; cards: Card[] };
  start: { label: string; headline: string; cards: (Card & { href: string; cta: string })[] };
  faq: { label: string; headline: string; items: QA[] };
  finale: { label: string; sub: string; start: string; join: string; discord: string };
  joinPage: {
    meta: { title: string; description: string };
    label: string;
    headline: string;
    intro: string;
    addressLabel: string;
    copy: string;
    copied: string;
    copyAria: string;
    editions: { id: string; title: string; note: string; steps: Row[] }[];
    voice: Row;
    help: Row;
    discord: string;
    rules: string;
  };
  rulesPage: {
    meta: { title: string; description: string };
    label: string;
    headline: string;
    intro: string;
    items: Row[];
    help: Row;
    note: string;
    join: string;
  };
};

const linkStep = {
  title: 'Im Discord verbinden',
  body: 'Komm auf unseren <a href="/discord/">Discord</a> und gib dort <code>/mc link &lt;code&gt;</code> mit deinem Code ein.',
};
const kickStep = {
  title: 'Beitreten und Code holen',
  body: 'Tritt dem Server bei. Du wirst sofort mit einem Code rausgeworfen. Das ist normal, merk dir einfach den Code.',
};
const againStep = { title: 'Nochmal beitreten', body: 'Tritt dem Server nochmal bei. Willkommen auf Craftattack!' };

/* Für Spieler geschrieben, nicht für Admins: kurze Sätze, du-Form, was man
   auf dem Server machen kann. Keine Plugin- oder Technik-Namen, außer dort,
   wo Spieler selbst etwas installieren müssen (der Voice-Chat-Mod). */
const de: Copy = {
  meta: {
    title: `${facts.name ?? todoText('Servername')} · Kostenloser Community-Minecraft-Server | Avocloud.net`,
    description:
      'Ein entspannter, kostenloser Minecraft-Server für die AvoCloud-Community. Bauen, farmen, entdecken und zusammen Spaß haben. Java und Bedrock, ohne Bewerbung.',
    ogImageAlt: 'Fichtenwald mit goldenen Lärchen unter einer Klippe auf dem Craftattack-Server',
  },
  back: 'Zurück zu Craftattack',
  nav: [
    { href: '#about', label: 'Über' },
    { href: '#world', label: 'Welt' },
    { href: '#features', label: 'Features' },
    { href: '/craftattack/join/', label: 'Mitspielen' },
    { href: '/craftattack/rules/', label: 'Regeln' },
    { href: '#faq', label: 'FAQ' },
  ],
  hero: {
    claim: 'Ein entspannter Vanilla-Survival-Server zum Bauen, Farmen, Chillen und Lachen.',
    stats: [
      { n: 'Vanilla', l: 'Survival' },
      { n: facts.version, l: 'Version' },
      { n: 'Voice', l: 'Chat' },
    ],
    join: 'So kommst du rein',
    discord: 'Discord',
  },
  about: {
    label: 'Über den Server',
    headline: 'Hier triffst du die Community.',
    body: [
      'Auf Craftattack trifft sich die AvoCloud-Community. Bau dir ein Zuhause, leg Farmen an, geh auf Entdeckungstour oder quatsch einfach mit den anderen.',
      '<strong>Kein Wettbewerb, kein Streamer-Event, kein Druck.</strong> Du spielst in deinem Tempo.',
      'Wir starten klein mit etwa 10 bis 15 Leuten. Platz ist für viele mehr.',
    ],
    glanceLabel: 'Auf einen Blick',
    glance: [
      { title: 'Start', body: startHtml },
      { title: 'Spielbar auf', body: bedrockHtml },
      { title: 'Version', body: facts.version },
    ],
  },
  world: {
    label: 'Die Welt',
    title: 'Eine ganze Welt zum Entdecken.',
    body: 'Hohe Berge, tiefe Täler und wilde Wälder. Du startest auf der Spawn-Insel, das Festland ist gleich nebenan.',
    rows: [
      {
        title: 'Neue Landschaften',
        body: 'Die Welt steckt voller Gegenden, die es im normalen Minecraft nicht gibt. Du brauchst dafür keine Mods.',
      },
      {
        title: 'Start auf der Insel',
        body: 'Alle starten auf der Spawn-Insel. Das Festland ist nah, du kannst also gleich loslegen.',
      },
      {
        title: 'Die Welt bleibt',
        body: 'Kein Reset. Die Welt läuft mindestens 3 Monate. Danach stimmen wir gemeinsam ab, und falls sie je endet, weißt du es mindestens 4 Wochen vorher.',
      },
    ],
  },
  gallery: {
    label: 'Galerie',
    prev: 'Vorheriger Screenshot',
    next: 'Nächster Screenshot',
    slide: 'Screenshot',
    pause: 'Automatisches Weiterblättern anhalten',
    play: 'Automatisches Weiterblättern starten',
  },
  features: {
    label: 'Features',
    headline: 'Das erwartet dich.',
    cards: [
      {
        title: 'Voice-Chat',
        body: 'Red mit den Leuten in deiner Nähe, direkt im Spiel. Je näher ihr euch seid, desto lauter hört ihr euch. Dafür brauchst du den Mod Simple Voice Chat (nur Java).',
        icon: icons.mic,
      },
      {
        title: 'Live-Karte',
        body: `Schau dir die ganze Welt im Browser an, such dir einen Platz für deine Base und sieh zu, wie alles wächst. ${
          facts.mapUrl ? `<a href="${facts.mapUrl}" target="_blank" rel="noopener">Karte öffnen</a>` : todo('map URL')
        }`,
        icon: icons.map,
      },
      {
        title: 'Chat mit Discord',
        body: 'Der Chat im Spiel ist mit Discord verbunden. So kannst du mitreden, auch wenn du gerade nicht online bist.',
        icon: icons.chat,
      },
      {
        title: 'Hilfe, wenn was kaputtgeht',
        body: 'Jemand hat an deinem Bau herumgepfuscht? Mach ein Ticket auf, wir kümmern uns. Das meiste können wir wiederherstellen.',
        icon: icons.shield,
      },
      {
        title: 'Gemeinsam bauen',
        body: 'Stimm im Discord über das nächste große Gemeinschaftsprojekt ab. Dann bauen wir es zusammen.',
        icon: icons.users,
      },
      {
        title: 'Tägliche Backups',
        body: 'Die Welt wird jeden Tag gesichert. Es geht also nichts verloren.',
        icon: icons.archive,
      },
    ],
  },
  start: {
    label: 'Los geht’s',
    headline: 'Bereit zum Spielen?',
    cards: [
      {
        title: 'So kommst du rein',
        body: 'Schritt für Schritt für Java und Bedrock. Keine Bewerbung, nur Discord verbinden.',
        icon: icons.play,
        href: '/craftattack/join/',
        cta: 'Zur Anleitung',
      },
      {
        title: 'Regeln',
        body: 'Acht einfache Regeln, damit sich alle wohlfühlen.',
        icon: icons.book,
        href: '/craftattack/rules/',
        cta: 'Regeln lesen',
      },
    ],
  },
  faq: {
    label: 'FAQ',
    headline: 'Häufige Fragen.',
    items: [
      { q: 'Kostet das etwas?', a: 'Nein. Craftattack ist kostenlos.' },
      {
        q: 'Muss ich mich bewerben?',
        a: 'Nein. Server betreten, Konto im Discord verbinden, losspielen. Mehr dazu unter <a class="accent-link" href="/craftattack/join/">So kommst du rein</a>.',
      },
      {
        q: 'Brauche ich Mods?',
        a: 'Nein. Nur für den Voice-Chat brauchst du den Mod Simple Voice Chat (nur Java). Alles andere läuft mit dem normalen Spiel.',
      },
      {
        q: 'Kann ich mit Bedrock spielen?',
        a: 'Ja. Java- und Bedrock-Spieler spielen zusammen auf demselben Server. Den Voice-Chat gibt es nur auf Java.',
      },
      {
        q: 'Wie lange läuft der Server?',
        a: 'Mindestens 3 Monate. Danach entscheiden wir gemeinsam. Falls der Server endet, erfährst du es mindestens 4 Wochen vorher.',
      },
      {
        q: 'Wo kann ich Fragen stellen?',
        a: `Im Forum ${channel(facts.helpChannel)} auf unserem <a class="accent-link" href="/discord/">Discord</a>. Probleme mit anderen Spielern meldest du per Ticket in ${channel(facts.ticketChannel)}.`,
      },
      {
        q: 'Wer betreibt den Server?',
        a: 'AvoCloud. Du erreichst uns auf <a class="accent-link" href="/discord/">Discord</a>.',
      },
    ],
  },
  finale: {
    label: 'Wir sehen uns',
    sub: 'Java und Bedrock · Kostenlos · Ohne Bewerbung',
    start: `Start: ${startHtml}`,
    join: 'So kommst du rein',
    discord: 'Discord',
  },
  joinPage: {
    meta: {
      title: 'So kommst du rein · Craftattack | Avocloud.net',
      description:
        'So trittst du dem kostenlosen Minecraft-Server Craftattack bei, Schritt für Schritt für Java und Bedrock. Ohne Bewerbung.',
    },
    label: 'Mitspielen',
    headline: 'In vier Schritten dabei.',
    intro:
      'Kostenlos und offen für alle. Du brauchst Minecraft (Java oder Bedrock) und einen Discord-Account. Eine Bewerbung gibt es nicht.',
    addressLabel: 'Serveradresse',
    copy: 'Kopieren',
    copied: 'Kopiert',
    copyAria: 'Serveradresse kopieren',
    editions: [
      {
        id: 'java',
        title: 'Java Edition',
        note: `PC, Version ${facts.version}`,
        steps: [
          {
            title: 'Server hinzufügen',
            body: `Öffne Minecraft, klick auf <strong>Mehrspieler</strong> und dann auf <strong>Server hinzufügen</strong>. Gib als Adresse ${addressHtml} ein.`,
          },
          kickStep,
          linkStep,
          againStep,
        ],
      },
      {
        id: 'bedrock',
        title: 'Bedrock Edition',
        note: 'Windows, Handy und Tablet',
        steps: [
          {
            title: 'Server hinzufügen',
            body: `Öffne Minecraft, tipp auf <strong>Spielen</strong>, wechsle zum Tab <strong>Server</strong> und tipp auf <strong>Server hinzufügen</strong>. Gib als Adresse ${addressHtml} ein und lass den Port auf <code>19132</code>.`,
          },
          kickStep,
          linkStep,
          againStep,
        ],
      },
    ],
    voice: {
      title: 'Voice-Chat (nur Java)',
      body: 'Du willst im Spiel reden? Installier den Mod Simple Voice Chat für deine Minecraft-Version. <a class="accent-link" href="https://modrinth.com/plugin/simple-voice-chat" target="_blank" rel="noopener">Auf Modrinth herunterladen</a>',
    },
    help: {
      title: 'Kommst du nicht weiter?',
      body: `Frag in ${channel(facts.helpChannel)} auf unserem Discord, dann hilft dir jemand.`,
    },
    discord: 'Zum Discord',
    rules: 'Regeln lesen',
  },
  rulesPage: {
    meta: {
      title: 'Regeln · Craftattack | Avocloud.net',
      description: 'Acht einfache Regeln für den Minecraft-Server Craftattack, damit sich alle wohlfühlen.',
    },
    label: 'Regeln',
    headline: 'Fair spielen. Nett sein.',
    intro: 'Ein paar einfache Regeln, damit sich alle wohlfühlen. Der Rest ist gesunder Menschenverstand.',
    items: [
      {
        title: 'Sei nett',
        body: 'Behandle andere so, wie du selbst behandelt werden willst, im Spiel und auf Discord. Keine Beleidigungen, kein Hass, kein Mobbing, kein Spam.',
      },
      {
        title: 'Respektiere, was andere bauen',
        body: 'Bauten, Farmen und Kisten gehören dem, der sie gebaut hat. Mach nichts kaputt und nimm nichts, was dir nicht gehört.',
      },
      {
        title: 'Lass etwas Platz',
        body: 'Bau mit etwas Abstand zu anderen. Willst du direkt neben jemandem bauen, frag einfach vorher.',
      },
      {
        title: 'Kämpfen nur, wenn beide wollen',
        body: 'PvP ist okay, wenn beide einverstanden sind. Greif niemanden an, der nicht mitmachen will, und stell keine Fallen.',
      },
      {
        title: 'Bleib fair',
        body: 'Mods, die nur das Aussehen oder die Leistung verbessern, sind erlaubt. Cheats, X-Ray und das Ausnutzen von Bugs (zum Beispiel Duping) nicht. Bug gefunden? Sag uns Bescheid.',
      },
      {
        title: 'Halte die Welt schön',
        body: 'Pflanz Bäume nach, die du in der Nähe vom Spawn und von anderen Basen fällst. Lass keine schwebenden Baumkronen oder großen Krater zurück.',
      },
      {
        title: 'Schon den Server',
        body: 'Farmen jeder Größe sind willkommen. Bau nur nichts, was den Server absichtlich lahmlegt.',
      },
      {
        title: 'Keine Werbung',
        body: 'Keine Werbung für andere Server oder Discords. Schilder für deinen Shop im Spiel sind okay.',
      },
    ],
    help: {
      title: 'Ist etwas passiert?',
      body: `Mach ein Ticket in ${channel(facts.ticketChannel)} auf. Fragen gehören in ${channel(facts.helpChannel)}.`,
    },
    note: 'Das Team hat ein Auge auf alles. Wenn etwas kaputtgeht, können wir es meistens wiederherstellen.',
    join: 'So kommst du rein',
  },
};

/** Hauptsprache ist Deutsch. Eine englische Fassung wäre ein zweites Objekt
    derselben `Copy`-Form unter `en`. */
export const copy: Record<'de', Copy> = { de };

/** Carousel screenshots: public/assets/images/craftattack/ca-world-<n>.webp,
    plus a 720px ca-world-<n>-thumb.webp that phones load instead. Shown in
    this order. To add one, drop both files in and append a line. */
export const shots: { n: number; alt: string; cap: string }[] = [
  { n: 3, alt: 'Blick über einen Fichtenwald mit goldenen Lärchen auf eine helle Felsklippe mit Kirschbäumen', cap: 'Goldene Lärchen unter einer Klippe mit Kirschbäumen' },
  { n: 1, alt: 'Ein Geysir dampft aus einer heißen Quelle, umgeben von orangen und gelben Blöcken, dahinter Birken', cap: 'Ein Geysir in einer heißen Quelle' },
  { n: 2, alt: 'Eine hohe Spitze aus blauem Eis und Schnee über einem gefrorenen See', cap: 'Eisspitze über einem gefrorenen See' },
  { n: 5, alt: 'Grüner Hügel mit Felsen unter einem Kamm aus Fichten und goldenen Lärchen', cap: 'Wiese unter einem Fichtenkamm' },
  { n: 6, alt: 'Blick von einer Steinklippe in ein tiefes Tal voller Fichten und goldener Lärchen', cap: 'Ein bewaldetes Tal von oben' },
  { n: 7, alt: 'Ein See zwischen zwei Bäumen, mit blauen Eisspitzen im Wasser und einer hohen Felsnadel in der Ferne', cap: 'See mit Eisspitzen und Felsnadel' },
  { n: 4, alt: 'Abenddämmerung in einem Wald aus goldenen und dunkelgrünen Fichten mit Birkenstämmen', cap: 'Dämmerung im Wald' },
];
