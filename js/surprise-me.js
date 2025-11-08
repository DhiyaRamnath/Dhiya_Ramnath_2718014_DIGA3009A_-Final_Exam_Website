 const starColors = ['blue-star', 'green-star', 'orange-star', 'pink-star', 'yellow-star'];
const colors = ['color-teal', 'color-orange', 'color-pink'];
let currentRecipes = [];
let currentRecipeId = null;
let isFlipped = false;

document.addEventListener('DOMContentLoaded', () => {
    initSpinningStars();
    initLetterHoverEffect();
    initScrollAnimations();
    load3RandomRecipes();
    initRefreshButton();
});

function initLetterHoverEffect() {
    const surpriseTitle = document.getElementById('surprise-title');
    if (surpriseTitle) {
        const text = surpriseTitle.textContent;
        surpriseTitle.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'hover-letter';
            span.textContent = text[i];
            if (text[i] === ' ') {
                span.style.marginRight = '0.5rem';
            }
            surpriseTitle.appendChild(span);
        }
    }
}

function initSpinningStars() {
    const container = document.getElementById('stars-background');
    const numStars = 15;
    for (let i = 0; i < numStars; i++) {
        const starEl = document.createElement('div');
        starEl.className = 'spinning-star';
        
        const starColor = starColors[Math.floor(Math.random() * starColors.length)];
        const img = document.createElement('img');
        img.src = `assets/${starColor}.png`;
        img.alt = starColor;
        img.onerror = () => {
            console.log(`Star image not found: ${starColor}.png`);
            starEl.remove();
        };
        
        starEl.appendChild(img);
        container.appendChild(starEl);
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        gsap.set(starEl, {
            x: startX,
            y: startY,
            rotation: Math.random() * 360
        });
        
        const timeline = gsap.timeline({ repeat: -1 });
        const path = [];
        for (let j = 0; j < 4; j++) {
            path.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotation: Math.random() * 720 - 360
            });
        }
        
        path.forEach((point, index) => {
            timeline.to(starEl, {
                x: point.x,
                y: point.y,
                rotation: `+=${point.rotation}`,
                duration: 8 + Math.random() * 4,
                ease: 'sine.inOut',
                delay: index === 0 ? Math.random() * 2 : 0
            });
        });
        timeline.to(starEl, {
            x: startX,
            y: startY,
            rotation: '+=360',
            duration: 8 + Math.random() * 4,
            ease: 'sine.inOut'
        });
    }
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    });
}

function initRefreshButton() {
    const refreshBtn = document.getElementById('refresh-button');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            gsap.to('.flip-card', {
                opacity: 0,
                y: -50,
                scale: 0.8,
                duration: 0.4,
                stagger: 0.1,
                onComplete: () => {
                    load3RandomRecipes();
                }
            });
        });
    }
}

