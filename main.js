/**
 * Objeto principal de la aplicación (App)
 * ---------------------------------------
 * Este objeto `App` encapsula toda la lógica de JavaScript del sitio.
 * Se organiza en módulos (navbar, agenda, etc.) para que el código sea más limpio,
 * más fácil de leer y de mantener. Cada módulo tiene su propia responsabilidad.
 * El método `App.init()` es el punto de entrada que inicializa todo.
 */
const App = {
    /**
     * Método de Inicialización
     * Se ejecuta cuando el DOM (la estructura HTML) está completamente cargado.
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.navbar.init();
            this.agenda.init();
            this.galleryModal.init();
            this.smoothScroll.init();
            this.categoryFilter.init();
            this.scrollAnimator.init();
        });
    },

    /**
     * Módulo de la Barra de Navegación
     * Controla el cambio de estilo de la barra de navegación al hacer scroll.
     */
    navbar: {
        init() {
            const navbarEl = document.querySelector('.navbar');
            if (!navbarEl) return;

            // NOTA DE APRENDIZAJE: Para sitios con mucho movimiento en el scroll,
            // este evento podría optimizarse con técnicas como "throttle" o "debounce"
            // para no ejecutar el código cientos de veces por segundo. Para este caso, es suficiente.
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbarEl.classList.add('navbar--scrolled');
                } else {
                    navbarEl.classList.remove('navbar--scrolled');
                }
            });
        }
    },

    /**
     * Módulo de la Agenda de Eventos
     * Gestiona la lógica para mostrar los eventos del mes correspondiente.
     */
    agenda: {
        currentDate: new Date(),
        // Los eventos se gestionan en este array. ¡Fácil de actualizar!
        allEvents: [
            { month: 2, day: 2, title: "Aniversario de Fundación", icon: "fa-calendar-star", description: "Se conmemora la fundación del municipio con actos cívicos, desfiles y eventos culturales." },
            { month: 6, day: 24, title: "Festival Nacional de la Cumbia", icon: "fa-music", description: "El evento cultural más emblemático de El Banco, un homenaje al maestro José Barros." },
            { month: 9, day: 16, title: "Día de Amor y Amistad", icon: "fa-heart", description: "Una fecha especial para celebrar la amistad y el amor." },
            { month: 12, day: 8, title: "Fiestas de la Inmaculada Concepción", icon: "fa-church", description: "El inicio de la temporada navideña se marca con esta tradicional fiesta patronal." }
        ],
        
        init() {
            const container = document.querySelector('.timeline-container');
            if (!container) return;

            this.monthYearElement = document.getElementById('month-year-timeline');
            this.timelineListElement = document.getElementById('timeline-list');
            
            document.getElementById('prev-month-timeline').addEventListener('click', () => this.changeMonth(-1));
            document.getElementById('next-month-timeline').addEventListener('click', () => this.changeMonth(1));
            
            this.render();
        },

        changeMonth(direction) {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
            this.render();
        },

        render() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            this.monthYearElement.textContent = `${this.currentDate.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${year}`;
            this.timelineListElement.innerHTML = '';

            const eventsForMonth = this.allEvents.filter(event => event.month === month + 1).sort((a, b) => a.day - b.day);

            if (eventsForMonth.length === 0) {
                this.timelineListElement.innerHTML = '<div class="no-events-timeline">No hay eventos programados para este mes.</div>';
                return;
            }

            eventsForMonth.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('timeline-card', 'animate-on-scroll');
                eventElement.innerHTML = `
                    <div class="timeline-icon"><i class="fas ${event.icon}"></i></div>
                    <div class="timeline-content">
                        <h5>${event.title}</h5>
                        <p><strong>Fecha:</strong> ${event.day} de ${this.currentDate.toLocaleString('es-ES', { month: 'long' })}</p>
                        <p>${event.description}</p>
                    </div>
                `;
                this.timelineListElement.appendChild(eventElement);
            });
            App.scrollAnimator.observeNewElements();
        }
    },

    /**
     * Módulo del Modal de Galería
     * Controla la apertura y el contenido del modal para lugares y gastronomía.
     */
    galleryModal: {
        init() {
            const modalElement = document.getElementById('galleryModal');
            if (!modalElement) return;

            this.modal = new bootstrap.Modal(modalElement);
            const modalTitle = document.getElementById('galleryModalLabel');
            const modalDescription = modalElement.querySelector('.modal-description');
            const modalGallery = modalElement.querySelector('.modal-gallery');
            const modalMainImage = document.getElementById('modalMainImage');

            // Se usa delegación de eventos para mejorar el rendimiento.
            // En lugar de un listener por tarjeta, hay uno solo en el <main>.
            document.querySelector('main').addEventListener('click', (e) => {
                const card = e.target.closest('.feature-item');
                if (!card) return;

                const { description, images } = card.dataset;

                if (description && images) {
                    const title = card.querySelector('.card-title').textContent;
                    const imageList = images.split(',').map(img => img.trim());

                    modalTitle.textContent = title;
                    modalDescription.textContent = description;
                    modalGallery.innerHTML = '';

                    imageList.forEach(src => {
                        if (src) {
                            const img = document.createElement('img');
                            img.src = src;
                            img.alt = `Miniatura de ${title}`;
                            img.addEventListener('click', (e) => {
                                modalMainImage.src = e.target.src;
                                modalGallery.querySelector('.active-image')?.classList.remove('active-image');
                                e.target.classList.add('active-image');
                            });
                            modalGallery.appendChild(img);
                        }
                    });

                    if (imageList.length > 0) {
                        modalMainImage.src = imageList[0];
                        modalGallery.querySelector('img')?.classList.add('active-image');
                    }
                    this.modal.show();
                }
            });
        }
    },

    /**
     * Módulo de Scroll Suave
     * Hace que los enlaces del menú se desplacen suavemente a la sección correspondiente.
     */
    smoothScroll: {
        init() {
            document.querySelectorAll('.navbar__link').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const navbarHeight = document.querySelector('.navbar').offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                });
            });
        }
    },

    /**
     * Módulo de Filtro de Categorías
     * Filtra los lugares turísticos según la categoría seleccionada.
     */
    categoryFilter: {
        init() {
            const container = document.getElementById('filter-buttons');
            if (!container) return;

            container.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const filter = e.target.dataset.filter;
                    container.querySelector('.btn-primary').classList.replace('btn-primary', 'btn-outline-primary');
                    e.target.classList.replace('btn-outline-primary', 'btn-primary');

                    document.querySelectorAll('#lugares .filter-item').forEach(item => {
                        const categories = item.dataset.category.split(' ');
                        item.style.display = (filter === 'all' || categories.includes(filter)) ? 'block' : 'none';
                    });
                }
            });
        }
    },

    /**
     * Módulo de Animación por Scroll
     * Utiliza IntersectionObserver para añadir clases a los elementos cuando son visibles.
     */
    scrollAnimator: {
        observer: null,
        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries, observerInstance) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            observerInstance.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                // Aplica la clase base a los elementos que queremos animar
                document.querySelectorAll('#lugares .filter-item, #gastronomia .col-lg-6').forEach(el => el.classList.add('animate-on-scroll'));
                this.observeNewElements();
            }
        },
        observeNewElements() {
            if (!this.observer) return;
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(el => this.observer.observe(el));
        }
    }
};

// Punto de entrada: Inicia la aplicación.
App.init();
