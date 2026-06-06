// ── AVOCLOUD LOGO: SVG typewriter draw-on + hover expand ──
function runTypewriterSVG(pathEl, durationMs, onDone) {
    pathEl.style.transition       = 'none';
    pathEl.style.strokeDasharray  = '200';
    pathEl.style.strokeDashoffset = '200';
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            pathEl.style.transition       = 'stroke-dashoffset ' + durationMs + 'ms cubic-bezier(0.4,0,0.2,1)';
            pathEl.style.strokeDashoffset = '0';
            setTimeout(function () {
                pathEl.style.transition       = '';
                pathEl.style.strokeDasharray  = '';
                pathEl.style.strokeDashoffset = '';
                if (onDone) onDone();
            }, durationMs);
        });
    });
}

document.querySelectorAll('.avocloud-logo').forEach(function (logo) {
    var icon     = logo.querySelector('.avocloud-logo__icon');
    var av       = logo.querySelector('.avocloud-logo__av');
    var restWrap = logo.querySelector('.avocloud-logo__rest-wrap');
    var rest     = logo.querySelector('.avocloud-logo__rest');
    var path     = logo.querySelector('path');
    if (!icon || !av || !restWrap || !rest || !path) return;

    var expanded = false, locked = false;

    function expand() {
        if (expanded || locked) return;
        expanded = true;
        restWrap.style.maxWidth = '600px';
        rest.style.transform    = 'translateX(0)';
        rest.style.opacity      = '1';
        icon.style.opacity      = '0';
        icon.style.transform    = 'translateX(-12px)';
        av.style.opacity        = '1';
        av.style.transform      = 'translateX(0)';
    }

    function collapse() {
        if (!expanded || locked) return;
        expanded = false;
        locked   = true;
        av.style.opacity        = '0';
        av.style.transform      = 'translateX(8px)';
        restWrap.style.maxWidth = '0';
        rest.style.transform    = 'translateX(20px)';
        rest.style.opacity      = '0';
        setTimeout(function () {
            icon.style.transition = 'none';
            icon.style.opacity    = '1';
            icon.style.transform  = 'translateX(0)';
            void icon.getBoundingClientRect();
            runTypewriterSVG(path, 580, function () {
                icon.style.transition = '';
                locked = false;
            });
        }, 250);
    }

    logo.addEventListener('mouseenter', expand);
    logo.addEventListener('mouseleave', collapse);
    logo.addEventListener('focus',      expand);
    logo.addEventListener('blur',       collapse);
});

// ── HERO WORDMARK INTRO ANIMATION ──
(function () {
    var intro = document.getElementById('hero-intro');
    if (!intro) return;

    var path = intro.querySelector('.hi-path');
    var icon = intro.querySelector('.hi-icon');
    var av   = intro.querySelector('.hi-av');
    var wrap = intro.querySelector('.hi-text-wrap');
    var text = intro.querySelector('.hi-text');

    function play() {
        // Phase 1: typewriter SVG draw (1400ms)
        path.style.transition       = 'none';
        path.style.strokeDasharray  = '200';
        path.style.strokeDashoffset = '200';
        void path.getBoundingClientRect();
        path.style.transition       = 'stroke-dashoffset 1400ms cubic-bezier(0.4, 0, 0.2, 1)';
        path.style.strokeDashoffset = '0';

        // Phase 2: icon slides out, AV fades in (at 1500ms)
        setTimeout(function () {
            icon.style.opacity   = '0';
            icon.style.transform = 'translateX(-10px)';
            av.style.opacity     = '1';
            av.style.transform   = 'translateX(0)';

            // Phase 3: OCLOUD.NET slides in (500ms later)
            setTimeout(function () {
                wrap.style.maxWidth  = '100vw';
                text.style.opacity   = '1';
                text.style.transform = 'translateX(0)';
            }, 500);
        }, 1500);
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { setTimeout(play, 200); });
    } else {
        setTimeout(play, 400);
    }
}());

// Smooth scroll on scroll-indicator click
var scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
        var target = document.querySelector('main, #about');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }
    });
}

// Copy avocloud.net URL to clipboard
function copyToClipboard() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('https://avocloud.net');
    } else {
        var tempInput = document.createElement('input');
        tempInput.value = 'https://avocloud.net';
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
}

