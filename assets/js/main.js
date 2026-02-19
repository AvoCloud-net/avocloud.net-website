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
