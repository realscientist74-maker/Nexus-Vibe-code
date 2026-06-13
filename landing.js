// landing.js - Ultra Premium 3D Interaction & Logic

document.addEventListener('DOMContentLoaded', () => {

    // --- Sidebar Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const slideSidebar = document.getElementById('slide-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarFeaturesLink = document.getElementById('sidebar-features-link');

    function openSidebar() {
        slideSidebar.classList.remove('-translate-x-full');
        slideSidebar.classList.add('translate-x-0');
        sidebarOverlay.classList.remove('opacity-0', 'pointer-events-none');
        sidebarOverlay.classList.add('opacity-100', 'pointer-events-auto');

        gsap.to('.sidebar-link', {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
        });
    }

    function closeSidebarMenu() {
        slideSidebar.classList.remove('translate-x-0');
        slideSidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.remove('opacity-100', 'pointer-events-auto');
        sidebarOverlay.classList.add('opacity-0', 'pointer-events-none');

        gsap.to('.sidebar-link', {
            opacity: 0,
            x: -16,
            duration: 0.3,
            ease: "power2.in"
        });
    }

    if (menuToggle) menuToggle.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebarMenu);
    if (sidebarFeaturesLink) sidebarFeaturesLink.addEventListener('click', closeSidebarMenu);

    // --- 1. Three.js Setup ---
    const canvas = document.getElementById('webgl-canvas');
    const scene = new THREE.Scene();

    // Set initial fog based on theme
    const isDark = document.documentElement.classList.contains('dark');
    scene.fog = new THREE.FogExp2(isDark ? 0x030508 : 0xF8FAFC, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 3D Objects ---
    const objects = [];

    // Main abstract object (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(6, 1);
    const material = new THREE.MeshPhysicalMaterial({
        color: isDark ? 0x00E5FF : 0x3B82F6,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const mainObj = new THREE.Mesh(geometry, material);
    scene.add(mainObj);
    objects.push(mainObj);

    // Floating rings
    const ringGeo = new THREE.TorusGeometry(8, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ 
        color: isDark ? 0x8B5CF6 : 0x8B5CF6, 
        transparent: true, 
        opacity: 0.2 
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);
    objects.push(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    ring2.scale.set(1.2, 1.2, 1.2);
    scene.add(ring2);
    objects.push(ring2);

    // Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 60;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        color: isDark ? 0xffffff : 0x000000,
        transparent: true,
        opacity: 0.5
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.2 : 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00E5FF, isDark ? 2 : 0.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8B5CF6, isDark ? 2 : 0.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse Interaction for 3D
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate main object
        mainObj.rotation.y = elapsedTime * 0.1;
        mainObj.rotation.x = elapsedTime * 0.05;

        // Rotate rings
        ring1.rotation.z = elapsedTime * 0.2;
        ring2.rotation.z = -elapsedTime * 0.15;

        // Move particles
        particles.rotation.y = elapsedTime * 0.05;

        // Mouse parallax
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        mainObj.rotation.y += 0.05 * (targetX - mainObj.rotation.y);
        mainObj.rotation.x += 0.05 * (targetY - mainObj.rotation.x);
        
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- 2. GSAP Entry Animations ---
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 1, delay: 0.2 })
      .to('.hero-title', { opacity: 1, y: 0, duration: 1.2 }, "-=0.8")
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .to('.hero-actions', { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .to('.interactive-card', { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, "-=0.6");

    // --- 3. Interactive Cards (Tilt Effect) ---
    const cards = document.querySelectorAll('.interactive-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(card, {
                rotationY: x * 0.05,
                rotationX: -y * 0.05,
                transformPerspective: 1000,
                ease: "power2.out",
                duration: 0.4
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                ease: "elastic.out(1, 0.3)",
                duration: 0.8
            });
        });
    });

    // --- 4. Theme Toggle (Insanely Smooth Cinematic Transition) ---
    const themeToggle = document.getElementById('theme-toggle');
    const overlay = document.getElementById('theme-transition-overlay');
    let isTransitioning = false;

    themeToggle.addEventListener('click', (e) => {
        if (isTransitioning) return;
        isTransitioning = true;

        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        
        // Setup overlay color
        overlay.style.backgroundColor = isCurrentlyDark ? '#F8FAFC' : '#030508';
        
        // Get click position for circle center
        const rect = themeToggle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Set initial clip path position
        overlay.style.clipPath = `circle(0px at ${centerX}px ${centerY}px)`;
        overlay.style.opacity = '1';

        // Calculate max radius needed
        const maxRadius = Math.max(
            Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2)),
            Math.sqrt(Math.pow(window.innerWidth - centerX, 2) + Math.pow(centerY, 2)),
            Math.sqrt(Math.pow(centerX, 2) + Math.pow(window.innerHeight - centerY, 2)),
            Math.sqrt(Math.pow(window.innerWidth - centerX, 2) + Math.pow(window.innerHeight - centerY, 2))
        );

        // GSAP Animation for magical transition
        gsap.to(overlay, {
            clipPath: `circle(${maxRadius}px at ${centerX}px ${centerY}px)`,
            duration: 1.0,
            ease: "power3.inOut",
            onComplete: () => {
                // Actually toggle the class
                document.documentElement.classList.toggle('dark');
                
                // Persist to localStorage so all pages stay in sync
                const newIsDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
                
                // Update Three.js scene colors
                
                scene.fog.color.setHex(newIsDark ? 0x030508 : 0xF8FAFC);
                ambientLight.intensity = newIsDark ? 0.2 : 0.8;
                pointLight1.intensity = newIsDark ? 2 : 0.5;
                pointLight2.intensity = newIsDark ? 2 : 0.5;
                
                material.color.setHex(newIsDark ? 0x00E5FF : 0x3B82F6);
                particlesMat.color.setHex(newIsDark ? 0xffffff : 0x000000);

                // Fade out overlay
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        overlay.style.clipPath = `circle(0px at 50% 50%)`;
                        isTransitioning = false;
                    }
                });
            }
        });
    });

    // --- 5. Outro Animation (Transition to Workspace) ---
    const warpButtons = ['btn-start-vibe', 'btn-launch-workspace'];
    
    warpButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.style.pointerEvents = 'none'; // Prevent double clicks
                
                // Animate 3D scene (zoom in camera drastically like warp speed)
                gsap.to(camera.position, {
                    z: -10, // Fly past the objects
                    duration: 1.2,
                    ease: "power3.in"
                });
                
                gsap.to(mainObj.rotation, {
                    y: "+=5",
                    x: "+=2",
                    duration: 1.2,
                    ease: "power2.in"
                });
                
                // Fade out UI elements
                gsap.to(['nav', 'main', '#sidebar'], {
                    opacity: 0,
                    y: -50,
                    scale: 0.95,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.in"
                });
                
                // Black overlay fading in to transition to next page smoothly
                const isDark = document.documentElement.classList.contains('dark');
                const exitOverlay = document.createElement('div');
                exitOverlay.style.position = 'fixed';
                exitOverlay.style.inset = '0';
                exitOverlay.style.backgroundColor = isDark ? '#05060A' : '#EEF2F7';
                exitOverlay.style.zIndex = '9999';
                exitOverlay.style.opacity = '0';
                document.body.appendChild(exitOverlay);
                
                gsap.to(exitOverlay, {
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.4, // Wait for warp speed to start
                    onComplete: () => {
                        window.location.href = btn.getAttribute('href');
                    }
                });
            });
        }
    });

});
