# 🎯 Logra — Daily Planner

> **Transforma intenciones en acciones.**
> Una plataforma de productividad minimalista diseñada para organizar tu día, gestionar hábitos y mantener el enfoque, construida con una arquitectura robusta y moderna.


---

## 📖 Sobre el Proyecto

**Logra** nace de la necesidad de una herramienta que combine la planificación diaria con el bienestar personal, sin la complejidad de los gestores de proyectos empresariales.

Este proyecto demuestra la implementación de una **aplicación Full Stack** completa, resolviendo desafíos reales como la sincronización de datos, la gestión de estado en el cliente y la optimización de consultas en el servidor.

🔗 **Demo Desplegada:** [Ver en Vercel](https://logra-psi.vercel.app/)

---

## 🚀 Stack Tecnológico

### Backend (.NET Core)
Construido con un enfoque en **Clean Architecture** y rendimiento.
- **Framework:** ASP.NET Core 8 Web API.
- **ORM:** Entity Framework Core (Code First).
- **Base de Datos:** SQL Server / SQLite (configurable).
- **Seguridad:** Autenticación JWT (JSON Web Tokens) y Hashing de contraseñas.
- **Patrones:** Repository Pattern, Dependency Injection, DTO Mapping.

### Frontend (Modern Vanilla JS)
Una SPA (Single Page Application) ligera y rápida sin dependencias pesadas de frameworks.
- **Core:** JavaScript ES6+ (Módulos ES).
- **Estilos:** CSS3 nativo (Custom Properties, Flexbox, Grid) con diseño responsivo.
- **Arquitectura:** Gestión de estado centralizada y renderizado dinámico.
- **Interacción:** Drag & Drop nativo para reordenamiento de tareas.
- **Integración:** Fetch API con interceptores para manejo de tokens.

---

## ✨ Características Destacadas

### ⚡ Productividad y UX
- **Planificación Diaria:** Vista enfocada en el día actual con navegación intuitiva por calendario.
- **Drag & Drop:** Reorganiza tus tareas y notas arrastrando y soltando (UX fluida).
- **Categorización Visual:** Sistema de etiquetas por colores para tareas y notas.
- **Modo Híbrido:** Funcionalidad offline-first con sincronización automática al conectar.

### 🛠️ Aspectos Técnicos Relevantes
- **Optimización de Rendimiento:** Resolución del problema *N+1* en consultas de Entity Framework mediante `Include` y proyección a DTOs.
- **Seguridad Robusta:** Endpoints protegidos, validación de datos y manejo seguro de sesiones.
- **Código Limpio:** Separación estricta de responsabilidades (Controllers vs Services vs Data Access).
- **API RESTful:** Diseño de endpoints estandarizado y predecible.

---

## 🔧 Instalación y Despliegue Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina.

### Prerrequisitos
- .NET SDK 8.0
- SQL Server (o modificar connection string para otra BD)
- Navegador Web moderno

### 1. Configuración del Backend
```bash
# Clonar el repositorio
git clone <url-del-repo>

# Navegar al directorio de la API
cd Logra-Back/Logra-API

# Restaurar dependencias
dotnet restore

# Actualizar base de datos (Aplicar migraciones)
dotnet ef database update

# Ejecutar la API
dotnet run
# La API estará disponible en http://localhost:5169 (o puerto configurado)
```

### 2. Configuración del Frontend
Al ser Vanilla JS, no requiere `npm install` ni build steps complejos para desarrollo.
1. Navega a la carpeta `Logra-Front`.
2. Abre el archivo `index.html` con una extensión como **Live Server** (VS Code) o cualquier servidor estático local.
3. Asegúrate de que `api.js` apunte a tu URL local del backend.

---

## 📂 Estructura del Proyecto

```
Logra/
├── Logra-API/          # Backend .NET Core
│   ├── Controllers/    # Endpoints de la API
│   ├── Services/       # Lógica de negocio
│   ├── DTOs/           # Transferencia de datos (sin exponer entidades)
│   └── Models/         # Entidades de dominio (EF Core)
│
└── Logra-Front/        # Frontend Cliente
    ├── js/             # Lógica modular (api, ui, auth...)
    ├── styles.css      # Estilos globales y componentes
    └── index.html      # Punto de entrada SPA
```


