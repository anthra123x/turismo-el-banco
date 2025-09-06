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
const featureItems = document.querySelectorAll('.feature-item');

featureItems.forEach(item => {
    // Asegurarse de que el item tiene los datos necesarios para el modal
    if (item.dataset.description && item.dataset.images) {
        item.addEventListener('click', () => {
            const description = item.dataset.description;
            // Limpiar espacios en blanco y crear el array
            const images = item.dataset.images.split(',').map(img => img.trim());

            // Limpiar la galería anterior
            modalGallery.innerHTML = '';
            
            // Poblar la galería con las nuevas imágenes
            images.forEach(src => {
                if (src) { // Asegurarse de que la fuente no esté vacía
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = description.substring(0, 30); // Añadir alt text por accesibilidad
                    modalGallery.appendChild(img);
                }
            });

            // Añadir la descripción
            modalDescription.textContent = description;
            
            // Mostrar el modal
            modal.style.display = 'block';
        });
    }
});

// Función para cerrar el modal
function closeModal() {
    modal.style.display = 'none';
}

closeButton.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    // Cerrar si se hace clic fuera del contenido del modal
    if (event.target == modal) {
        closeModal();
    }
});

// Cerrar con la tecla Escape
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});