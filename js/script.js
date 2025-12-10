document.getElementById('year').textContent = new Date().getFullYear();

(() => {
    const animated = Array.from(document.querySelectorAll('[data-animate]'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    animated.forEach((el, idx) => {
        const delay = parseFloat(el.dataset.delay ?? '')
            || Math.min(idx * 0.06, 0.4);
        el.style.transitionDelay = `${delay}s`;
    });

    if (prefersReducedMotion.matches) {
        animated.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px',
    });

    animated.forEach((el) => observer.observe(el));
})();

(() => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const success = document.getElementById('contact-success');
    const error = document.getElementById('contact-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultLabel = submitBtn?.textContent || 'Versturen';

    function toggleMessage(type) {
        if (success) success.style.display = type === 'success' ? 'block' : 'none';
        if (error) error.style.display = type === 'error' ? 'block' : 'none';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        toggleMessage(null);

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Versturen...';
        }

        const formData = new FormData(form);

        try {
            const resp = await fetch(form.getAttribute('action') || '/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });

            if (!resp.ok) throw new Error(`Bad status: ${resp.status}`);

            toggleMessage('success');
            form.reset();
        } catch (err) {
            console.error('Contact form submit failed', err);
            toggleMessage('error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = defaultLabel;
            }
        }
    });
})();

(() => {
    const el = document.querySelector(".brand");
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]()!@#$%^&*-_=+";

    const target = el.dataset.value || el.textContent;

    let rafId = null;
    let running = false;

    function scrambleOnce(toText) {
    cancelAnimationFrame(rafId);
    running = true;

    let i = 0;
    function tick() {
        const out = toText
        .split("")
        .map((ch, idx) => {
            if (ch === " ") return " ";
            if (idx < i) return toText[idx];
            return LETTERS[Math.floor(Math.random() * LETTERS.length)];
        })
        .join("");

        el.textContent = out;

        i += 0.15;

        if (i <= toText.length) {
        rafId = requestAnimationFrame(tick);
        } else {
        el.textContent = toText; 
        running = false;
        }
    }

    tick();
    }

    el.addEventListener("mouseenter", () => {
    if (!running) scrambleOnce(target);
    });

    el.style.willChange = "contents";
})();
