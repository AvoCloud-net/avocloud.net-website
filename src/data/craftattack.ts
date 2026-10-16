/* Craft Attack page content — moved out of the five retired subpages
   (rules, features, clans, join, aerlon). Strings may contain inline HTML
   (<strong>, <code>) and are rendered with set:html. */

export const rules = [
  {
    title: 'No Griefing',
    lead: "Don't destroy, damage, or alter other players' builds, farms, Redstone, or claimed areas.",
    points: [
      'Applies to claims AND actively used unclaimed areas',
      'Unclaimed pure wilderness may be modified normally',
      'Accidental damage? Report immediately and it will be restored',
    ],
    punish:
      'Minor (1–5 blocks): 1-day timeout + restoration · Moderate (6–20): 3-day timeout + restoration · Major (21+) / malicious: 7-day ban; repeat → permanent ban',
  },
  {
    title: 'No Stealing',
    lead: 'No access to chests, inventories, or protected areas without permission.',
    points: [
      'All containers: Chests, Shulkers, Barrels, Hoppers, Dispensers, Furnaces',
      '"Borrowing" without permission = theft',
      "Auto-Hopper pointed at others' containers = immediate violation",
      'Graves are protected (see Rule 6)',
    ],
    punish: 'Low value: 2-day timeout + item return · High value / rare items: 7-day ban; repeat → permanent',
  },
  {
    title: 'Respectful Conduct',
    lead: 'No insults, discrimination, hate speech, harassment, threats, or doxxing — in-game and on Discord.',
    points: [
      'Zero tolerance: racism, sexism, homo-/transphobia, slurs',
      'Repeated contact after "stop" = harassment',
      'Trolling RP scenes = harassment',
      '<strong>Provocation &amp; needling:</strong> Deliberately provoking players via comments, comparisons, or challenges (e.g. skill remarks, baiting into combat) counts as harassment when the targeted player visibly rejects it.',
    ],
    punish:
      'Minor: 1h timeout + warning · Repeated: 1–3 day timeout · Severe (hate speech): 7-day ban min · Extreme (doxxing, threats): permanent + IP ban',
  },
  {
    title: 'Claims & Clans',
    lead: "Protect your builds with the claim system. Respect others' claims. Follow clan rules.",
    points: [
      'No overlapping claims. Default: keep some distance to neighboring claims. Directly adjacent claims only with explicit agreement of the affected claim holder.',
      "Auto-unclaim only when upkeep can't be paid (insufficient balance on <code>/money</code>). No time-based inactivity unclaim.",
      'Clan founding: leader responsible for members',
      'Alliances and Wars require mutual consent',
      "<strong>No sharing of foreign structure locations:</strong> Coordinates, waypoints, maps, screenshots, or any pointers to another player's build must NOT be shared without explicit permission of the owner. Applies to chat, Discord, voice, third-party tools, and minimap waypoint sharing.",
      "<strong>No homes/waypoints on foreign locations:</strong> Setting a <code>/sethome</code>, waypoint, or any teleport marker on or near another player's clan base, claim, or home is forbidden without explicit permission of the owner.",
    ],
    punish:
      'Claim/clan abuse or unauthorized location sharing → 3-day ban + dissolution; malicious sharing leading to grief → see Rule 1',
  },
  {
    title: 'Consensual PvP',
    lead: 'PvP requires <code>/pvp on</code> from both players. Spawn is always safe.',
    points: [
      'Default: <code>/pvp off</code> for all players',
      '<code>/pvp on → off</code>: 24h cooldown',
      'Newbie protection: 48h auto-off for new players',
      'Spawn (500 block radius): always PvP-free',
      'Combat Tag: 15 sec, no logout, teleport, or PvP toggle',
      'Combat-Log = treated as death',
      'Clan Wars: opt-in, 7-day auto-end; no base destruction, grave rules still apply',
      "<strong>No walling-in players:</strong> Trapping a player in a location where they can't free themselves (e.g. inside a foreign claim where they have no block-break rights) is forbidden. Walling in for protection from mobs in the open world (where the player can break out) is allowed.",
      '<strong>Protection for outmatched players:</strong> Attacking a clearly outmatched player (no or minimal gear, freshly joined, actively engaged in non-combat activities like enchanting/crafting/building) requires <strong>explicit verbal or written consent</strong> from that player beforehand — in addition to <code>/pvp on</code>. Technically allowed but morally unfair PvP is not OK.',
    ],
    punish:
      'Unauthorized PvP / attacking outmatched players: 1h timeout; repeat → 3-day timeout · Traps / spawn camping: 3-day timeout · Status abuse: 1-day timeout; repeat → 7-day ban',
  },
  {
    title: 'Absolute Grave Protection',
    lead: 'Graves are untouchable for 15 minutes after death. No exceptions.',
    points: [
      'Grave = death chest at death spot; protection radius 3 blocks',
      'Only the owner can open during the 15-minute window',
      'After 15 min: items drop and are free for anyone',
      'Applies in ALL contexts: PvP, Clan Wars, RP, "they deserved it"',
      'No trapping (lava, cactus, pistons, mob spawners) or blocking access',
    ],
    punish:
      'Accidental (reported immediately): warning + restoration · Intentional: 3-day ban min · Malicious (trapping): 7-day ban; repeat → permanent',
  },
  {
    title: 'No Cheats or Unfair Mods',
    lead: 'No hack clients, X-Ray, auto-farmers, entity radar, or coordinate tools.',
    points: [
      '<strong>Forbidden:</strong> Cheat clients (Wurst, Sigma, Impact), combat hacks (aimbot, reach, killaura), movement hacks (fly, speed, nofall), X-Ray + ore-highlight packs, entity radar, auto-farming without input, coordinate finders, chunk pre-gen tools',
      '<strong>Minimaps allowed:</strong> Surface mapping, own position, own waypoints',
      '<strong>Minimaps forbidden:</strong> Cave mode, radar, entity tracking',
    ],
    punish: '1st: 3-day ban + mod removal verification · 2nd: 14-day ban · 3rd / distributing cheats: permanent + IP ban',
  },
  {
    title: 'No Lag Machines',
    lead: 'Builds and farms must not degrade server performance.',
    points: [
      'Staff checks via <code>/tps</code> and profiling',
      'Large Redstone farms are fine as long as TPS stays stable',
      'Optimization chance is given before any penalty',
    ],
    punish:
      'Minor: warning + 1h fix time · Persistent: 6h timeout + required fix · Crash risk: 3-day ban + staff removes the build',
  },
  {
    title: 'Roleplay is Voluntary',
    lead: 'RP is allowed, but nobody is forced. No coercion, no trolling of RP scenes.',
    points: [
      'Toggle with <code>/rp on/off</code>; active RP players show <code>[RP]</code> prefix',
      'RP players may not pressure others to participate',
      "Non-RP players don't disrupt active RP scenes",
      'OOC mark: <code>((Text))</code> or <code>[OOC]</code>',
      'OOC stop signal applies ALWAYS: <code>((stop))</code> or "OOC Stop" in voice chat',
      'Sensitive topics (violence, death, trauma, discrimination) require explicit OOC consent',
      'Character death / item loss only with mutual OOC agreement',
      'RP never overrides server rules. RP violations are double-punished',
    ],
    punish: '1st: warning · 2nd: 1-day timeout · Ignoring OOC stop / RP griefing: 3–7 day ban',
  },
  {
    title: 'Allowed & Forbidden Client Mods',
    lead: 'Client mods that improve performance or visuals are welcome. Mods that give unfair advantages are not.',
    points: [
      '<strong>Allowed:</strong> Performance mods (Sodium, Lithium, Iris, OptiFine), shader packs, resource packs (non-X-Ray), inventory management (mouse tweaks), map mods (see below), chat mods, zoom mods (no increased reach)',
      '<strong>Minimap – Allowed:</strong> Surface mapping, own position, own waypoints, death points',
      '<strong>Minimap – Forbidden:</strong> Cave mode / underground mapping, entity radar, player tracking, structure finder, ore highlighting',
      '<strong>Forbidden:</strong> Mods that reveal caves, ores, or structures through terrain; mods that auto-click, auto-farm, or automate gameplay without active input; any mod providing combat or movement advantages',
      'Unsure about a mod? Ask staff before using it.',
    ],
    punish: '1st: warning + removal verification · 2nd: 3-day ban · Intentional abuse: same scale as Rule 7',
  },
];

