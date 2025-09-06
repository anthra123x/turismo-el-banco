document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica del Modal de Galería con Bootstrap ---

    const galleryModalElement = document.getElementById('galleryModal');
    const galleryModal = new bootstrap.Modal(galleryModalElement);

    const modalTitle = document.getElementById('galleryModalLabel');
    const modalDescription = galleryModalElement.querySelector('.modal-description');
    const modalGallery = galleryModalElement.querySelector('.modal-gallery');
    const modalMainImage = document.getElementById('modalMainImage');

    document.querySelectorAll('.feature-item').forEach(card => {
        // Asegurarse de que la tarjeta tiene datos para el modal
        if (card.dataset.description && card.dataset.images) {
            card.style.cursor = 'pointer'; // Indica que es clickeable
            card.addEventListener('click', () => {
                const title = card.querySelector('.card-title').textContent;
                const description = card.dataset.description;
                const images = card.dataset.images.split(',').map(img => img.trim());

                // 1. Poblar el contenido del modal
                modalTitle.textContent = title;
                modalDescription.textContent = description;
                
                // 2. Limpiar y poblar la galería de miniaturas
                modalGallery.innerHTML = '';
                images.forEach((src, index) => {
                    if (src) {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = `Miniatura de ${title} ${index + 1}`;
                        img.dataset.index = index;
                        
                        // Añadir evento para cambiar la imagen principal al hacer clic
                        img.addEventListener('click', (e) => {
                            modalMainImage.src = e.target.src;
                            // Resaltar la miniatura activa
                            document.querySelectorAll('.modal-gallery img').forEach(i => i.classList.remove('active-image'));
                            e.target.classList.add('active-image');
                        });

                        modalGallery.appendChild(img);
                    }
                });

                // 3. Establecer la imagen principal inicial y resaltar la primera miniatura
                if (images.length > 0) {
                    modalMainImage.src = images[0];
                    const firstThumbnail = modalGallery.querySelector('img');
                    if (firstThumbnail) {
                        firstThumbnail.classList.add('active-image');
                    }
                }

                // 4. Mostrar el modal
                galleryModal.show();
            });
        }
    });
});
