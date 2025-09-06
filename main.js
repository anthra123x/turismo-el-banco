document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del Modal de Galería con Bootstrap ---
    const galleryModalElement = document.getElementById('galleryModal');
    if (galleryModalElement) {
        const galleryModal = new bootstrap.Modal(galleryModalElement);
        const modalTitle = document.getElementById('galleryModalLabel');
        const modalDescription = galleryModalElement.querySelector('.modal-description');
        const modalGallery = galleryModalElement.querySelector('.modal-gallery');
        const modalMainImage = document.getElementById('modalMainImage');

        document.querySelectorAll('.feature-item').forEach(card => {
            if (card.dataset.description && card.dataset.images) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    const title = card.querySelector('.card-title').textContent;
                    const description = card.dataset.description;
                    const images = card.dataset.images.split(',').map(img => img.trim());

                    modalTitle.textContent = title;
                    modalDescription.textContent = description;
                    modalGallery.innerHTML = '';

                    images.forEach((src, index) => {
                        if (src) {
                            const img = document.createElement('img');
                            img.src = src;
                            img.alt = `Miniatura de ${title} ${index + 1}`;
                            img.addEventListener('click', (e) => {
                                modalMainImage.src = e.target.src;
                                document.querySelectorAll('.modal-gallery img').forEach(i => i.classList.remove('active-image'));
                                e.target.classList.add('active-image');
                            });
                            modalGallery.appendChild(img);
                        }
                    });

                    if (images.length > 0) {
                        modalMainImage.src = images[0];
                        const firstThumbnail = modalGallery.querySelector('img');
                        if (firstThumbnail) {
                            firstThumbnail.classList.add('active-image');
                        }
                    }

                    galleryModal.show();
                });
            }
        });
    }

    // --- Lógica de Scroll Suave para la Navegación ---
    const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Lógica del Modo Oscuro/Claro ---
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if(darkModeSwitch) {
        const htmlElement = document.documentElement;
        const applyTheme = (theme) => {
            htmlElement.setAttribute('data-bs-theme', theme);
            const icon = darkModeSwitch.nextElementSibling.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                darkModeSwitch.checked = true;
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                darkModeSwitch.checked = false;
            }
        };

        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        darkModeSwitch.addEventListener('change', () => {
            const newTheme = darkModeSwitch.checked ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // --- Lógica del Filtro de Categorías ---
    const filterButtonsContainer = document.getElementById('filter-buttons');
    if (filterButtonsContainer) {
        const filterButtons = filterButtonsContainer.querySelectorAll('button');
        const filterItems = document.querySelectorAll('#lugares .filter-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-primary');
                });
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-primary');

                const filter = button.dataset.filter;

                filterItems.forEach(item => {
                    const categories = item.dataset.category.split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

});