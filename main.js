// Animación de aparición de secciones al hacer scroll
function revealSectionsOnScroll() {
    const sections = document.querySelectorAll('.section');
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);

// Lógica del Modal
const modal = document.getElementById('modal');
const modalGallery = document.querySelector('.modal-gallery');
const modalDescription = document.querySelector('.modal-description');
const closeButton = document.querySelector('.close-button');
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const description = card.dataset.description;
        const images = card.dataset.images.split(',');

        modalGallery.innerHTML = '';
        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            modalGallery.appendChild(img);
        });

        modalDescription.textContent = description;
        modal.style.display = 'block';
    });
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
