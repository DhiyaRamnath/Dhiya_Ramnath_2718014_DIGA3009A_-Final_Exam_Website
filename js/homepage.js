let featuredRecipeId = null;

const ingredients = [
    'apple', 'basil', 'beet', 'bell-pepper', 'broccoli', 'carrot', 
    'cherry', 'chilli', 'cucumber', 'lemon', 'lettuce', 'onion', 
    'peach', 'pepper', 'pineapple', 'potato', 'tomato', 'radish', 
    'strawberry', 'watermelon'
];

const starColors = ['blue-star', 'green-star', 'orange-star', 'pink-star', 'yellow-star'];

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
    loadFeaturedRecipe();
    initWelcomeWiggle();
    initScrollTriggers();
    initDraggablePan();
    hoverIngredients();
});

function hoverIngredients() {
    const container = document.getElementById('ingredients-container');
    const heroSection = document.querySelector('.hero-section');
    
    ingredients.forEach((ingredient, index) => {
        // Create ingredient element
        const ingredientEl = document.createElement('div');
        ingredientEl.className = 'floating-ingredient';
        
        const img = document.createElement('img');
        img.src = `assets/${ingredient}.png`;
        img.alt = ingredient;
        img.onerror = () => {
            console.log(`Image not found: ${ingredient}.png`);
            ingredientEl.remove();
        };
        
        ingredientEl.appendChild(img);
        container.appendChild(ingredientEl);
        
        // Function to get random position that doesn't overlap with logo
        function getRandomPosition() {
            const heroHeight = heroSection.offsetHeight;
            const heroWidth = heroSection.offsetWidth;
            const logoContainer = document.querySelector('.logo-container img');
            
            if (!logoContainer) {
                return {
                    x: Math.random() * (heroWidth - 100) + 50,
                    y: Math.random() * (heroHeight - 100) + 50
                };
            }
            
            const logoRect = logoContainer.getBoundingClientRect();
            const heroRect = heroSection.getBoundingClientRect();
            
            const logoRelativeX = logoRect.left - heroRect.left;
            const logoRelativeY = logoRect.top - heroRect.top;
            const logoWidth = logoRect.width;
            const logoHeight = logoRect.height;
            
            let x, y;
            let isOverlapping = true;
            let attempts = 0;
            
            while (isOverlapping && attempts < 50) {
                x = Math.random() * (heroWidth - 100) + 50;
                y = Math.random() * (heroHeight - 100) + 50;
                
                // Check if position overlaps with logo (with padding)
                const padding = 80; // Extra space around logo
                const isInLogoX = x > (logoRelativeX - padding) && x < (logoRelativeX + logoWidth + padding);
                const isInLogoY = y > (logoRelativeY - padding) && y < (logoRelativeY + logoHeight + padding);
                
                if (!isInLogoX || !isInLogoY) {
                    isOverlapping = false;
                }
                attempts++;
            }
            
            return { x, y };
        }
        
        // Get initial position
        const startPos = getRandomPosition();
        
        // Set initial position with absolute positioning
        gsap.set(ingredientEl, {
            left: startPos.x + 'px',
            top: startPos.y + 'px',
            x: 0,
            y: 0,
            rotation: Math.random() * 360
        });
        
        // Fade in
        gsap.to(ingredientEl, {
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1
        });
        
        // Create hovering animation
        function animateHover() {
            const newPos = getRandomPosition();
            const duration = 5 + Math.random() * 4; // 5-9 seconds
            
            gsap.to(ingredientEl, {
                left: newPos.x + 'px',
                top: newPos.y + 'px',
                rotation: `+=${Math.random() * 180 - 90}`, // Random rotation change
                duration: duration,
                ease: 'sine.inOut',
                onComplete: animateHover // Loop the animation
            });
        }
        
        // Start hovering after initial delay
        setTimeout(() => {
            animateHover();
        }, index * 100 + 1000);
        
        // Add continuous wiggle
        ingredientEl.style.animation = `wiggle ${3 + Math.random() * 2}s ease-in-out infinite`;
        ingredientEl.style.animationDelay = `${Math.random() * 2}s`;
    });
}

// GSAP Timeline Animation - Welcome letter wiggle (continuous)
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

// ScrollTrigger for all sections
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
    
    // Have Fun Section with Cake - Smooth slide up with scroll
    ScrollTrigger.create({
        trigger: '.have-fun-section',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onEnter: () => {
            const haveFunSection = document.querySelector('.have-fun-section');
            gsap.to(haveFunSection, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        },
        onUpdate: (self) => {
            const cakeImage = document.getElementById('cake-image');
            const progress = self.progress;
            
            // Slide up smoothly with scroll (no rotation)
            gsap.to(cakeImage, {
                y: (1 - progress) * 200 - 200,
                opacity: progress,
                scale: 0.5 + (progress * 0.5),
                duration: 0.1,
                ease: 'none',
                onComplete: () => {
                    if (progress > 0.7 && !cakeImage.dataset.starsStarted) {
                        cakeImage.dataset.starsStarted = 'true';
                        createStarConfetti();
                    }
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

// Star Confetti - Pop out and disappear
function createStarConfetti() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    
    const numStars = 40;
    
    for (let i = 0; i < numStars; i++) {
        const starEl = document.createElement('div');
        starEl.className = 'star-confetti';
        
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
        
        // Start from center of cake
        const startX = 250;
        const startY = 250;
        
        gsap.set(starEl, {
            left: startX + 'px',
            top: startY + 'px',
            x: 0,
            y: 0,
            rotation: Math.random() * 360,
            opacity: 0
        });
        
        // Pop out animation
        function popStar() {
            const angle = Math.random() * Math.PI * 2;
            const distance = 150 + Math.random() * 150;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            gsap.timeline()
                .to(starEl, {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                })
                .to(starEl, {
                    x: endX,
                    y: endY,
                    rotation: `+=${Math.random() * 720 - 360}`,
                    duration: 1.5,
                    ease: 'power2.out'
                }, '<')
                .to(starEl, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.3
                })
                .to(starEl, {
                    onComplete: () => {
                        // Reset and loop
                        gsap.set(starEl, {
                            x: 0,
                            y: 0,
                            opacity: 0,
                            rotation: Math.random() * 360
                        });
                        
                        // Random delay before next pop
                        gsap.delayedCall(Math.random() * 2 + 1, popStar);
                    }
                });
        }
        
        // Start with staggered delay
        gsap.delayedCall(i * 0.05, popStar);
    }
}

// Draggable Animation - Freely Spinning Pan
function initDraggablePan() {
    const panContainer = document.getElementById('draggable-pan');
    if (!panContainer) return;
    
    gsap.set(panContainer, { rotation: -25 });
    
    Draggable.create(panContainer, {
        type: 'rotation',
        inertia: true,
        bounds: { minRotation: -360, maxRotation: 360 },
        throwProps: true,
        snap: function(endValue) {
            return Math.round(endValue / 45) * 45;
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