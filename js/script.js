document.getElementById('year').textContent = new Date().getFullYear();

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