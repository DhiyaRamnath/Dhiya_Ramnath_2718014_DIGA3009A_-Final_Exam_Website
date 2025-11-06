let featuredRecipeId = null;

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
    loadFeaturedRecipe();
    initVegetableTimeline();
    initWelcomeWiggle();
    initScrollTriggers();
    initDraggablePan();
});

// 1. GSAP Timeline Animation - Vegetables floating
function initVegetableTimeline() {
    const leftVeg = document.querySelector('.hero-left-veg');
    const rightVeg = document.querySelector('.hero-right-veg');
    
    if (leftVeg) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(leftVeg, {
            y: -30,
            rotation: 5,
            duration: 3,
            ease: 'sine.inOut'
        })
        .to(leftVeg, {
            y: 30,
            rotation: -5,
            duration: 3,
            ease: 'sine.inOut'
        });
    }
    
    if (rightVeg) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: 1 });
        tl.to(rightVeg, {
            y: 30,
            rotation: -5,
            duration: 3,
            ease: 'sine.inOut'
        })
        .to(rightVeg, {
            y: -30,
            rotation: 5,
            duration: 3,
            ease: 'sine.inOut'
        });
    }
}

// 2. GSAP Timeline Animation - Welcome letter wiggle (continuous)
function initWelcomeWiggle() {
    const heading = document.getElementById('welcome-heading');
    if (!heading) return;
    
    const text = heading.textContent;
    heading.innerHTML = '';
    
    const letters = [];
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'welcome-letter';
        span.textContent = text[i];
        heading.appendChild(span);
        if (text[i] !== ' ') {
            letters.push(span);
        }
    }
    
    // Continuous wiggle timeline
    letters.forEach((letter, index) => {
        gsap.timeline({ repeat: -1, repeatDelay: 0 })
            .to(letter, {
                rotation: 15,
                y: -10,
                duration: 0.3,
                ease: 'sine.inOut',
                delay: index * 0.1
            })
            .to(letter, {
                rotation: -15,
                y: 10,
                duration: 0.3,
                ease: 'sine.inOut'
            })
            .to(letter, {
                rotation: 0,
                y: 0,
                duration: 0.3,
                ease: 'sine.inOut'
            })
            .to(letter, {
                rotation: 0,
                y: 0,
                duration: 2
            });
    });
}

// 3. ScrollTrigger for all sections
function initScrollTriggers() {
    // Welcome Section
    ScrollTrigger.create({
        trigger: '.welcome-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.welcome-section', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
        }
    });
    
    // Tastiest Section
    ScrollTrigger.create({
        trigger: '.tastiest-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.tastiest-section', {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power2.out'
            });
        }
    });
    
    // Not Sure Section
    ScrollTrigger.create({
        trigger: '.not-sure-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.not-sure-section', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            });
        }
    });
    
    // Have Fun Section with Cake
    ScrollTrigger.create({
        trigger: '.not-sure-section',
        start: 'bottom 60%',
        onEnter: () => {
            const haveFunSection = document.querySelector('.have-fun-section');
            const cakeImage = document.getElementById('cake-image');
            
            gsap.to(haveFunSection, {
                opacity: 1,
                duration: 1,
                ease: 'power2.out'
            });
            
            gsap.to(cakeImage, {
                opacity: 1,
                scale: 1,
                rotation: 360,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)',
                delay: 0.5,
                onComplete: () => {
                    createConfetti();
                }
            });
        }
    });
    
    // Footer Section
    ScrollTrigger.create({
        trigger: '.have-fun-section',
        start: 'bottom 80%',
        onEnter: () => {
            gsap.to('.footer-section', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
        }
    });
}

// 4. MorphSVG for Confetti Animation
function createConfetti() {
    const svg = document.getElementById('confetti-svg');
    if (!svg) return;
    
    const colors = ['#f94680', '#febd17', '#ff8019', '#1bc0b9', '#8095e4'];
    const numConfetti = 30;
    
    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const x = Math.random() * 500;
        const y = Math.random() * 200 + 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.setAttribute('cx', x);
        confetti.setAttribute('cy', y);
        confetti.setAttribute('r', 0);
        confetti.setAttribute('fill', color);
        
        svg.appendChild(confetti);
        
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        tl.to(confetti, {
            attr: { r: 8 },
            duration: 0.5,
            ease: 'power2.out'
        })
        .to(confetti, {
            attr: { r: 4 },
            duration: 0.5,
            ease: 'power2.inOut'
        })
        .to(confetti, {
            attr: { r: 10 },
            duration: 0.5,
            ease: 'power2.inOut'
        });
        
        gsap.to(confetti, {
            attr: { 
                cy: y + (Math.random() * 100 - 50),
                cx: x + (Math.random() * 100 - 50)
            },
            duration: 2 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 2
        });
    }
}

// 5. Draggable Animation - Freely Spinning Pan
function initDraggablePan() {
    const panContainer = document.getElementById('draggable-pan');
    if (!panContainer) return;
    
    // Set initial rotation
    gsap.set(panContainer, { rotation: -25 });
    
    // Create draggable with rotation
    Draggable.create(panContainer, {
        type: 'rotation',
        inertia: true,
        bounds: { minRotation: -360, maxRotation: 360 },
        throwProps: true,
        snap: function(endValue) {
            return Math.round(endValue / 45) * 45; // Snap to 45 degree increments
        },
        onDragStart: function() {
            gsap.to(panContainer, {
                scale: 1.1,
                duration: 0.2,
                ease: 'power2.out'
            });
        },
        onDragEnd: function() {
            gsap.to(panContainer, {
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });
            
            // Add bounce effect
            const currentRotation = this.rotation;
            gsap.to(panContainer, {
                rotation: currentRotation + 20,
                duration: 0.2,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });
        }
    });
}

function initButtons() {
    const browseBtn = document.getElementById('browse-btn');
    const surpriseBtn = document.getElementById('surprise-btn');
    const checkItOutBtn = document.getElementById('check-it-out-btn');
    
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            window.location.href = 'browse-recipes.html';
        });
    }
    
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            window.location.href = 'surprise-me.html';
        });
    }

    if (checkItOutBtn) {
        checkItOutBtn.addEventListener('click', () => {
            if (featuredRecipeId) {
                window.location.href = `recipe-details.html?id=${featuredRecipeId}`;
            } else {
                window.location.href = 'browse-recipes.html';
            }
        });
    }
}

async function loadFeaturedRecipe() {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&type=dessert&number=10&addRecipeInformation=true&sort=random`);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const recipe = data.results[Math.floor(Math.random() * data.results.length)];
            featuredRecipeId = recipe.id;
            
            const titleElement = document.getElementById('featured-title');
            const imageElement = document.getElementById('featured-image');
            const descElement = document.getElementById('featured-description');
            
            if (titleElement) {
                titleElement.textContent = recipe.title;
            }
            
            if (imageElement) {
                imageElement.src = recipe.image || 'https://via.placeholder.com/400x400?text=No+Image';
            }
            
            if (descElement) {
                let description = 'A delightful dessert to brighten up your day!';
                if (recipe.summary) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = recipe.summary;
                    const text = tempDiv.textContent || tempDiv.innerText;
                    const sentences = text.split('.');
                    description = sentences[0] + '.';
                }
                descElement.textContent = description;
            }
        }
    } catch (error) {
        console.error('Error loading recipe:', error);
        document.getElementById('featured-title').textContent = 'Chocolate Milkshake';
        document.getElementById('featured-description').textContent = 'A delightful milkshake to brighten up a sunny day.';
    }
}