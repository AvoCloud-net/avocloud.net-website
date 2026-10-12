import { useEffect, useRef, useState } from 'react';

/* Ported 1:1 from the old public/pwgen/index.html <script> block — same
   charset build order, same dash-grouping regex, same strength scoring. */

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%&*()+=[]{}|;:?';

interface Strength {
  label: string;
  className: string;
}

/* Uniform random index in [0, max) from the platform CSPRNG.

   This used to be `Math.floor(Math.random() * n)`. Math.random() is not a
   CSPRNG — V8 runs xorshift128+ and its internal state can be recovered from a
   modest run of outputs, which means the generated passwords were predictable
   in principle. For a password generator that is the whole ballgame.

   The rejection loop matters as much as the source: taking a raw 32-bit value
   modulo `max` biases every index below (2^32 % max) upward, so the low
   characters of the charset would be drawn slightly more often. Discarding the
   short tail of the range keeps the distribution flat. It retries with
   probability < 2^-22 for any charset this page can build, so it is not a
   practical loop. */
function randomIndex(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let v: number;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= limit);
  return v % max;
}

function getStrength(pw: string): Strength {
  let score = 0;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[\W_]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (pw.length <= 10) score--;

  if (score <= 3) return { label: 'Weak', className: 'pwgen-weak' };
  if (score === 4) return { label: 'Average', className: 'pwgen-medium' };
  if (score === 5) return { label: 'Strong', className: 'pwgen-strong' };
  return { label: 'Very Strong', className: 'pwgen-very-strong' };
}

export default function PwGen() {
  const [lengthStr, setLengthStr] = useState('15');
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [display, setDisplay] = useState('Your password will appear here...');
  const [isPlaceholder, setIsPlaceholder] = useState(true);
  const [strength, setStrength] = useState<Strength | null>(null);
  const [copied, setCopied] = useState(false);

  const currentPassword = useRef('');
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const lengthNum = parseInt(lengthStr, 10);
  const lengthInvalid = lengthStr !== '' && (Number.isNaN(lengthNum) || lengthNum < 5 || lengthNum > 50);

  function typeOut(text: string) {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setDisplay('');
    let i = 0;
    const step = () => {
      i++;
      setDisplay(text.slice(0, i));
      if (i < text.length) typingTimer.current = setTimeout(step, 25);
    };
    step();
  }

  function generate() {
    let len = parseInt(lengthStr, 10);
    if (len < 5) {
      len = 5;
      setLengthStr('5');
    } else if (len > 50) {
      len = 50;
      setLengthStr('50');
    }

    let charset = LOWER;
    if (uppercase) charset += UPPER;
    if (numbers) charset += DIGITS;
    if (symbols) charset += SYMBOLS;

    let raw = '';
    for (let i = 0; i < len; i++) {
      raw += charset[randomIndex(charset.length)];
    }

    const formatted = len > 5 ? raw.match(/.{1,5}/g)!.join('-') : raw;

    currentPassword.current = formatted;
    setIsPlaceholder(false);
    typeOut(formatted);
    setStrength(getStrength(formatted));
    setCopied(false);
  }

  function copy() {
    if (!currentPassword.current) return;
    navigator.clipboard.writeText(currentPassword.current).then(() => {
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 3000);
    });
  }

  return (
    <>
      <div className="section-label">GENERATOR</div>
      <div className="card pwgen-card">
        <span className="mk tl" />
        <span className="mk br" />

        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Password Generator
        </h3>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-1" htmlFor="pwgen-length">
            Length (5&ndash;50)
          </label>
          <input
            id="pwgen-length"
            type="number"
            min={5}
            max={50}
            inputMode="numeric"
            value={lengthStr}
            onChange={(e) => setLengthStr(e.target.value)}
            className={`pwgen-input${lengthInvalid ? ' pwgen-input-invalid' : ''}`}
          />
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="pwgen-checkbox" />
            Capital letters
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="pwgen-checkbox" />
            Numbers
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} className="pwgen-checkbox" />
            Special characters
          </label>
        </div>

        <button className="btn primary" onClick={generate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2H3v16h5v4l4-4h5l4-4V2z" />
          </svg>
          Generate
        </button>

        <div className="pwgen-output-row">
          <div className={`pwgen-output${isPlaceholder ? ' pwgen-output-placeholder' : ''}`}>{display}</div>
          <button className="btn pwgen-copy-btn" onClick={copy} title="Copy to clipboard" aria-label="Copy to clipboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        {strength && <div className={`pwgen-strength ${strength.className}`}>Strength: {strength.label}</div>}

        <div className="pwgen-copied" style={{ opacity: copied ? 1 : 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </div>

        <p className="pwgen-note">Avocloud.net &mdash; No passwords are stored or transmitted.</p>
      </div>

      <style>{`
        .pwgen-input {
          width: 7rem;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          background: transparent;
          color: var(--fg);
          border: 1px solid var(--line-strong);
          padding: 0.5rem 0.7rem;
        }
        .pwgen-input:focus { outline: none; border-color: var(--coral); }
        .pwgen-input-invalid { border-color: #ef4444; }
        .pwgen-checkbox { accent-color: var(--coral); width: 1rem; height: 1rem; }
        .pwgen-output-row { position: relative; display: flex; align-items: stretch; gap: 0.5rem; margin-top: 1.5rem; }
        .pwgen-output {
          flex: 1;
          min-height: 2.75rem;
          font-family: var(--font-mono);
          font-size: 0.95rem;
          word-break: break-all;
          display: flex;
          align-items: center;
          border: 1px solid var(--line);
          padding: 0.6rem 0.9rem;
          color: var(--fg);
        }
        .pwgen-output-placeholder { color: var(--muted); }
        .pwgen-copy-btn { padding: 0.6rem; flex-shrink: 0; }
        .pwgen-copy-btn svg { width: 1.1em; height: 1.1em; }
        .pwgen-strength { margin-top: 0.6rem; font-family: var(--font-mono); font-size: 0.82rem; }
        .pwgen-weak { color: #ef4444; }
        .pwgen-medium { color: #eab308; }
        .pwgen-strong { color: #22c55e; }
        .pwgen-very-strong { color: var(--coral); }
        .pwgen-copied {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #22c55e;
          transition: opacity 0.3s ease;
        }
        .pwgen-copied svg { width: 1em; height: 1em; }
        .pwgen-note { color: var(--muted); font-size: 0.75rem; margin-top: 1.5rem; }
      `}</style>
    </>
  );
}
