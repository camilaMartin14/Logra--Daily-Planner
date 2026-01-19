export class Calendar {
    constructor(containerId, onDateSelect) {
        this.wrapper = document.getElementById(containerId);
        if (!this.wrapper) return;
        
        this.grid = document.getElementById('calendar-grid');
        this.monthYearDisplay = document.getElementById('cal-month-year');
        this.onDateSelect = onDateSelect;
        
        this.currentDate = new Date(); 
        this.viewDate = new Date();    
        
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

        if (this.grid) {
            this.grid.addEventListener('click', (e) => this.handleGridClick(e));
        }
    }

    handleGridClick(e) {
        const cell = e.target.closest('.calendar-day');
        if (!cell || cell.classList.contains('other-month')) return;

        const day = parseInt(cell.dataset.day, 10);
        if (isNaN(day)) return;

        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        this.currentDate = new Date(year, month, day);
        this.render();
        
        if (this.onDateSelect) {
            this.onDateSelect(this.currentDate);
        }
    }

    setDate(date) {
        this.currentDate = new Date(date);
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

            // Tiene datos? 
            const localKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            if (localDb[localKey]) {
                el.classList.add('has-data');
            }

            el.dataset.day = i;

            this.grid.appendChild(el);
        }
    }
}