// ── PAGE NAVIGATION (hamburger + active section tracking) ──
(function () {
    var hamburger  = document.getElementById('nav-hamburger');
    var mobileMenu = document.getElementById('nav-mobile-menu');
    var siteNav    = document.getElementById('site-nav');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('.nav-mobile-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Keep mobile menu below the nav even if nav height changes
    function syncMenuTop() {
        if (siteNav) mobileMenu.style.top = siteNav.offsetHeight + 'px';
    }
    syncMenuTop();
    window.addEventListener('resize', syncMenuTop);

    // Active section highlighting
    var sections  = document.querySelectorAll('section[id]');
    var allLinks  = document.querySelectorAll('.nav-link, .nav-mobile-link');

    if ('IntersectionObserver' in window && sections.length) {
        var currentId = null;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    currentId = entry.target.id;
                    allLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
                    });
                }
            });
        }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

        sections.forEach(function (s) { observer.observe(s); });
    }
}());

// ── TYPEWRITER EFFECT FOR BAXI HERO ──
(function () {
    var typewriterEl = document.getElementById('typewriter-text');
    if (!typewriterEl) return;

    var words = [
        { text: 'moderation bot', delay: 2000 },
        { text: 'security bot', delay: 2000 },
        { text: 'welcome bot', delay: 2000 },
        { text: 'verification bot', delay: 2000 },
        { text: 'Twitch tracking bot', delay: 2000 }
    ];

    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var currentText = '';

    function type() {
        var currentWord = words[wordIndex];
        
        if (isDeleting) {
            currentText = currentWord.text.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentWord.text.substring(0, charIndex + 1);
            charIndex++;
        }

        typewriterEl.textContent = currentText;

        var typeSpeed = isDeleting ? 50 : 100;
        var pauseTime = 0;

        if (!isDeleting && charIndex === currentWord.text.length) {
            pauseTime = currentWord.delay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            pauseTime = 500;
        }

        setTimeout(function () {
            type();
        }, pauseTime || typeSpeed);
    }

    // Start the typewriter effect
    setTimeout(type, 500);
}());

