// List of slide files in order
const slidesList = [
    'sections/00_cover.html',
    'sections/01_toc.html',
    'sections/02_intro_context.html',
    'sections/03_intro_relevance.html',
    'sections/04_history_socrates.html',
    'sections/05_history_heraclitus.html',
    'sections/06_history_early.html',
    'sections/07_history_middle.html',
    'sections/08_history_late.html',
    'sections/09_ontology_monism.html',
    'sections/10_ontology_pantheism.html',
    'sections/11_ontology_determinism.html',
    'sections/12_ontology_compatibilism.html',
    'sections/13_epistemology_process.html',
    'sections/14_epistemology_katalepsis.html',
    'sections/15_logic_comparison.html',
    'sections/16_ethics_goal.html',
    'sections/17_ethics_good_bad.html',
    'sections/18_ethics_oikeiosis.html',
    'sections/19_ethics_passions.html',
    'sections/20_ethics_control.html',
    'sections/21_values_cosmopolitanism.html',
    'sections/22_values_resilience.html',
    'sections/23_limitations.html',
    'sections/24_modern_cbt.html',
    'sections/25_conclusion.html',
    'sections/26_thank_you.html'
];

const wrapper = document.getElementById('slides_wrapper');
let currentSlide = 0;
let isPresenting = false;

// Load all slides
async function loadSlides() {
    try {
        const promises = slidesList.map(url => fetch(url).then(res => {
            if (!res.ok) throw new Error(`Could not load ${url}`);
            return res.text();
        }));

        const contents = await Promise.all(promises);

        contents.forEach((html, index) => {
            const div = document.createElement('div');
            // Extract the body content or just inject raw if it's a fragment
            // Ideally fragments should just be the .slide-container
            div.innerHTML = html;
            // Ensure the root element is correct
            const slide = div.querySelector('.slide-container') || div.firstElementChild;
            if (slide) {
                slide.id = `slide-${index}`;
                wrapper.appendChild(slide);
            }
        });

        document.getElementById('loading').style.display = 'none';
        updateCounter();

    } catch (error) {
        console.error(error);
        document.getElementById('loading').innerHTML = `
            <div style="text-align: center; color: #ff6b6b;">
                <h1>Lỗi tải trang!</h1>
                <p>Trình duyệt chặn tải file trực tiếp (CORS Policy).</p>
                <div style="background: #333; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <h3>Cách khắc phục:</h3>
                    <p>Hãy chạy file <code>start_presentation.bat</code> trong thư mục.</p>
                </div>
            </div>
        `;
    }
}

function updateCounter() {
    const total = document.querySelectorAll('.slide-container').length;
    document.getElementById('counter').innerText = `${currentSlide + 1} / ${total}`;
}

function updateView() {
    const slides = document.querySelectorAll('.slide-container');
    updateCounter();

    if (isPresenting) {
        slides.forEach((s, i) => {
            s.classList.toggle('active', i === currentSlide);
        });
    } else {
        slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function nextSlide() {
    const total = document.querySelectorAll('.slide-container').length;
    if (currentSlide < total - 1) {
        currentSlide++;
        updateView();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateView();
    }
}

function togglePresentation() {
    const slides = document.querySelectorAll('.slide-container');
    isPresenting = !isPresenting;
    document.body.classList.toggle('presentation-mode');

    if (isPresenting) {
        document.documentElement.requestFullscreen().catch(e => { });
        updateView();
    } else {
        document.exitFullscreen().catch(e => { });
        slides.forEach(s => s.classList.remove('active'));
    }
}

// Keyboard nav
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'f' || e.key === 'F') togglePresentation();
});

// Init
loadSlides();
