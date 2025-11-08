let featuredRecipeId = null;

const ingredients = ['apple', 'basil', 'beet', 'bell-pepper', 'broccoli', 'carrot','cherry', 'chilli', 'cucumber', 'lemon', 'lettuce', 'onion', 
'peach', 'pepper', 'pineapple', 'potato', 'tomato', 'radish','strawberry', 'watermelon'];

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
    
    const ingredientCopies = [];
    const numCopies = 3; 
    for (let i = 0; i < numCopies; i++) {
        ingredientCopies.push(...ingredients);
    }

    ingredientCopies.forEach((ingredient, index) => {
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
                const padding = 80;
                const isInLogoX = x > (logoRelativeX - padding) && x < (logoRelativeX + logoWidth + padding);
                const isInLogoY = y > (logoRelativeY - padding) && y < (logoRelativeY + logoHeight + padding);
                
                if (!isInLogoX || !isInLogoY) {
                    isOverlapping = false;
                }
                attempts++;
            }
            
            return { x, y };
        }
        
        const startPos = getRandomPosition();
        
        gsap.set(ingredientEl, {
            left: startPos.x + 'px',
            top: startPos.y + 'px',
            x: 0,
            y: 0,
            rotation: Math.random() * 360
        });
        
        gsap.to(ingredientEl, {
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1
        });

        function animateHover() {
            const newPos = getRandomPosition();
            const duration = 5 + Math.random() * 4;
            
            gsap.to(ingredientEl, {
                left: newPos.x + 'px',
                top: newPos.y + 'px',
                rotation: `+=${Math.random() * 180 - 90}`,
                duration: duration,
                ease: 'sine.inOut',
                onComplete: animateHover
            });
        }
        
        setTimeout(() => {
            animateHover();
        }, index * 100 + 1000);
    
        ingredientEl.style.animation = `wiggle ${3 + Math.random() * 2}s ease-in-out infinite`;
        ingredientEl.style.animationDelay = `${Math.random() * 2}s`;
    });
}

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

function initScrollTriggers() {
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
    
    ScrollTrigger.create({
        trigger: '.have-fun-section',
        start: 'top 60%',
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
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power2.out'
            });
            
            if (!cakeImage.dataset.starsStarted) {
                cakeImage.dataset.starsStarted = 'true';
                setTimeout(() => {
                    createStarConfetti();
                }, 500);
            }
        },
        once: true
    });
    
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

function createStarConfetti() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    
    const numStars = 50;
    
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
        
        function popStar() {
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 200;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            gsap.timeline()
                .to(starEl, {
                    opacity: 1,
                    scale: 1.5,
                    duration: 0.2,
                    ease: 'power2.out'
                })
                .to(starEl, {
                    x: endX,
                    y: endY,
                    rotation: `+=${Math.random() * 1080 - 540}`,
                    scale: 1,
                    duration: 2,
                    ease: 'power2.out'
                }, '<')
                .to(starEl, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.6,
                    delay: 0.2
                })
                .to(starEl, {
                    onComplete: () => {
                        gsap.set(starEl, {
                            x: 0,
                            y: 0,
                            opacity: 0,
                            scale: 1,
                            rotation: Math.random() * 360
                        });
                        gsap.delayedCall(Math.random() * 2.5 + 0.5, popStar);
                    }
                });
        }
        gsap.delayedCall(i * 0.04, popStar);
    }
}

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