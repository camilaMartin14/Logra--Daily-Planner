# Logra — Haciendo que las metas pasen a la acción

Logra es una aplicación de productividad clara y liviana, pensada para ayudar a transformar las intenciones diarias en acciones concretas, sin distracciones ni complejidad innecesaria.

Integra planificación diaria, gestión de tareas, notas y seguimiento de hábitos de bienestar en una experiencia simple y enfocada.

## Beneficios clave

- Convierte el caos diario en acciones: permite crear, priorizar y completar tareas por día.

- Organiza notas y recordatorios mediante categorías reutilizables.

- Registra hábitos simples (agua, sueño y comidas) para favorecer decisiones más saludables.

- Funciona offline utilizando localStorage y sincroniza la información al iniciar sesión.

- Seguridad a nivel producción: autenticación y autorización mediante JWT.

## Stack técnico

### Backend

- .NET 8 (ASP.NET Core)

- Entity Framework Core (Code First)

- SQL Server (migraciones incluidas)

### Frontend

- HTML, CSS y JavaScript modular (ES Modules)

- Arquitectura tipo SPA

## Demo pública

Frontend desplegado en Vercel:
https://logra-psi.vercel.app/

## Funcionalidades principales
### Tareas diarias

- Tareas asociadas a días específicos.

- Reordenamiento mediante drag & drop.

- Organización por categorías.

- Posibilidad de marcar tareas de días anteriores como completadas.

### Notas

- Notas activas y archivadas.

- Asociación de categorías.

- Notas persistentes disponibles todos los días.

- Reordenamiento visual mediante drag & drop para una mejor orientación.

### Bienestar

- Registro de consumo de agua.

- Seguimiento de horas de sueño.

- Registro de comidas.

- Estado de ánimo diario para retroalimentación rápida.

### Autenticación y seguridad

- Registro e inicio de sesión de usuarios.

- Autenticación basada en JWT.

- Endpoints protegidos por autorización.

### Público objetivo

- Personas que buscan una herramienta liviana y sin distracciones para organizar su día a día.

- Usuarios que priorizan estructura y claridad por sobre sistemas complejos de productividad.

### Instalación rápida (para demos técnicas)
Requisitos

- .NET 8 SDK

- SQL Server (instancia local o contenedor compatible)

### Pasos
### Backend
```bash
cd Logra-Back/Logra-API
dotnet restore
dotnet build
dotnet ef database update
dotnet run

```

### Frontend
```bash
cd Logra-Front
python -m http.server 5500

```


Por defecto, el frontend en entorno local consume la API desde:
https://localhost:7271/api

## API (resumen funcional)

La API está diseñada bajo un enfoque RESTful, con autenticación basada en JWT y separación clara de responsabilidades por dominio.

### Autenticación y usuarios

POST /api/users/register — Registro de usuario

POST /api/users/login — Inicio de sesión → devuelve JWT

GET /api/users/{id} — Obtener perfil de usuario autenticado

### Días

GET /api/days/today — Obtener o crear el registro del día actual

GET /api/days/{id} — Obtener un día específico

PUT /api/days/{id} — Actualizar información del día (estado de ánimo, notas, bienestar)

### Tareas

POST /api/tasks — Crear una tarea asociada a un día

GET /api/tasks/day/{dayId} — Listar tareas de un día

GET /api/tasks/category/{categoryId} — Filtrar tareas por categoría

PUT /api/tasks/{id} — Actualizar tarea (incluye marcar como completada)

DELETE /api/tasks/{id} — Eliminar tarea

POST /api/tasks/{id}/categories/{categoryId} — Asociar categoría

DELETE /api/tasks/{id}/categories/{categoryId} — Quitar categoría

### Notas

POST /api/notes — Crear nota

GET /api/notes/active — Listar notas activas

GET /api/notes/archived — Listar notas archivadas

GET /api/notes/{id} — Obtener nota por id

PUT /api/notes/{id} — Actualizar nota

DELETE /api/notes/{id} — Eliminar nota

POST /api/notes/{id}/archive — Archivar nota

POST /api/notes/{id}/unarchive — Restaurar nota

POST /api/notes/{id}/categories/{categoryId} — Asociar categoría

DELETE /api/notes/{id}/categories/{categoryId} — Quitar categoría

### Categorías

GET /api/categories — Listar categorías del usuario

POST /api/categories — Crear categoría

PUT /api/categories/{id} — Actualizar categoría

DELETE /api/categories/{id} — Eliminar categoría