// ── HERO ASCII BLOB BACKGROUND ──
(function () {
    var canvas = document.getElementById('hero-ascii-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var CHARS     = '0123456789abcdef#@+.-=*:%';
    var PALETTES = {
        // avocloud coral ramp (coral-500/600/700/400/300)
        default: ['255,107,74', '237,83,51', '199,61,32', '255,122,92', '255,147,121'],
        yellow:  ['255,122,92', '255,107,74', '199,61,32', '255,147,121', '255,107,74']
    };
    var _pal = PALETTES[canvas.dataset.palette] || PALETTES.default;
    var COLORS_DARK  = _pal;
    var COLORS_LIGHT = _pal;
    var cols, rows, grid, CELL;
    var blobs    = [];
    var mouse    = { x: -9999, y: -9999 };
    var rafId    = null;
    var active   = false;

    function numBlobs(w) { return w < 600 ? 3 : w < 1024 ? 4 : 5; }

    function mkBlob(w, h, idx) {
        var minDim = Math.min(w, h);
        var r   = minDim * (0.28 + Math.random() * 0.20);
        var spd = 0.9 + Math.random() * 1.1;
        var ang = Math.random() * Math.PI * 2;
        return {
            x:   Math.random() * w,
            y:   Math.random() * h,
            vx:  Math.cos(ang) * spd,
            vy:  Math.sin(ang) * spd,
            r:   r,
            col: idx % COLORS_DARK.length
        };
    }

    function resize() {
        canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
        canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
        CELL  = canvas.width < 600 ? 18 : 16;
        cols  = Math.ceil(canvas.width  / CELL) + 1;
        rows  = Math.ceil(canvas.height / CELL) + 1;
        grid  = [];
        for (var c = 0; c < cols; c++) {
            grid[c] = [];
            for (var r = 0; r < rows; r++) {
                grid[c][r] = CHARS[Math.floor(Math.random() * CHARS.length)];
            }
        }
        blobs = [];
        var nb = numBlobs(canvas.width);
        for (var i = 0; i < nb; i++) {
            blobs.push(mkBlob(canvas.width, canvas.height, i));
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '13px monospace';
        var dark   = document.documentElement.classList.contains('dark');
        var palette = dark ? COLORS_DARK : COLORS_LIGHT;
        var W = canvas.width, H = canvas.height;

        for (var b = 0; b < blobs.length; b++) {
            var bl = blobs[b];

            // random walk nudge each frame
            bl.vx += (Math.random() - 0.5) * 0.08;
            bl.vy += (Math.random() - 0.5) * 0.08;

            // mouse attraction — pull toward cursor with soft spring
            var mdx = mouse.x - bl.x, mdy = mouse.y - bl.y;
            var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 600 && mdist > 1) {
                bl.vx += (mdx / mdist) * 0.18;
                bl.vy += (mdy / mdist) * 0.18;
            }

            // speed cap
            var spd = Math.sqrt(bl.vx * bl.vx + bl.vy * bl.vy);
            if (spd > 2.8) { bl.vx = bl.vx / spd * 2.8; bl.vy = bl.vy / spd * 2.8; }
            if (spd < 0.5) { bl.vx *= 1.2; bl.vy *= 1.2; }

            bl.x += bl.vx;
            bl.y += bl.vy;

            // bounce
            if (bl.x < 0)  { bl.vx =  Math.abs(bl.vx); bl.x = 0; }
            if (bl.x > W)  { bl.vx = -Math.abs(bl.vx); bl.x = W; }
            if (bl.y < 0)  { bl.vy =  Math.abs(bl.vy); bl.y = 0; }
            if (bl.y > H)  { bl.vy = -Math.abs(bl.vy); bl.y = H; }
        }

        // draw chars per cell — blend colors from contributing blobs
        for (var c = 0; c < cols; c++) {
            for (var r = 0; r < rows; r++) {
                var px = c * CELL + CELL / 2;
                var py = r * CELL + CELL / 2;

                var totalInf = 0;
                var rSum = 0, gSum = 0, bSum = 0;

                for (var b = 0; b < blobs.length; b++) {
                    var bl = blobs[b];
                    var dx = px - bl.x, dy = py - bl.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var f = 1 - dist / bl.r;
                    if (f <= 0) continue;
                    var w = f * f;
                    totalInf += w;
                    var rgb = palette[bl.col].split(',');
                    rSum += parseInt(rgb[0]) * w;
                    gSum += parseInt(rgb[1]) * w;
                    bSum += parseInt(rgb[2]) * w;
                }

                if (totalInf < 0.04) continue;
                totalInf = totalInf > 1 ? 1 : totalInf;

                if (Math.random() < 0.015 + totalInf * 0.02) {
                    grid[c][r] = CHARS[Math.floor(Math.random() * CHARS.length)];
                }

                var alpha = totalInf * (dark ? 0.55 : 0.70);
                var ri = Math.round(rSum / totalInf);
                var gi = Math.round(gSum / totalInf);
                var bi = Math.round(bSum / totalInf);
                ctx.fillStyle = 'rgba(' + ri + ',' + gi + ',' + bi + ',' + alpha + ')';
                ctx.fillText(grid[c][r], c * CELL, r * CELL + 13);
            }
        }
    }

    function loop() {
        if (!active) return;
        draw();
        rafId = requestAnimationFrame(loop);
    }

    function start() {
        if (active) return;
        active = true;
        loop();
    }

    function stop() {
        active = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    var hero = canvas.closest ? canvas.closest('.hero') : canvas.parentElement;
    if ('IntersectionObserver' in window && hero) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
        }, { threshold: 0 });
        io.observe(hero);
    } else {
        start();
    }

    // track pointer (mouse + touch) relative to canvas
    function setMouse(cx, cy) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = cx - rect.left;
        mouse.y = cy - rect.top;
    }
    (hero || window).addEventListener('mousemove', function (e) { setMouse(e.clientX, e.clientY); });
    (hero || window).addEventListener('mouseleave', function () { mouse.x = -9999; mouse.y = -9999; });
    canvas.addEventListener('touchmove', function (e) {
        if (e.touches.length) setMouse(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    canvas.addEventListener('touchend', function () { mouse.x = -9999; mouse.y = -9999; });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    resize();
    start();
}());

// ── ASCII STYLE SYSTEM ──
(function () {
    if (!document.body.hasAttribute('data-ascii')) return;
    var CHARS   = '0123456789abcdef#@+.-=*:%';
    var PALETTE = ['255,107,74', '237,83,51', '199,61,32'];

    function makeCardCanvas(card) {
        var canvas = document.createElement('canvas');
        canvas.className = 'card-ascii-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        card.insertBefore(canvas, card.firstChild);

        var ctx    = canvas.getContext('2d');
        var CELL   = 14;
        var cols, rows, grid, blobs, rafId, active = false;

        function resize() {
            canvas.width  = card.offsetWidth  || 200;
            canvas.height = card.offsetHeight || 100;
            cols  = Math.ceil(canvas.width  / CELL) + 1;
            rows  = Math.ceil(canvas.height / CELL) + 1;
            grid  = [];
            for (var c = 0; c < cols; c++) {
                grid[c] = [];
                for (var r = 0; r < rows; r++) {
                    grid[c][r] = CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }
            blobs = [];
            var nb = Math.max(1, Math.round(canvas.width / 180));
            for (var i = 0; i < nb; i++) {
                var minDim = Math.min(canvas.width, canvas.height);
                var ang = Math.random() * Math.PI * 2;
                var spd = 0.8 + Math.random() * 0.9;
                blobs.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.cos(ang) * spd,
                    vy: Math.sin(ang) * spd,
                    r:  minDim * (0.45 + Math.random() * 0.3),
                    col: i % PALETTE.length
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '12px monospace';
            var W = canvas.width, H = canvas.height;
            var dark = document.documentElement.classList.contains('dark');

            for (var b = 0; b < blobs.length; b++) {
                var bl = blobs[b];
                bl.vx += (Math.random() - 0.5) * 0.1;
                bl.vy += (Math.random() - 0.5) * 0.1;
                var spd = Math.sqrt(bl.vx * bl.vx + bl.vy * bl.vy);
                if (spd > 2.2) { bl.vx = bl.vx / spd * 2.2; bl.vy = bl.vy / spd * 2.2; }
                if (spd < 0.4) { bl.vx *= 1.3; bl.vy *= 1.3; }
                bl.x += bl.vx; bl.y += bl.vy;
                if (bl.x < 0) { bl.vx =  Math.abs(bl.vx); bl.x = 0; }
                if (bl.x > W) { bl.vx = -Math.abs(bl.vx); bl.x = W; }
                if (bl.y < 0) { bl.vy =  Math.abs(bl.vy); bl.y = 0; }
                if (bl.y > H) { bl.vy = -Math.abs(bl.vy); bl.y = H; }
            }

            for (var c = 0; c < cols; c++) {
                for (var r = 0; r < rows; r++) {
                    var px = c * CELL + CELL / 2, py = r * CELL + CELL / 2;
                    var totalInf = 0, rS = 0, gS = 0, bS = 0;
                    for (var b = 0; b < blobs.length; b++) {
                        var bl = blobs[b];
                        var dx = px - bl.x, dy = py - bl.y;
                        var f  = 1 - Math.sqrt(dx * dx + dy * dy) / bl.r;
                        if (f <= 0) continue;
                        var w = f * f;
                        totalInf += w;
                        var rgb = PALETTE[bl.col].split(',');
                        rS += parseInt(rgb[0]) * w;
                        gS += parseInt(rgb[1]) * w;
                        bS += parseInt(rgb[2]) * w;
                    }
                    if (totalInf < 0.04) continue;
                    if (totalInf > 1) totalInf = 1;
                    if (Math.random() < 0.02 + totalInf * 0.03) {
                        grid[c][r] = CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                    var alpha = totalInf * (dark ? 0.65 : 0.75);
                    ctx.fillStyle = 'rgba(' + Math.round(rS/totalInf) + ',' + Math.round(gS/totalInf) + ',' + Math.round(bS/totalInf) + ',' + alpha + ')';
                    ctx.fillText(grid[c][r], c * CELL, r * CELL + 12);
                }
            }
        }

        function loop() { if (!active) return; draw(); rafId = requestAnimationFrame(loop); }

        var glitchTimer = null;
        var glitchSpan  = document.createElement('span');
        glitchSpan.className = 'card-glitch-char';
        glitchSpan.setAttribute('aria-hidden', 'true');
        glitchSpan.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        card.appendChild(glitchSpan);

        card.addEventListener('mouseenter', function () {
            resize();
            canvas.style.opacity = '1';
            active = true;
            loop();
            function cycleGlitch() {
                glitchSpan.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
                glitchTimer = setTimeout(cycleGlitch, 80);
            }
            cycleGlitch();
        });
        card.addEventListener('mouseleave', function () {
            canvas.style.opacity = '0';
            active = false;
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            clearTimeout(glitchTimer); glitchTimer = null;
        });
    }

    document.querySelectorAll('.card-hover').forEach(function (card) {
        card.style.position = 'relative';
        makeCardCanvas(card);
    });

    // Scramble-reveal with left→right color wave
    var SCHARS      = '0123456789abcdef#@*%+-=';
    var WAVE_COLORS = ['#FF6B4A', '#ED5333', '#C73D20'];

    function scrambleReveal(el, colored) {
        var final   = el.textContent;
        if (!final.trim()) return;
        var chars   = final.split('');
        var fontFam = colored ? window.getComputedStyle(el).fontFamily : null;

        if (colored) {
            // Wave-based: single left→right sweep, color progresses once through palette
            var spans = [];
            el.innerHTML = '';
            chars.forEach(function (ch) {
                var s = document.createElement('span');
                s.style.display    = 'inline';
                s.style.fontFamily = fontFam;
                s.textContent = ch;
                el.appendChild(s);
                spans.push(s);
            });

            var wavePos   = 0;
            var waveWidth = 5;
            var speed     = 0.7;

            var timer = setInterval(function () {
                wavePos += speed;
                for (var i = 0; i < chars.length; i++) {
                    var s    = spans[i];
                    var dist = wavePos - i;
                    if (dist > waveWidth) {
                        s.textContent = chars[i];
                        s.style.color = '';
                    } else if (dist >= 0) {
                        s.textContent = chars[i] === ' ' ? ' ' : SCHARS[Math.floor(Math.random() * SCHARS.length)];
                        var progress  = Math.min(wavePos / Math.max(chars.length, 1), 1);
                        var ci        = Math.min(Math.floor(progress * WAVE_COLORS.length), WAVE_COLORS.length - 1);
                        s.style.color = WAVE_COLORS[ci];
                    } else {
                        s.textContent = chars[i] === ' ' ? ' ' : SCHARS[Math.floor(Math.random() * SCHARS.length)];
                        s.style.color = 'rgba(255,107,74,0.25)';
                    }
                }
                if (wavePos > chars.length + waveWidth) {
                    clearInterval(timer);
                    el.textContent = final;
                }
            }, 45);

        } else {
            // Plain scramble for section labels
            var locked = 0, tick = 0;
            var timer = setInterval(function () {
                tick++;
                if (tick % 2 === 0) locked++;
                var out = '';
                for (var i = 0; i < chars.length; i++) {
                    out += (i < locked || chars[i] === ' ')
                        ? chars[i]
                        : SCHARS[Math.floor(Math.random() * SCHARS.length)];
                }
                el.textContent = out;
                if (locked >= chars.length) { clearInterval(timer); el.textContent = final; }
            }, 35);
        }
    }

    function observeScramble(el, colored) {
        if (!('IntersectionObserver' in window)) { return; }
        var fired = false;
        var obs = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !fired) {
                fired = true;
                obs.disconnect();
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        scrambleReveal(el, colored);
                    });
                });
            }
        }, { threshold: 0.4 });
        setTimeout(function () { obs.observe(el); }, 120);
    }

    document.querySelectorAll('.section-label').forEach(function (el) {
        observeScramble(el, false);
    });

    var mainEl = document.querySelector('main');
    if (mainEl) {
        mainEl.querySelectorAll('h2').forEach(function (el) {
            observeScramble(el, true);
        });
    }

    // ASCII section dividers — inject before each <section> inside <main>, animate on scroll
    if (!mainEl) return;

    var sections = mainEl.querySelectorAll('section');
    var DASH = '─', DOT = '·';

    sections.forEach(function (section, idx) {
        var id = section.id || ('s' + idx);
        var label = ' [' + id + '] ';
        var half = '';
        for (var i = 0; i < 38; i++) half += DASH;
        var line = DOT + DASH + half + label + half + DASH + DOT;

        var div = document.createElement('div');
        div.className = 'ascii-divider';
        div.setAttribute('aria-hidden', 'true');
        div.textContent = line;
        mainEl.insertBefore(div, section);

        if ('IntersectionObserver' in window) {
            var once = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    once.disconnect();
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            div.classList.add('ascii-visible');
                        });
                    });
                }
            }, { threshold: 0.1 });
            // Delay initial observation so first-paint elements still animate
            setTimeout(function () { once.observe(div); }, 100);
        } else {
            div.classList.add('ascii-visible');
        }
    });
}());
