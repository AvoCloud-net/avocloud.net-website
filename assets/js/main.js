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

// ── TYPEWRITER EFFECT FOR BAXI HERO ──
(function () {
    var typewriterEl = document.getElementById('typewriter-text');
    if (!typewriterEl) return;

    var words = [
        { text: 'moderation bot', delay: 2000 },
        { text: 'security bot', delay: 2000 },
        { text: 'welcome bot', delay: 2000 },
        { text: 'verification bot', delay: 2000 }
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
