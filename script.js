// Nexus Premium Interactions & Animations

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Entry Animations (Cinematic Reveal) ---
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Initial state setup
    gsap.set('aside, .dashboard-hero, .editor-panel, .terminal-panel, .ai-panel', { 
        opacity: 0, 
        y: 20,
        filter: 'blur(10px)'
    });

    // Sidebar reveal
    tl.to('aside', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
    })
    // Hero reveal
    .to('.dashboard-hero', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
    }, "-=0.8")
    // Editor and terminal reveal
    .to(['.editor-panel', '.terminal-panel'], {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.1
    }, "-=0.8")
    // AI Panel reveal
    .to('.ai-panel', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
    }, "-=0.8");

    // Title stagger animation
    gsap.from('.hero-title, .hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
    });

    // --- 2. Ambient Floating Particles (Space Vibe) ---
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        
        // Randomize particle type
        const colors = ['#00E5FF', '#8B5CF6', '#38BDF8', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 3 + 1; // 1px to 4px
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        particlesContainer.appendChild(particle);

        // Animate particle
        animateParticle(particle);
    }

    function animateParticle(particle) {
        const duration = Math.random() * 20 + 15; // 15 to 35 seconds
        const yOffset = (Math.random() - 0.5) * 200; // -100 to 100
        const xOffset = (Math.random() - 0.5) * 200;

        gsap.to(particle, {
            x: `+=${xOffset}`,
            y: `+=${yOffset}`,
            opacity: Math.random() * 0.3,
            duration: duration,
            ease: "sine.inOut",
            onComplete: () => {
                // Reset position slightly and animate again
                animateParticle(particle);
            }
        });
    }

    // --- 3. Magnetic Hover Effects on Stats / Buttons ---
    const magneticElements = document.querySelectorAll('.dashboard-hero .glass-panel-light, .logo-container');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.1,
                y: y * 0.1,
                rotationX: -y * 0.05,
                rotationY: x * 0.05,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 1000,
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                rotationX: 0,
                rotationY: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // --- 4. Interactive Chat & Model Selector ---
    const chatInput = document.querySelector('.group\\/input input');
    const chatButton = document.querySelector('.group\\/input button:last-child');
    const chatContainer = document.querySelector('.custom-scrollbar');
    
    // Model Selector Logic
    const modelSelectorBtn = document.getElementById('model-selector-btn');
    const modelDropdown = document.getElementById('model-dropdown');
    const modelOptions = document.querySelectorAll('.model-option');
    const currentModelName = document.getElementById('current-model-name');
    const modelStatusText = document.getElementById('model-status-text');
    const modelStatus = document.getElementById('model-status');
    const orbStatus = document.querySelector('.orb-status');
    const orbBg = document.querySelector('.orb-bg');
    const orbGlow = document.querySelector('.orb-glow');
    const orbCore = document.querySelector('.orb-core');
    
    let currentModel = 'pro';
    
    modelSelectorBtn.addEventListener('click', () => {
        const isExpanded = modelDropdown.classList.contains('opacity-100');
        if (isExpanded) {
            modelDropdown.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            modelDropdown.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
        } else {
            modelDropdown.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
            modelDropdown.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
        }
    });

    document.addEventListener('click', (e) => {
        if (!modelSelectorBtn.contains(e.target) && !modelDropdown.contains(e.target)) {
            modelDropdown.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            modelDropdown.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
        }
    });

    modelOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentModel = option.dataset.model;
            
            // Update UI styling
            modelOptions.forEach(opt => opt.classList.remove('bg-white/5'));
            option.classList.add('bg-white/5');
            
            // Reset colors
            const resetClasses = ['text-yellow-400', 'text-neon-purple', 'text-neon-cyan', 'bg-yellow-400', 'bg-neon-purple', 'bg-neon-cyan', 'bg-yellow-400/20', 'bg-neon-purple/20', 'bg-neon-cyan/20'];
            
            modelStatus.classList.remove(...resetClasses);
            orbStatus.classList.remove(...resetClasses);
            orbBg.classList.remove(...resetClasses);
            orbGlow.classList.remove(...resetClasses);
            
            if (currentModel === 'flash') {
                currentModelName.textContent = 'Atom 1.1 Flash';
                modelStatusText.textContent = 'Lightning Fast';
                modelStatus.classList.add('text-yellow-400');
                orbStatus.classList.add('bg-yellow-400');
                orbBg.classList.add('bg-yellow-400/20');
                orbGlow.classList.add('bg-yellow-400');
                orbCore.className = 'w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 blur-[2px] animate-spin orb-core transition-colors duration-500';
            } else if (currentModel === 'pro') {
                currentModelName.textContent = 'Atom 1.2 Pro';
                modelStatusText.textContent = 'Balanced';
                modelStatus.classList.add('text-neon-purple');
                orbStatus.classList.add('bg-neon-purple');
                orbBg.classList.add('bg-neon-purple/20');
                orbGlow.classList.add('bg-neon-purple');
                orbCore.className = 'w-6 h-6 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan blur-[2px] animate-spin orb-core transition-colors duration-500';
            } else if (currentModel === 'ultra') {
                currentModelName.textContent = 'Atom 1.3 Ultra';
                modelStatusText.textContent = 'Deep Thinking';
                modelStatus.classList.add('text-neon-cyan');
                orbStatus.classList.add('bg-neon-cyan');
                orbBg.classList.add('bg-neon-cyan/20');
                orbGlow.classList.add('bg-neon-cyan');
                orbCore.className = 'w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-blue-500 blur-[2px] animate-spin orb-core transition-colors duration-500';
            }
            
            modelDropdown.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            modelDropdown.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
        });
    });

    function addMessage(text, isUser = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-3 ${isUser ? 'flex-row-reverse user-message' : 'ai-message'} opacity-0 translate-y-4`;
        
        let aiColorClass = 'text-neon-purple';
        let aiBgClass = 'bg-neon-purple/20';
        let aiBorderClass = 'border-neon-purple/30';
        
        if (!isUser) {
            if (currentModel === 'flash') {
                aiColorClass = 'text-yellow-400';
                aiBgClass = 'bg-yellow-400/20';
                aiBorderClass = 'border-yellow-400/30';
            } else if (currentModel === 'ultra') {
                aiColorClass = 'text-neon-cyan';
                aiBgClass = 'bg-neon-cyan/20';
                aiBorderClass = 'border-neon-cyan/30';
            }
        }
        
        let innerHTML = '';
        if (isUser) {
            innerHTML = `
                <div class="w-8 h-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0 mt-1">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="User" class="w-full h-full object-cover"/>
                </div>
                <div class="bg-gradient-to-br from-space-700 to-space-800 p-3 rounded-2xl rounded-tr-sm text-sm text-gray-200 border border-white/10 shadow-lg">
                    ${text}
                </div>
            `;
        } else {
            innerHTML = `
                <div class="w-8 h-8 rounded-full ${aiBgClass} border ${aiBorderClass} flex items-center justify-center flex-shrink-0 mt-1 transition-colors duration-500">
                    <i class="ph-fill ph-magic-wand ${aiColorClass} text-sm transition-colors duration-500"></i>
                </div>
                <div class="glass-panel-light p-3 rounded-2xl rounded-tl-sm text-sm text-gray-200 border border-white/5 leading-relaxed">
                    ${text}
                </div>
            `;
        }
        
        msgDiv.innerHTML = innerHTML;
        
        const generatingMsg = document.querySelector('.ai-generating');
        if (generatingMsg) generatingMsg.remove();

        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        gsap.to(msgDiv, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)"
        });
    }

    function handleChatSubmit() {
        const val = chatInput.value.trim();
        if (!val) return;
        
        addMessage(val, true);
        chatInput.value = '';

        setTimeout(() => {
            let aiColorClass = 'text-neon-purple';
            let aiBgClass = 'bg-neon-purple/20';
            let aiBorderClass = 'border-neon-purple/30';
            let spinnerClass = 'border-t-neon-purple';
            
            if (currentModel === 'flash') {
                aiColorClass = 'text-yellow-400';
                aiBgClass = 'bg-yellow-400/20';
                aiBorderClass = 'border-yellow-400/30';
                spinnerClass = 'border-t-yellow-400';
            } else if (currentModel === 'ultra') {
                aiColorClass = 'text-neon-cyan';
                aiBgClass = 'bg-neon-cyan/20';
                aiBorderClass = 'border-neon-cyan/30';
                spinnerClass = 'border-t-neon-cyan';
            }

            const typingMsg = document.createElement('div');
            typingMsg.className = `flex gap-3 ai-message ai-generating opacity-0 translate-y-4`;
            typingMsg.innerHTML = `
                <div class="w-8 h-8 rounded-full ${aiBgClass} border ${aiBorderClass} flex items-center justify-center flex-shrink-0 mt-1 relative transition-colors duration-500">
                    <div class="absolute inset-0 rounded-full border-2 ${spinnerClass} border-r-transparent border-b-transparent border-l-transparent animate-spin transition-colors duration-500"></div>
                    <i class="ph-fill ph-sparkle ${aiColorClass} text-sm transition-colors duration-500"></i>
                </div>
                <div class="glass-panel-light p-3 rounded-2xl rounded-tl-sm text-sm text-gray-400 border border-white/5 italic flex items-center gap-2">
                    Atom is thinking...
                </div>
            `;
            chatContainer.appendChild(typingMsg);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            gsap.to(typingMsg, { opacity: 1, y: 0, duration: 0.4 });

            let delay = 2000;
            let responseText = "I've analyzed your request. I am generating the necessary components and integrating them into the dashboard now.";
            
            if (currentModel === 'flash') {
                delay = 500;
                responseText = "Done! I quickly drafted the layout you requested.";
            } else if (currentModel === 'ultra') {
                delay = 4000;
                responseText = "I have performed a deep architectural analysis of your request. I've engineered a highly optimized, fully responsive implementation and integrated it flawlessly into the broader system architecture.";
            }

            setTimeout(() => {
                addMessage(responseText, false);
            }, delay);
            
        }, 300);
    }

    chatButton.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    });

    // --- 5. Mouse Parallax on Background ---
    const heroBg = document.querySelector('.bg-hero-glow');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        if (heroBg) {
            gsap.to(heroBg, {
                x: x,
                y: y,
                duration: 1,
                ease: "power2.out"
            });
        }
    });

    // --- 6. View Navigation (SPA Logic) ---
    const navItems = document.querySelectorAll('.nav-item');
    const appViews = document.querySelectorAll('.app-view');

    // Function to switch view
    function switchView(targetId) {
        if (!targetId) return;

        // 1. Update Active state on sidebar
        navItems.forEach(nav => {
            const navTarget = nav.getAttribute('data-target');
            if (navTarget === targetId) {
                nav.classList.add('active');
                const indicator = nav.querySelector('.active-indicator');
                if (indicator) {
                    indicator.classList.remove('scale-y-0');
                    indicator.classList.add('scale-y-100');
                }
            } else if (navTarget) {
                nav.classList.remove('active');
                const indicator = nav.querySelector('.active-indicator');
                if (indicator) {
                    indicator.classList.remove('scale-y-100');
                    indicator.classList.add('scale-y-0');
                }
            }
        });

        // 2. Switch Views
        appViews.forEach(view => {
            if (view.id === `view-${targetId}`) {
                view.classList.remove('hidden');
                
                // Cinematic reveal for the view
                gsap.fromTo(view, 
                    { opacity: 0, y: 15, scale: 0.98 }, 
                    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
                );

                // If Chat view, stagger animate the messages with 3D effect
                if (targetId === 'chat') {
                    gsap.fromTo('#chat-messages-container > div',
                        { opacity: 0, y: 40, rotationX: -15, scale: 0.95 },
                        { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out", delay: 0.2, clearProps: "transform" }
                    );
                }
            } else {
                view.classList.add('hidden');
            }
        });
    }

    // Handle Clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('data-target');
            
            // If there's no data-target, allow default navigation (like the Back to Home button)
            if (!targetId) return;
            
            e.preventDefault();
            switchView(targetId);
        });
    });

    // Handle URL parameters on load
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam) {
        switchView(viewParam);
    }

    // --- 7. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const overlay = document.getElementById('theme-transition-overlay');

    if (themeToggle && overlay) {
        themeToggle.addEventListener('click', (e) => {
            const rect = themeToggle.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            const isDark = document.documentElement.classList.contains('dark');
            const nextTheme = isDark ? 'light' : 'dark';

            overlay.style.backgroundColor = isDark ? '#F8FAFC' : '#030508';
            overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
            
            // Set opacity to 1 before animating
            overlay.style.opacity = '1';
            
            gsap.to(overlay, {
                clipPath: `circle(${Math.max(window.innerWidth, window.innerHeight) * 2}px at ${x}px ${y}px)`,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    document.documentElement.classList.toggle('dark');
                    localStorage.setItem('theme', nextTheme);
                    
                    gsap.to(overlay, {
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.set(overlay, { clipPath: `circle(0px at ${x}px ${y}px)` });
                        }
                    });
                }
            });
        });
    }

    // --- 8. Outro Animation (Back to Home) ---
    const btnBackHome = document.getElementById('btn-back-home');
    if (btnBackHome) {
        btnBackHome.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.pointerEvents = 'none';

            // Create a dramatic exit
            const isDark = document.documentElement.classList.contains('dark');
            const exitOverlay = document.createElement('div');
            exitOverlay.style.position = 'fixed';
            exitOverlay.style.inset = '0';
            exitOverlay.style.backgroundColor = isDark ? '#05060A' : '#EEF2F7';
            exitOverlay.style.zIndex = '9999';
            exitOverlay.style.opacity = '0';
            document.body.appendChild(exitOverlay);

            // Animate panels shrinking back into the void
            gsap.to(['aside', '.app-view'], {
                scale: 0.9,
                opacity: 0,
                y: 50,
                filter: 'blur(20px)',
                duration: 0.8,
                ease: "power3.in"
            });

            // Fade in the transition overlay
            gsap.to(exitOverlay, {
                opacity: 1,
                duration: 0.6,
                delay: 0.4,
                onComplete: () => {
                    window.location.href = btnBackHome.getAttribute('href');
                }
            });
        });
    }
});
