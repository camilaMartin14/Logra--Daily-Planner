export class Calendar {
    constructor(containerId, onDateSelect) {
        this.wrapper = document.getElementById(containerId);
        if (!this.wrapper) return;
        
        this.grid = document.getElementById('calendar-grid');
        this.monthYearDisplay = document.getElementById('cal-month-year');
        this.onDateSelect = onDateSelect;
        
        this.currentDate = new Date(); // Fecha seleccionada
        this.viewDate = new Date();    // Fecha de visualización (mes)
        
        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        const prevBtn = document.getElementById('cal-prev-month');
        const nextBtn = document.getElementById('cal-next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.viewDate.setMonth(this.viewDate.getMonth() - 1);
                this.render();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.viewDate.setMonth(this.viewDate.getMonth() + 1);
                this.render();
            });
        }
    }

    setDate(date) {
        this.currentDate = new Date(date);
        // Si la fecha seleccionada está en un mes distinto al visible, cambiar vista
        if (this.currentDate.getMonth() !== this.viewDate.getMonth() || 
            this.currentDate.getFullYear() !== this.viewDate.getFullYear()) {
            this.viewDate = new Date(date);
        }
        this.render();
    }

    render() {
        if (!this.grid || !this.monthYearDisplay) return;

        this.grid.innerHTML = '';
        
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();
        
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        this.monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        // Headers: Dom, Lun, Mar...
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        days.forEach(day => {
            const el = document.createElement('div');
            el.className = 'calendar-header';
            el.textContent = day;
            this.grid.appendChild(el);
        });

        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Espacios vacíos
        for (let i = 0; i < firstDayOfMonth; i++) {
            const el = document.createElement('div');
            el.className = 'calendar-day other-month';
            this.grid.appendChild(el);
        }

        const today = new Date();
        
        // Obtener datos locales para indicadores (simple check)
        let localDb = {};
        try {
            localDb = JSON.parse(localStorage.getItem('logra_db') || '{}');
        } catch(e) {}

        for (let i = 1; i <= daysInMonth; i++) {
            const el = document.createElement('div');
            el.className = 'calendar-day';
            el.textContent = i;
            
            // Construir fecha para comparaciones
            const d = new Date(year, month, i);
            
            // Seleccionado?
            if (this.currentDate.getDate() === i && 
                this.currentDate.getMonth() === month && 
                this.currentDate.getFullYear() === year) {
                el.classList.add('selected');
            }

            // Hoy?
            if (today.getDate() === i && 
                today.getMonth() === month && 
                today.getFullYear() === year) {
                el.classList.add('today');
            }

            // Tiene datos? (Check local storage key matches planner.js logic)
            const localKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            if (localDb[localKey]) {
                el.classList.add('has-data');
            }

            el.addEventListener('click', () => {
                // Actualizar selección interna
                this.currentDate = new Date(year, month, i);
                this.render();
                // Notificar afuera
                if (this.onDateSelect) {
                    this.onDateSelect(this.currentDate);
                }
            });

            this.grid.appendChild(el);
        }
    }
}