export const newInS2 = [
  {
    title: 'Clan System',
    body: 'Clans have their own chat (<code>/cc</code>), bank, home point, claim territory, and shared chest. Ally with other clans or declare war — both require mutual consent. Roles: Leader · Manager · Member. Founding: 5,000 Coins.',
    tags: ['New in S2'],
  },
  {
    title: 'Coin Economy',
    body: 'Start with 500 Coins. Earn more through mob kills, playtime bonuses, jobs, and trading. Coins fund claim expansion beyond the free 500 blocks².',
    tags: ['New in S2'],
  },
  {
    title: 'Jobs System',
    body: 'Pick one of four jobs and earn Coins through your normal playstyle: <strong>Hunter</strong> (slay mobs), <strong>Miner</strong> (mine ores), <strong>Farmer</strong> (harvest crops), <strong>Woodcutter</strong> (chop trees). Use <code>/jobs browse</code>. Only one job at a time.',
    tags: ['New in S2', 'JobsReborn'],
  },
  {
    title: 'PvP Toggle System',
    body: 'Use <code>/pvp on</code> to enable. Disabling has a 24h cooldown. New players get 48h auto-protection. Spawn is always PvP-free.',
    tags: ['New in S2', 'PvPManager'],
  },
  {
    title: 'Custom World — Aerlon',
    body: 'Dense forests with ancient stone arches, towering cliffs, overgrown plazas, forgotten settlements, dark underground chambers. Procedurally generated with a custom world generator, fully pre-generated for lag-free exploration. Live BlueMap web map.',
    tags: ['New in S2', 'BlueMap'],
  },
  {
    title: 'RP Status System',
    body: 'Toggle with <code>/rp on</code>. Active RP players show <code>[RP]</code> in chat. Roleplay is always optional — nobody is forced.',
    tags: ['New in S2'],
  },
  {
    title: 'Flexible Region Claims',
    body: '<strong>Homestead</strong> replaces chunk-based claims. Define any region shape with 75+ permission flags. First 500 blocks² free, then costs Coins.',
    tags: ['Upgraded in S2', 'Homestead'],
  },
];

