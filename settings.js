// ============================================================
// NEXUS AI — Settings Engine v1.0
// All settings persist via localStorage and apply instantly
// ============================================================

const NexusSettings = (() => {

    // ── Default Settings ──────────────────────────────────────
    const DEFAULTS = {
        theme:          'dark',       // 'dark' | 'light'
        accentColor:    'cyan',       // 'cyan' | 'purple' | 'blue' | 'green' | 'pink'
        animSpeed:      1,            // 0 = off, 0.5 = slow, 1 = normal, 2 = fast
        fontSize:       'md',         // 'sm' | 'md' | 'lg'
        glassBlur:      'md',         // 'off' | 'sm' | 'md' | 'lg'
        particles:      true,         // boolean
        compactMode:    false,        // boolean
        reduceMotion:   false,        // boolean
        soundFX:        false,        // boolean (placeholder – ready for audio integration)
    };

    // ── Accent Color Map ──────────────────────────────────────
    const ACCENTS = {
        cyan:   { hex: '#00E5FF', shadow: 'rgba(0,229,255,0.4)',   rgb: '0,229,255'   },
        purple: { hex: '#8B5CF6', shadow: 'rgba(139,92,246,0.4)',  rgb: '139,92,246'  },
        blue:   { hex: '#38BDF8', shadow: 'rgba(56,189,248,0.4)',  rgb: '56,189,248'  },
        green:  { hex: '#22D3EE', shadow: 'rgba(34,211,238,0.4)',  rgb: '34,211,238'  },
        pink:   { hex: '#F472B6', shadow: 'rgba(244,114,182,0.4)', rgb: '244,114,182' },
    };

    const FONT_SIZES = { sm: '13px', md: '15px', lg: '17px' };
    const BLUR_VALUES = { off: '0px', sm: '8px', md: '16px', lg: '28px' };

    // ── Load from localStorage ─────────────────────────────────
    let current = { ...DEFAULTS };
    try {
        const saved = JSON.parse(localStorage.getItem('nexus-settings') || '{}');
        current = { ...DEFAULTS, ...saved };
    } catch(e) {}

    // ── Save to localStorage ──────────────────────────────────
    function save() {
        localStorage.setItem('nexus-settings', JSON.stringify(current));
    }

    // ── Apply all settings to the DOM ─────────────────────────
    function applyAll() {
        applyTheme();
        applyAccent();
        applyFontSize();
        applyBlur();
        applyCompactMode();
        applyReduceMotion();
        applyAnimSpeed();
        applyParticles();
    }

    function applyTheme() {
        if (current.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', current.theme);
    }

    function applyAccent() {
        const a = ACCENTS[current.accentColor] || ACCENTS.cyan;
        const root = document.documentElement;
        root.style.setProperty('--accent-hex',    a.hex);
        root.style.setProperty('--accent-shadow', a.shadow);
        root.style.setProperty('--accent-rgb',    a.rgb);

        // Update Tailwind-generated neon-cyan usages dynamically
        // We inject/update a <style> tag in <head>
        let styleTag = document.getElementById('nexus-accent-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'nexus-accent-style';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = `
            :root {
                --nexus-accent: ${a.hex};
                --nexus-accent-shadow: ${a.shadow};
                --nexus-accent-rgb: ${a.rgb};
            }
            /* Override neon-cyan with accent color */
            .text-neon-cyan { color: var(--nexus-accent) !important; }
            .bg-neon-cyan { background-color: var(--nexus-accent) !important; }
            .border-neon-cyan { border-color: var(--nexus-accent) !important; }
            .shadow-\\[0_0_10px_rgba\\(0\\,229\\,255\\,1\\)\\] { box-shadow: 0 0 10px var(--nexus-accent) !important; }
            .shadow-\\[0_0_30px_rgba\\(0\\,229\\,255\\,0\\.3\\)\\] { box-shadow: 0 0 30px var(--nexus-accent-shadow) !important; }
            [class*="from-neon-cyan"] { --tw-gradient-from: var(--nexus-accent) !important; }
            [class*="text-neon-cyan"] { color: var(--nexus-accent) !important; }
            .active-indicator { background-color: var(--nexus-accent) !important; }
            #pwa-install-btn { color: var(--nexus-accent) !important; border-color: var(--nexus-accent) !important; }
        `;
    }

    function applyFontSize() {
        const px = FONT_SIZES[current.fontSize] || FONT_SIZES.md;
        document.documentElement.style.setProperty('--nexus-font-size', px);
        document.body.style.fontSize = px;
    }

    function applyBlur() {
        const blur = BLUR_VALUES[current.glassBlur] || BLUR_VALUES.md;
        document.documentElement.style.setProperty('--nexus-blur', blur);
        // Apply to all glass elements
        let blurStyle = document.getElementById('nexus-blur-style');
        if (!blurStyle) {
            blurStyle = document.createElement('style');
            blurStyle.id = 'nexus-blur-style';
            document.head.appendChild(blurStyle);
        }
        blurStyle.textContent = `.glass-card, .glass-panel, .glass-btn {
            backdrop-filter: blur(${blur}) !important;
            -webkit-backdrop-filter: blur(${blur}) !important;
        }`;
    }

    function applyCompactMode() {
        if (current.compactMode) {
            document.body.classList.add('nexus-compact');
        } else {
            document.body.classList.remove('nexus-compact');
        }
        // Inject compact style
        let compactStyle = document.getElementById('nexus-compact-style');
        if (!compactStyle) {
            compactStyle = document.createElement('style');
            compactStyle.id = 'nexus-compact-style';
            document.head.appendChild(compactStyle);
        }
        compactStyle.textContent = current.compactMode ? `
            .nexus-compact .glass-card { padding: 1rem !important; }
            .nexus-compact main { padding: 0.5rem !important; }
            .nexus-compact header { padding: 0.75rem 1rem !important; height: auto !important; }
            .nexus-compact h1 { font-size: 2rem !important; }
        ` : '';
    }

    function applyReduceMotion() {
        if (current.reduceMotion) {
            document.documentElement.classList.add('nexus-no-motion');
            if (window.gsap) gsap.globalTimeline.timeScale(0.001);
        } else {
            document.documentElement.classList.remove('nexus-no-motion');
            if (window.gsap) gsap.globalTimeline.timeScale(current.animSpeed);
        }
        let motionStyle = document.getElementById('nexus-motion-style');
        if (!motionStyle) {
            motionStyle = document.createElement('style');
            motionStyle.id = 'nexus-motion-style';
            document.head.appendChild(motionStyle);
        }
        motionStyle.textContent = current.reduceMotion ? `
            .nexus-no-motion *, .nexus-no-motion *::before, .nexus-no-motion *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        ` : '';
    }

    function applyAnimSpeed() {
        if (current.reduceMotion) return;
        if (window.gsap) {
            gsap.globalTimeline.timeScale(current.animSpeed === 0 ? 0.001 : current.animSpeed);
        }
    }

    function applyParticles() {
        // The Three.js canvas visibility
        const canvas = document.getElementById('webgl-canvas') || document.getElementById('particles');
        if (canvas) {
            canvas.style.opacity = current.particles ? '1' : '0';
            canvas.style.pointerEvents = current.particles ? 'none' : 'none';
        }
    }

    // ── Public API ────────────────────────────────────────────
    function set(key, value) {
        current[key] = value;
        save();
        // Apply the specific setting
        switch(key) {
            case 'theme':        applyTheme();       break;
            case 'accentColor':  applyAccent();      break;
            case 'fontSize':     applyFontSize();    break;
            case 'glassBlur':    applyBlur();        break;
            case 'compactMode':  applyCompactMode(); break;
            case 'reduceMotion': applyReduceMotion(); break;
            case 'animSpeed':    applyAnimSpeed();   break;
            case 'particles':    applyParticles();   break;
        }
    }

    function get(key) { return current[key]; }
    function getAll() { return { ...current }; }

    // ── Init: apply on load ───────────────────────────────────
    function init() {
        applyAll();
        console.log('[Nexus Settings] Loaded:', current);
    }

    return { init, set, get, getAll, ACCENTS, DEFAULTS };
})();

// Auto-init as soon as this script loads
NexusSettings.init();
