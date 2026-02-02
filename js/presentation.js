// State
let currentSlide = 0;
let totalSlides = 0;
let isPresentationMode = false;

// Sections list - TO BE FILLED
const sections = [
    'sections/00_cover.html',
    'sections/01_introduction.html',
    'sections/02_history.html',
    'sections/03_philosophy_ontology.html',
    'sections/04_philosophy_epistemology.html',
    'sections/04b_logic_deep_dive.html',
    'sections/05_philosophy_ethics.html',
    'sections/06_values_impact.html',
    'sections/06b_limitations.html',
    'sections/07_conclusion.html'
];

// Load all sections
async function loadAllSections() {
    const container = document.getElementById('slides-container');
    container.innerHTML = ''; // Clear existing

    for (const section of sections) {
        try {
            const response = await fetch(section);
            if (response.ok) {
                let html = await response.text();
                // Fix image paths if necessary
                html = html.replace(/\.\.\/assets\//g, 'assets/');
                container.innerHTML += html;
            } else {
                console.error(`Failed to load ${section}`, response.status);
            }
        } catch (error) {
            console.error(`Error loading ${section}:`, error);
        }
    }

    // Initialize slides
    initSlides();
}

// Initialize slides
function initSlides() {
    const slides = document.querySelectorAll('.slide-container');
    totalSlides = slides.length;
    updateSlideCounter();
}

// Update slide counter
function updateSlideCounter() {
    const counter = document.getElementById('slide-counter');
    if (counter) counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

// Show specific slide
function showSlide(index) {
    const slides = document.querySelectorAll('.slide-container');
    if (slides.length === 0) return;

    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentSlide = index;

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
        // Reset fragments when entering a new slide
        if (i === currentSlide) {
            const fragments = slide.querySelectorAll('.fragment');
            fragments.forEach(f => f.classList.remove('visible'));

            // Auto trigger fragments in presentation mode
            if (isPresentationMode) {
                triggerFragments(slide);
            }
        }
    });

    updateSlideCounter();

    // Scroll to slide in non-presentation mode
    if (!isPresentationMode) {
        slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function triggerFragments(slide) {
    const hiddenFragments = slide.querySelectorAll('.fragment:not(.visible)');
    hiddenFragments.forEach((fragment, idx) => {
        setTimeout(() => {
            fragment.classList.add('visible');
        }, idx * 500 + 300); // Staggered
    });
}

// Next/Previous slide
function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Calculate scale factor to fit viewport
function calculateScale() {
    const slideWidth = 1280;
    const slideHeight = 720;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scaleX = viewportWidth / slideWidth;
    const scaleY = viewportHeight / slideHeight;
    const scale = Math.min(scaleX, scaleY);

    document.documentElement.style.setProperty('--slide-scale', scale);
}

// Toggle presentation mode
function togglePresentationMode() {
    isPresentationMode = !isPresentationMode;
    document.documentElement.classList.toggle('presentation-mode', isPresentationMode);

    const btn = document.querySelector('#btn-present i');
    if (btn) {
        btn.className = isPresentationMode ? 'fa-solid fa-stop' : 'fa-solid fa-play';
    }

    if (isPresentationMode) {
        calculateScale();
        showSlide(currentSlide);
        // Auto fullscreen when entering presentation mode
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => { });
        }
    } else {
        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => { });
        }
        // Scroll to current
        setTimeout(() => showSlide(currentSlide), 100);
    }
}

// Update scale on window resize
window.addEventListener('resize', () => {
    if (isPresentationMode) {
        calculateScale();
    }
});

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            if (isPresentationMode || true) nextSlide();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            if (isPresentationMode || true) prevSlide();
            break;
        case 'Home':
            e.preventDefault(); showSlide(0);
            break;
        case 'End':
            e.preventDefault(); showSlide(totalSlides - 1);
            break;
        case 'Escape':
            if (isPresentationMode) togglePresentationMode();
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
        case 'p':
        case 'P':
            togglePresentationMode();
            break;
    }
});

// Button event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-fullscreen')?.addEventListener('click', toggleFullscreen);
    document.getElementById('btn-present')?.addEventListener('click', togglePresentationMode);
    document.getElementById('prev-arrow')?.addEventListener('click', prevSlide);
    document.getElementById('next-arrow')?.addEventListener('click', nextSlide);

    loadAllSections();
});
