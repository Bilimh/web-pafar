// three-animation.js - Version Épurée Luxe
function heroCanvasScript() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const container = document.getElementById('heroCanvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    function getColorsForTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            return {
                primary: new THREE.Color(0x00ffd1),
                secondary: new THREE.Color(0x7b68ee),
                opacity: 0.7,
                lineOpacity: 0.2
            };
        } else {
            return {
                primary: new THREE.Color(0x0066ff),
                secondary: new THREE.Color(0x7b68ee),
                opacity: 0.65,
                lineOpacity: 0.15
            };
        }
    }

    let colorScheme = getColorsForTheme();
    
    // PETITS GRAINS (800 particules fines)
    const particlesCount = 800;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        // Nuage organique
        const radius = 14 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
        positions[i * 3 + 2] = radius * Math.cos(phi) * 0.7;
        
        // Dégradé entre primaire et secondaire
        const mixColor = colorScheme.primary.clone().lerp(colorScheme.secondary, Math.random());
        const brightness = 0.5 + Math.random() * 0.5;
        colors[i * 3] = mixColor.r * brightness;
        colors[i * 3 + 1] = mixColor.g * brightness;
        colors[i * 3 + 2] = mixColor.b * brightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.12,  // PETITS GRAINS
        vertexColors: true,
        transparent: true,
        opacity: colorScheme.opacity,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // FILS TRÈS FINS (connexions élégantes)
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: colorScheme.primary, 
        transparent: true, 
        opacity: colorScheme.lineOpacity
    });
    const linePositions = [];

    for (let i = 0; i < particlesCount; i++) {
        for (let j = i + 1; j < particlesCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 3.2 && Math.random() < 0.12) {
                linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
        }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.002;
        
        // Rotation très douce
        particles.rotation.y = time * 0.1;
        particles.rotation.x = Math.sin(time * 0.15) * 0.03;
        particles.rotation.z = Math.cos(time * 0.12) * 0.02;
        
        lines.rotation.y = particles.rotation.y;
        lines.rotation.x = particles.rotation.x;
        lines.rotation.z = particles.rotation.z;
        
        // Micro-respiration
        const scale = 1 + Math.sin(time * 0.6) * 0.008;
        particles.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    // Adaptation au thème
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                colorScheme = getColorsForTheme();
                
                // Mise à jour couleurs particules
                for (let i = 0; i < particlesCount; i++) {
                    const mixColor = colorScheme.primary.clone().lerp(colorScheme.secondary, Math.random());
                    const brightness = 0.5 + Math.random() * 0.5;
                    colors[i * 3] = mixColor.r * brightness;
                    colors[i * 3 + 1] = mixColor.g * brightness;
                    colors[i * 3 + 2] = mixColor.b * brightness;
                }
                geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                
                material.opacity = colorScheme.opacity;
                lineMaterial.color = colorScheme.primary;
                lineMaterial.opacity = colorScheme.lineOpacity;
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
}

// Charger Three.js
if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => { setTimeout(heroCanvasScript, 100); };
    document.head.appendChild(script);
} else {
    setTimeout(heroCanvasScript, 100);
}