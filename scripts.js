
function initInfiniteCarousel(selector, speed = 1) {
    const carousel = document.querySelector(selector);
    let offset = 0;
    
    function tick() {
        offset -= speed;
        carousel.style.transform = `translateX(${offset}px)`;
        
        const firstItem = carousel.children[0];
        const style = getComputedStyle(firstItem);
        const marginLeft = parseFloat(style.marginLeft) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        const firstWidth = firstItem.getBoundingClientRect().width + marginLeft + marginRight;
        //const firstWidth = firstItem.getBoundingClientRect().width + 40; // incluye gap (40px en CSS)

        // si el primer ítem ya salió completamente
        if (-offset >= firstWidth) {
            // moverlo al final
            carousel.appendChild(firstItem);
            // reajustar offset para que el salto sea imperceptible
            offset += firstWidth;
            carousel.style.transform = `translateX(${offset}px)`;
        }

        requestAnimationFrame(tick);
    }

    tick();
}

document.addEventListener("DOMContentLoaded", () => {
    initInfiniteCarousel("#vectorCarousel", 0.5); // velocidad: 0.5px por frame aprox.
});


//parallax
const parallax = document.querySelector(".parallax");
window.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
        parallax.style.backgroundPositionY = -(window.scrollY * 0.5) + "px";
    });
});

//Videos autoplay
document.addEventListener('DOMContentLoaded', () => {
    const bgVideo = document.querySelector('.header-video');
    if (bgVideo) {
        const videoSrc = bgVideo.dataset.video;
        bgVideo.src = videoSrc;
        bgVideo.load();
        bgVideo.play().catch(console.log);
    }
});

//Fotos productos
const carousels = document.querySelectorAll('.carousel-fade');

carousels.forEach(carousel => {
    const images = carousel.querySelectorAll('img');
    let current = 0;

    // Muestra la primera imagen
    images[current].classList.add('active');

    function nextImage() {
        images[current].classList.remove('active');
        current = (current + 1) % images.length;
        images[current].classList.add('active');
    }

    // Cambia imagen cada 3 segundos para este carrusel
    setInterval(nextImage, 3000);
}); 