export const returning = [
  {
    title: 'Java & Bedrock Crossplay',
    body: 'Play together regardless of platform: Java or Bedrock (consoles, mobile, Windows 10/11). Geyser + Floodgate bridge both editions seamlessly.',
    tags: ['Returning'],
  },
  {
    title: 'One-Time Elytra at Spawn',
    body: 'Receive an Elytra at spawn to explore the world. Used once, then consumed. Keeps the start fair while still giving a special boost.',
    tags: ['Returning'],
  },
  {
    title: 'Chest & Block Protection',
    body: 'Secure chests, doors, and Redstone with a simple right-click. Nobody accesses your containers without explicit permission.',
    tags: ['Returning'],
  },
  {
    title: 'Voice Chat with 3D Audio',
    body: 'Spatial voice chat in-game. Hear exactly which direction other players are speaking from. (Java Edition only.)',
    tags: ['Returning'],
  },
  {
    title: 'Transparent Moderation',
    body: 'CoreProtect logs all block actions. AntiCheat results in a public Discord channel. BlueMap web map lets everyone explore live.',
    tags: ['Returning'],
  },
  {
    title: 'Whitelist System',
    body: 'Whitelist via Discord account link. No application form — connect Discord and Minecraft via the Baxi bot to get auto-whitelisted.',
    tags: ['Returning'],
  },
];

