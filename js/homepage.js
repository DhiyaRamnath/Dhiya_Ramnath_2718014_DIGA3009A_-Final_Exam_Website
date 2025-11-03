let featuredRecipeId = null;

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
    loadFeaturedRecipe();
    initHomepageAnimations();
    initPanAnimation();
    initScrollTextAnimations();
});

function initButtons() {
    const browseBtns = document.querySelectorAll('#browse-btn');
    const surpriseBtn = document.getElementById('surprise-btn');
    const checkItOutBtn = document.getElementById('check-it-out-btn');
    
    browseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'browse-recipes.html';
        });
    });
    
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
        const recipes = await fetchRandomRecipes(1);
        if (recipes && recipes.length > 0) {
            const recipe = recipes[0];
            featuredRecipeId = recipe.id;
            
            document.getElementById('featured-recipe-title').textContent = recipe.title;
            document.getElementById('featured-recipe-image').src = recipe.image || 'https://via.placeholder.com/400x300?text=No+Image';
            
            let description = 'A delightful recipe to brighten up your day!';
            if (recipe.summary) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = recipe.summary;
                const summaryText = tempDiv.textContent || tempDiv.innerText;
                const sentences = summaryText.split('.');
                description = sentences[0] + '.';
            }
            document.getElementById('featured-recipe-description').textContent = description;
        }
    } catch (error) {
        console.error('Error loading featured recipe:', error);
    }
}

function initScrollTextAnimations() {
    ScrollTrigger.create({
        trigger: '.welcome-section',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
            gsap.to('.welcome-content', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
        },
        onLeave: () => {
            gsap.to('.welcome-content', {
                opacity: 0,
                y: -50,
                duration: 0.5
            });
        },
        onEnterBack: () => {
            gsap.to('.welcome-content', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
        },
        onLeaveBack: () => {
            gsap.to('.welcome-content', {
                opacity: 0,
                y: 50,
                duration: 0.5
            });
        }
    });

    ScrollTrigger.create({
        trigger: '.tastiest-section',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
            gsap.to('.tastiest-image', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to('.tastiest-text', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out',
                delay: 0.2
            });
        },
        onLeave: () => {
            gsap.to('.tastiest-image', {
                opacity: 0,
                x: -50,
                duration: 0.5
            });
            gsap.to('.tastiest-text', {
                opacity: 0,
                x: 50,
                duration: 0.5
            });
        },
        onEnterBack: () => {
            gsap.to('.tastiest-image', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to('.tastiest-text', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out',
                delay: 0.2
            });
        },
        onLeaveBack: () => {
            gsap.to('.tastiest-image', {
                opacity: 0,
                x: -50,
                duration: 0.5
            });
            gsap.to('.tastiest-text', {
                opacity: 0,
                x: 50,
                duration: 0.5
            });
        }
    });

    ScrollTrigger.create({
        trigger: '.not-sure-section',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
            gsap.to('.not-sure-content', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            });
        },
        onLeave: () => {
            gsap.to('.not-sure-content', {
                opacity: 0,
                x: 50,
                duration: 0.5
            });
        },
        onEnterBack: () => {
            gsap.to('.not-sure-content', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            });
        },
        onLeaveBack: () => {
            gsap.to('.not-sure-content', {
                opacity: 0,
                x: 50,
                duration: 0.5
            });
        }
    });
}

function initPanAnimation() {
    const notSureSection = document.querySelector('.not-sure-section');
    const emptyPan = document.querySelector('.pan-image.empty');
    const stirfryPan = document.querySelector('.pan-image.stirfry');
    const haveFunSection = document.querySelector('.have-fun-section');
    
    ScrollTrigger.create({
        trigger: notSureSection,
        start: 'bottom 70%',
        end: 'bottom 30%',
        onEnter: () => {
            gsap.to(emptyPan, {
                rotation: 360,
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'power2.inOut'
            });
            
            gsap.to(stirfryPan, {
                opacity: 1,
                duration: 1,
                delay: 0.8,
                ease: 'power2.inOut'
            });
            
            gsap.to(haveFunSection, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 1
            });
        },
        onLeaveBack: () => {
            gsap.to(emptyPan, {
                rotation: -25,
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: 'power2.inOut'
            });
            gsap.to(stirfryPan, {
                opacity: 0,
                duration: 0.8
            });
            gsap.to(haveFunSection, {
                opacity: 0,
                y: 50,
                duration: 0.5
            });
        }
    });
    ScrollTrigger.create({
        trigger: haveFunSection,
        start: 'top 80%',
        end: 'bottom 20%',
        onLeave: () => {
            gsap.to(haveFunSection, {
                opacity: 0,
                y: -50,
                duration: 0.5
            });
        },
        onEnterBack: () => {
            gsap.to(haveFunSection, {
                opacity: 1,
                y: 0,
                duration: 1
            });
        }
    });
}

function initHomepageAnimations() {
    const heroTimeline = gsap.timeline();
    
    heroTimeline
        .from('.hero-section', {
            opacity: 0,
            duration: 0.8
        })
        .from('.logo-container img', {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'back.out(2)'
        }, '-=0.4')
        .from('.tagline', {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, '-=0.3');
}