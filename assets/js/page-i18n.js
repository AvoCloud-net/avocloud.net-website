// Reusable i18n + lang toggle for subpages
(function (global) {
    function setMeta(selector, attr, value) {
        var el = document.querySelector(selector);
        if (el) el.setAttribute(attr, value);
    }

    global.setupI18n = function (data, seo) {
        function apply(lang) {
            var s = (seo && seo[lang]) || (seo && seo.en);
            if (s) {
                document.title = s.title;
                setMeta('meta[name="description"]', 'content', s.description);
                setMeta('meta[property="og:title"]', 'content', s.title);
                setMeta('meta[property="og:description"]', 'content', s.description);
                setMeta('meta[property="og:locale"]', 'content', lang === 'de' ? 'de_DE' : 'en_US');
                setMeta('meta[property="og:locale:alternate"]', 'content', lang === 'de' ? 'en_US' : 'de_DE');
                setMeta('meta[name="twitter:title"]', 'content', s.title);
                setMeta('meta[name="twitter:description"]', 'content', s.description);
            }
            document.querySelectorAll('[data-i18n]').forEach(function (el) {
                var k = el.getAttribute('data-i18n');
                if (data[lang] && data[lang][k] !== undefined) el.textContent = data[lang][k];
            });
            document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
                var k = el.getAttribute('data-i18n-html');
                if (data[lang] && data[lang][k] !== undefined) el.innerHTML = data[lang][k];
            });
            var btn = document.getElementById('lang-btn');
            if (btn) {
                btn.textContent = lang === 'en' ? 'DE' : 'EN';
                btn.title = lang === 'en' ? 'Auf Deutsch wechseln' : 'Switch to English';
            }
            document.documentElement.lang = lang === 'en' ? 'en' : 'de';
            localStorage.setItem('avo-lang', lang);
        }

        global.toggleLang = function () {
            var c = localStorage.getItem('avo-lang') || 'en';
            apply(c === 'en' ? 'de' : 'en');
        };

        document.addEventListener('DOMContentLoaded', function () {
            var u = new URLSearchParams(location.search).get('lang');
            var i = (u === 'de' || u === 'en') ? u : (localStorage.getItem('avo-lang') || 'en');
            apply(i);
        });
    };
})(window);
