// gsap-animations.js
// Toutes les animations GSAP

gsap.registerPlugin(ScrollTrigger);

// Hero Timeline plus dynamique
gsap.set(".hero-badge, .hero-title-line, .hero-description, .hero-btn", {
    opacity: 0,
    y: 40
});

const heroTl = gsap.timeline({
    defaults: { duration: 0.8, ease: "power3.out" },
    delay: 0.1
});

heroTl
    .to(".hero-badge", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(0.5)"
    })
    .to(".hero-title-line", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=0.2")
    .to(".hero-description", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out"
    }, "-=0.5")
    .to(".hero-btn", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scale: 1,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.3");

gsap.utils.toArray(".section-gsap").forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

gsap.from(".gallery-item", {
    scrollTrigger: {
        trigger: ".gallery-grid",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    delay: 0.3,
    ease: "power2.out"
});

// FAQ Accordéon — animation parfaitement symétrique (ouverture + fermeture)
const faqItems = document.querySelectorAll('.faq-item');

// Initialisation : cacher toutes les réponses
faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    gsap.set(answer, {
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        overflow: 'hidden'
    });
});

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const answerContent = answer.querySelector('p');

    // Stocker la hauteur naturelle AVANT de l'animer
    let naturalHeight = 0;

    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Ferme tous les autres (optionnel)
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherItem.classList.remove('active');

                // Fermeture parfaite des autres
                gsap.to(otherAnswer, {
                    height: 0,
                    opacity: 0,
                    paddingBottom: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    clearProps: "overflow"
                });
            }
        });

        if (!isOpen) {
            // === OUVERTURE : calculer la hauteur naturelle ===
            item.classList.add('active');

            // Révéler temporairement pour mesurer
            gsap.set(answer, {
                height: 'auto',
                opacity: 1,
                paddingBottom: 28,
                overflow: 'hidden'
            });

            // Mesurer la hauteur réelle
            naturalHeight = answer.offsetHeight;

            // Remettre à 0 instantanément
            gsap.set(answer, {
                height: 0,
                opacity: 0,
                paddingBottom: 0
            });

            // Animer vers la hauteur naturelle
            gsap.to(answer, {
                height: naturalHeight,
                opacity: 1,
                paddingBottom: 28,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(answer, { overflow: 'visible' });
                }
            });
        } else {
            // === FERMETURE : exactement le même mouvement en inversé ===
            // Désactiver overflow visible pour la fermeture
            gsap.set(answer, { overflow: 'hidden' });

            // Animer la hauteur VERS 0 en même temps que l'opacité
            gsap.to(answer, {
                height: 0,
                opacity: 0,
                paddingBottom: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    item.classList.remove('active');
                    gsap.set(answer, { overflow: 'hidden' });
                }
            });
        }
    });
});