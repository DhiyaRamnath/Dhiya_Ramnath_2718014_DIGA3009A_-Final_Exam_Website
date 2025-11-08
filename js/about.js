const ingredients = ['apple', 'basil', 'beet', 'bell-pepper', 'broccoli', 'carrot','cherry', 'chilli', 'cucumber', 'lemon', 'lettuce', 'onion', 
'peach', 'pepper', 'pineapple', 'potato', 'tomato', 'radish','strawberry', 'watermelon'];

document.addEventListener('DOMContentLoaded', () => {
    initLetterHoverEffect();
    startIngredientsRain();
    initScrollAnimations();
});

function initLetterHoverEffect() {
    const aboutTitle = document.getElementById('about-title');
    if (aboutTitle) {
        const text = aboutTitle.textContent;
        aboutTitle.innerHTML = '';
        aboutTitle.style.letterSpacing = '0.1rem';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'hover-letter';
            span.textContent = text[i];
            if (text[i] === ' ') {
                span.style.width = '1rem';
                span.style.display = 'inline-block';
            }
            aboutTitle.appendChild(span);
        }
    }
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set('.tagline', { opacity: 0, y: 50 });
    gsap.set('.about-text p', { opacity: 0, y: 50 });
    gsap.set('.safety-notice', { opacity: 0, scale: 0.9, y: 50 });
    
    ScrollTrigger.create({
        trigger: '.tagline',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.tagline', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
        },
        once: true
    });
    
    const paragraphs = document.querySelectorAll('.about-text p');
    paragraphs.forEach((paragraph, index) => {
        ScrollTrigger.create({
            trigger: paragraph,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(paragraph, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: index * 0.1
                });
            },
            once: true
        });
    });
    
    const featureCards = document.querySelectorAll('.feature-card');
    
    gsap.set(featureCards, {
        opacity: 0,
        y: 60,
        scale: 0.9
    });
    
    ScrollTrigger.create({
        trigger: '.about-features',
        start: 'top 75%',
        onEnter: () => {
            gsap.to(featureCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            });
        },
        once: true
    });
    
    ScrollTrigger.create({
        trigger: '.safety-notice',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.safety-notice', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: 'back.out(1.7)'
            });
        },
        once: true
    });
}

function startIngredientsRain() {
    const container = document.getElementById('ingredients-rain');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFallingIngredient();
        }, i * 100);
    }
    
    setInterval(() => {
        createFallingIngredient();
        setTimeout(() => createFallingIngredient(), 80);
        setTimeout(() => createFallingIngredient(), 160);
    }, 300);
}

function createFallingIngredient() {
    const container = document.getElementById('ingredients-rain');
    if (!container) return;
    
    const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    const ingredientEl = document.createElement('div');
    ingredientEl.className = 'falling-ingredient';
    
    const img = document.createElement('img');
    img.src = `assets/${ingredient}.png`;
    img.alt = ingredient;
    img.onerror = () => {
        ingredientEl.remove();
    };
    
    ingredientEl.appendChild(img);
    container.appendChild(ingredientEl);
    
    const startX = Math.random() * window.innerWidth;
    const startRotation = Math.random() * 360;
    const endRotation = startRotation + (Math.random() * 360 - 180);
    const duration = 3 + Math.random() * 3;
    const swayAmount = (Math.random() * 100 - 50);
    
    gsap.set(ingredientEl, {
        x: startX,
        y: -100,
        rotation: startRotation
    });
    
    gsap.timeline({
        onComplete: () => {
            ingredientEl.remove();
        }
    })
    .to(ingredientEl, {
        y: window.innerHeight * 0.5,
        x: startX + swayAmount,
        rotation: endRotation,
        duration: duration,
        ease: 'none'
    })
    .to(ingredientEl, {
        opacity: 0,
        duration: duration * 0.3,
        ease: 'power2.in'
    }, duration * 0.7); 
}

setInterval(() => {
    const container = document.getElementById('ingredients-rain');
    if (container && container.children.length > 60) {
        while (container.children.length > 50) {
            container.removeChild(container.firstChild);
        }
    }
}, 5000);