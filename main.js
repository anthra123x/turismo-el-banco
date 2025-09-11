document.addEventListener('DOMContentLoaded', () => {

    // --- Optimización: Almacenamiento en caché de elementos del DOM ---
    const navbar = document.querySelector('.navbar');
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const galleryModalElement = document.getElementById('galleryModal');
    const eventModalElement = document.getElementById('eventModal');

    // --- Lógica para la barra de navegación transparente ---
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
    }

    // --- Lógica de la Agenda de Eventos (Diseño de Línea de Tiempo Vertical) ---
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        const monthYearElement = document.getElementById('month-year-timeline');
        const timelineListElement = document.getElementById('timeline-list');
        const prevMonthButton = document.getElementById('prev-month-timeline');
        const nextMonthButton = document.getElementById('next-month-timeline');
        const eventModal = new bootstrap.Modal(eventModalElement);
        const eventModalTitle = document.getElementById('eventModalLabel');
        const eventDetailsElement = document.getElementById('event-details');

        let currentDate = new Date();

        // ====================================================================
        // ====> ¡AQUÍ PUEDES EDITAR TUS EVENTOS! <====
        // month: 1 (Enero) a 12 (Diciembre)
        // ====================================================================
        const allEvents = [
            {
                month: 2, day: 2,
                title: "Aniversario de Fundación",
                description: "Se conmemora la fundación del municipio con actos cívicos, desfiles y eventos culturales que resaltan la importancia histórica de El Banco como puerto y centro de comercio."
            },
            {
                month: 6, day: 24,
                title: "Festival Nacional de la Cumbia",
                description: "El evento cultural más emblemático de El Banco. Un homenaje al maestro José Barros y una celebración de la cumbia como patrimonio colombiano, que atrae a artistas y turistas de todo el país."
            },
            {
                month: 9, day: 16,
                title: "Día de Amor y Amistad",
                description: "Una fecha especial para celebrar la amistad y el amor, con diversas actividades comerciales y culturales en el municipio."
            },
            {
                month: 12, day: 8,
                title: "Fiestas de la Inmaculada Concepción",
                description: "El inicio de la temporada navideña se marca con esta tradicional fiesta patronal, que incluye procesiones, música y el famoso día de las velitas."
            }
        ];

        const renderTimeline = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth(); // 0-11

            monthYearElement.textContent = `${currentDate.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${year}`;
            timelineListElement.innerHTML = '';

            const eventsForMonth = allEvents
                .filter(event => event.month === month + 1)
                .sort((a, b) => a.day - b.day);

            if (eventsForMonth.length === 0) {
                timelineListElement.innerHTML = '<div class="no-events-timeline">No hay eventos programados para este mes.</div>';
                return;
            }

            eventsForMonth.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('timeline-card');
                eventElement.innerHTML = `
                    <div class="timeline-date">${event.day}</div>
                    <div class="timeline-content">
                        <h5>${event.title}</h5>
                        <p>${event.description}</p>
                    </div>
                `;
                timelineListElement.appendChild(eventElement);
            });
        };

        prevMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderTimeline();
        });

        nextMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderTimeline();
        });

        renderTimeline();
    }

    // --- Lógica del Modal de Galería (Optimizada) ---
    if (galleryModalElement) {
        const galleryModal = new bootstrap.Modal(galleryModalElement);
        const modalTitle = document.getElementById('galleryModalLabel');
        const modalDescription = galleryModalElement.querySelector('.modal-description');
        const modalGallery = galleryModalElement.querySelector('.modal-gallery');
        const modalMainImage = document.getElementById('modalMainImage');

        document.querySelectorAll('.feature-item').forEach(card => {
            const description = card.dataset.description;
            const images = card.dataset.images;

            if (description && images) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    const title = card.querySelector('.card-title').textContent;
                    const imageList = images.split(',').map(img => img.trim());

                    modalTitle.textContent = title;
                    modalDescription.textContent = description;
                    modalGallery.innerHTML = ''; // Limpiar galería anterior

                    imageList.forEach((src, index) => {
                        if (src) {
                            const img = document.createElement('img');
                            img.src = src;
                            img.alt = `Miniatura de ${title} ${index + 1}`;
                            img.addEventListener('click', (e) => {
                                modalMainImage.src = e.target.src;
                                modalGallery.querySelectorAll('img').forEach(i => i.classList.remove('active-image'));
                                e.target.classList.add('active-image');
                            });
                            modalGallery.appendChild(img);
                        }
                    });

                    if (imageList.length > 0) {
                        modalMainImage.src = imageList[0];
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
    document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Lógica del Filtro de Categorías ---
    if (filterButtonsContainer) {
        const filterButtons = filterButtonsContainer.querySelectorAll('button');
        const filterItems = document.querySelectorAll('#lugares .filter-item');

        filterButtonsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const filter = e.target.dataset.filter;

                filterButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-primary');
                });
                e.target.classList.add('btn-primary');
                e.target.classList.remove('btn-outline-primary');

                filterItems.forEach(item => {
                    const categories = item.dataset.category.split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }
});