export const faq = [
  {
    q: 'Do I need a paid Minecraft account?',
    a: 'Yes — a legitimate Minecraft Java or Bedrock account. No cracked clients.',
  },
  {
    q: 'Can I play on console / mobile?',
    a: 'Yes. Bedrock Edition supports Windows 10/11, Xbox, PlayStation, Switch, iOS, Android.',
  },
  {
    q: 'Is there an application form?',
    a: 'No. Linking Discord + Minecraft via Baxi is all you need.',
  },
  {
    q: 'Can I get banned for the wrong mod?',
    a: 'See <a class="accent-link" href="#rules">Server Rules</a> — performance mods (Sodium, Iris, OptiFine), shaders, and surface minimaps are fine. X-Ray, cave-mode minimaps, entity radar, killaura etc. are banned.',
  },
];

export const backups = [
  { name: 'CraftAttack 1', size: '~17 GB', href: '/backups/craftattack1.tar.gz' },
  { name: 'CraftAttack 1.2', size: '~9 GB', href: '/backups/craftattack1.2.tar.gz' },
];

export const shots = [
  { n: 1, alt: 'The overgrown ruins of Aerlon — Craft Attack Season 2', cap: 'The overgrown ruins of Aerlon' },
  { n: 3, alt: 'The vast mountain ranges of Aerlon — Craft Attack Season 2', cap: 'The vast mountain ranges of Aerlon' },
  { n: 4, alt: 'Ancient columns in an overgrown plaza of Aerlon — Craft Attack', cap: 'Ancient columns stand in an overgrown plaza' },
  { n: 7, alt: 'A forgotten settlement of Aerlon behind weathered gates — Craft Attack', cap: 'A forgotten settlement behind a weathered wooden gate' },
  { n: 5, alt: 'Ancient ruins deep underground in Aerlon — Craft Attack', cap: 'Ancient ruins deep underground' },
  { n: 8, alt: 'Glowing underground structures in Aerlon — Craft Attack', cap: 'Ancient underground structures glowing in the dark' },
  { n: 9, alt: 'Aerial view of Aerlon with floating towers — Craft Attack', cap: 'Aerial view of Aerlon with floating towers and red-leafed forests' },
  { n: 10, alt: "Bird's-eye view of Aerlon island in misty ocean — Craft Attack", cap: 'Birds-eye view of the Aerlon island surrounded by misty ocean' },
  { n: 11, alt: 'Floating islands above misty Aerlon ruins at sunrise — Craft Attack', cap: 'Floating islands above misty ruins of Aerlon at sunrise' },
  { n: 12, alt: 'Floating islands over a misty river valley in Aerlon — Craft Attack', cap: 'Floating islands over a misty river valley in Aerlon' },
  { n: 13, alt: 'Red-leafed trees reflected in a golden Aerlon lake — Craft Attack', cap: 'Red-leafed trees reflected in a golden misty lake at dawn' },
  { n: 14, alt: 'Ancient pyramid in Aerlon desert at sunset — Craft Attack', cap: 'Ancient pyramid rising from the desert sands of Aerlon at sunset' },
  { n: 15, alt: 'Nether portal in crimson wastes — Craft Attack Aerlon', cap: 'Nether portal glowing purple in the misty crimson wastes' },
  { n: 16, alt: 'End city among purple auroras — Craft Attack Aerlon End', cap: 'End city floating among purple auroras and starlight' },
  { n: 17, alt: 'Glowing End ruins around a singularity — Craft Attack Aerlon', cap: 'Glowing End ruins surrounding a singularity in deep space' },
];
