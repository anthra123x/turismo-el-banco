document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para la barra de navegación transparente ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // --- Lógica de la Agenda de Eventos ---
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        const monthYearElement = document.getElementById('month-year-timeline');
        const timelineListElement = document.getElementById('timeline-list');
        const prevMonthButton = document.getElementById('prev-month-timeline');
        const nextMonthButton = document.getElementById('next-month-timeline');
        
        let currentDate = new Date();

        const allEvents = [
            { month: 2, day: 2, title: "Aniversario de Fundación", icon: "fa-calendar-star", description: "Se conmemora la fundación del municipio con actos cívicos, desfiles y eventos culturales." },
            { month: 6, day: 24, title: "Festival Nacional de la Cumbia", icon: "fa-music", description: "El evento cultural más emblemático de El Banco, un homenaje al maestro José Barros." },
            { month: 9, day: 16, title: "Día de Amor y Amistad", icon: "fa-heart", description: "Una fecha especial para celebrar la amistad y el amor." },
            { month: 12, day: 8, title: "Fiestas de la Inmaculada Concepción", icon: "fa-church", description: "El inicio de la temporada navideña se marca con esta tradicional fiesta patronal." }
        ];

        const renderTimeline = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            monthYearElement.textContent = `${currentDate.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${year}`;
            timelineListElement.innerHTML = '';

            const eventsForMonth = allEvents.filter(event => event.month === month + 1).sort((a, b) => a.day - b.day);

            if (eventsForMonth.length === 0) {
                timelineListElement.innerHTML = '<div class="no-events-timeline">No hay eventos programados para este mes.</div>';
                return;
            }

            eventsForMonth.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('timeline-card', 'animate-on-scroll');
                eventElement.innerHTML = `
                    <div class="timeline-icon"><i class="fas ${event.icon}"></i></div>
                    <div class="timeline-date">${event.day} <small>${currentDate.toLocaleString('es-ES', { month: 'short' }).toUpperCase()}</small></div>
                    <div class="timeline-content">
                        <h5>${event.title}</h5>
                        <p>${event.description}</p>
                    </div>
                `;
                timelineListElement.appendChild(eventElement);
            });
            observeAnimatedElements(); 
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

    // --- Lógica del Modal de Galería ---
    const galleryModalElement = document.getElementById('galleryModal');
    if (galleryModalElement) {
        const galleryModal = new bootstrap.Modal(galleryModalElement);
        const modalTitle = document.getElementById('galleryModalLabel');
        const modalDescription = galleryModalElement.querySelector('.modal-description');
        const modalGallery = galleryModalElement.querySelector('.modal-gallery');
        const modalMainImage = document.getElementById('modalMainImage');

        document.querySelector('main').addEventListener('click', (e) => {
            const card = e.target.closest('.feature-item');
            if (!card) return;

            const description = card.dataset.description;
            const images = card.dataset.images;

            if (description && images) {
                const title = card.querySelector('.card-title').textContent;
                const imageList = images.split(',').map(img => img.trim());

                modalTitle.textContent = title;
                modalDescription.textContent = description;
                modalGallery.innerHTML = '';

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
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Lógica del Filtro de Categorías ---
    const filterButtonsContainer = document.getElementById('filter-buttons');
    if (filterButtonsContainer) {
        filterButtonsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const filter = e.target.dataset.filter;
                document.querySelector('#filter-buttons .btn-primary').classList.replace('btn-primary', 'btn-outline-primary');
                e.target.classList.replace('btn-outline-primary', 'btn-primary');

                document.querySelectorAll('#lugares .filter-item').forEach(item => {
                    const categories = item.dataset.category.split(' ');
                    item.style.display = (filter === 'all' || categories.includes(filter)) ? 'block' : 'none';
                });
            }
        });
    }

    // --- Lógica para Animaciones de Scroll ---
    const observeAnimatedElements = () => {
        if ('IntersectionObserver' in window) {
            const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            elementsToAnimate.forEach(element => observer.observe(element));
        }
    };
    
    document.querySelectorAll('#lugares .filter-item, #gastronomia .col-lg-6, .timeline-card').forEach(el => el.classList.add('animate-on-scroll'));
    
    observeAnimatedElements();
});
