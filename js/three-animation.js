// three-animation.js - Globe ou pyramide de particules
function heroCanvasScript() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const SHAPE = "pyramid"; // "globe" ou "pyramid"

    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 28;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function getColorsForTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        return isDark
            ? {
                primary: new THREE.Color(0x00ffd1),
                secondary: new THREE.Color(0x4a9eff),
                accent: new THREE.Color(0x7b68ee),
                opacity: 0.9
            }
            : {
                primary: new THREE.Color(0x0066ff),
                secondary: new THREE.Color(0x3399ff),
                accent: new THREE.Color(0x7b68ee),
                opacity: 0.85
            };
    }

    let colorScheme = getColorsForTheme();

    const particlesCount = 2200;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    function setParticleColor(i, factor) {
        let mixColor;

        if (factor < 0.5) {
            mixColor = colorScheme.primary.clone().lerp(colorScheme.secondary, factor * 2);
        } else {
            mixColor = colorScheme.secondary.clone().lerp(colorScheme.accent, (factor - 0.5) * 2);
        }

        const brightness = 0.55 + Math.random() * 0.65;

        colors[i * 3] = mixColor.r * brightness;
        colors[i * 3 + 1] = mixColor.g * brightness;
        colors[i * 3 + 2] = mixColor.b * brightness;
    }

    function createGlobe() {
        const radius = 11;

        for (let i = 0; i < particlesCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.9;
            positions[i * 3 + 2] = radius * Math.cos(phi);

            setParticleColor(i, phi / Math.PI);
        }
    }

    function createPyramid() {
        const baseSize = 18;
        const height = 17;

        const vertices = [
            new THREE.Vector3(0, height / 2, 0),
            new THREE.Vector3(-baseSize / 2, -height / 2, -baseSize / 2),
            new THREE.Vector3(baseSize / 2, -height / 2, -baseSize / 2),
            new THREE.Vector3(baseSize / 2, -height / 2, baseSize / 2),
            new THREE.Vector3(-baseSize / 2, -height / 2, baseSize / 2)
        ];

        const faces = [
            [vertices[0], vertices[1], vertices[2]],
            [vertices[0], vertices[2], vertices[3]],
            [vertices[0], vertices[3], vertices[4]],
            [vertices[0], vertices[4], vertices[1]],
            [vertices[1], vertices[2], vertices[3]],
            [vertices[1], vertices[3], vertices[4]]
        ];

        for (let i = 0; i < particlesCount; i++) {
            const face = faces[Math.floor(Math.random() * faces.length)];

            let u = Math.random();
            let v = Math.random();

            if (u + v > 1) {
                u = 1 - u;
                v = 1 - v;
            }

            const a = face[0];
            const b = face[1];
            const c = face[2];

            const x = a.x + u * (b.x - a.x) + v * (c.x - a.x);
            const y = a.y + u * (b.y - a.y) + v * (c.y - a.y);
            const z = a.z + u * (b.z - a.z) + v * (c.z - a.z);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const factor = (y + height / 2) / height;
            setParticleColor(i, factor);
        }
    }

    if (SHAPE === "pyramid") {
        createPyramid();
    } else {
        createGlobe();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: colorScheme.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        particles.rotation.y += 0.0025;
        particles.rotation.x = Math.sin(time * 0.4) * 0.08;

        renderer.render(scene, camera);
    }

    animate();

    const resizeObserver = new ResizeObserver(() => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    });

    resizeObserver.observe(container);

    const observer = new MutationObserver(() => {
        colorScheme = getColorsForTheme();

        for (let i = 0; i < particlesCount; i++) {
            const factor = i / particlesCount;
            setParticleColor(i, factor);
        }

        geometry.attributes.color.needsUpdate = true;
        material.opacity = colorScheme.opacity;
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

if (typeof THREE === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
        setTimeout(heroCanvasScript, 100);
    };
    document.head.appendChild(script);
} else {
    setTimeout(heroCanvasScript, 100);
}