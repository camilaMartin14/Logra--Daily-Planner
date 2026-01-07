# Logra Daily Planner API

A modern C# ASP.NET Core 8.0 REST API for managing daily planning, task tracking, and personal journaling. This backend connects directly to SQLite for data persistence and provides JWT-based authentication.

## Architecture

- **Framework**: ASP.NET Core 8.0
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Password hashing (PBKDF2) and optional field encryption
- **Pattern**: Repository Pattern + Service Layer

## Database Configuration

### Connection String
```
Data Source=logra.db
```

The SQLite database file (`logra.db`) is created automatically in the project root on first run.

### Database Schema

#### Users Table (`usuarios`)
```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    contraseniaHash TEXT NOT NULL,
    nombre TEXT,
    apellido TEXT,
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Days Table (`dias`)
```sql
CREATE TABLE dias (
    id INTEGER PRIMARY KEY,
    usuarioId INTEGER NOT NULL,
    fecha DATETIME NOT NULL,
    mood TEXT,
    notaDia TEXT,
    notaManiana TEXT,
    aguaConsumida INTEGER,
    horasSueno INTEGER,
    desayuno TEXT,
    almuerzo TEXT,
    cena TEXT,
    snack TEXT,
    UNIQUE(usuarioId, fecha),
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id)
);
```

#### Tasks Table (`tareas`)
```sql
CREATE TABLE tareas (
    id INTEGER PRIMARY KEY,
    diaId INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    realizada BOOLEAN,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(diaId) REFERENCES dias(id)
);
```

## Authentication

### JWT Configuration (`appsettings.json`)
```json
{
  "Jwt": {
    "Key": "djtfgofkdnmgrbhokifdrtnh120i4o23jkm4",
    "Issuer": "Logra",
    "Audience": "Logra-Front",
    "ExpireMinutes": 60
  }
}
```

All protected endpoints require an `Authorization: Bearer <token>` header.

## API Endpoints

### User Management

#### 1. **Register User**
- **Method**: `POST /api/user/register`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Response**: `201 Created`
```json
{
  "id": 1
}
```
- **Error**: `400 Bad Request` if email already registered

---

#### 2. **Login**
- **Method**: `POST /api/user/login`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
- **Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```
- **Error**: `401 Unauthorized` if credentials invalid

---

#### 3. **Get Current User**
- **Method**: `GET /api/user/me`
- **Authentication**: Required (Bearer Token)
- **Response**: `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Error**: `401 Unauthorized` if token invalid or missing

---

### Day Management

#### 4. **Create Day**
- **Method**: `POST /api/day`
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "id": 0,
  "date": "2026-01-06T00:00:00",
  "mood": "happy",
  "dailyNote": "Had a great day!",
  "morningNote": "Starting fresh",
  "waterIntake": 8,
  "sleepHours": 8,
  "breakfast": "Eggs and toast",
  "lunch": "Chicken salad",
  "dinner": "Pasta",
  "snack": "Apple"
}
```
- **Response**: `200 OK`
```json
{
  "id": 1
}
```
- **Error**: `400 Bad Request` if date missing or user not found

---

#### 5. **Get Day by ID**
- **Method**: `GET /api/day/{id}`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `id` (integer)
- **Response**: `200 OK`
```json
{
  "id": 1,
  "date": "2026-01-06T00:00:00",
  "mood": "happy",
  "dailyNote": "Had a great day!",
  "morningNote": "Starting fresh",
  "waterIntake": 8,
  "sleepHours": 8,
  "breakfast": "Eggs and toast",
  "lunch": "Chicken salad",
  "dinner": "Pasta",
  "snack": "Apple"
}
```
- **Error**: `404 Not Found` if day doesn't exist

---

#### 6. **Get or Create Day by Date**
- **Method**: `GET /api/day/date/{date}`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `date` (format: `YYYY-MM-DD`)
- **Response**: `200 OK`
  - Returns existing day or creates new one with default values
```json
{
  "id": 2,
  "date": "2026-01-06T00:00:00",
  "mood": "",
  "dailyNote": "",
  "morningNote": "",
  "waterIntake": 0,
  "sleepHours": 0,
  "breakfast": "",
  "lunch": "",
  "dinner": "",
  "snack": ""
}
```
- **Error**: `401 Unauthorized` if token invalid

---

#### 7. **Update Day**
- **Method**: `PUT /api/day/{id}`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `id` (integer)
- **Request Body**:
```json
{
  "mood": "tired",
  "dailyNote": "Productive day",
  "morningNote": "Good morning",
  "waterIntake": 10,
  "sleepHours": 7,
  "breakfast": "Pancakes",
  "lunch": "Sushi",
  "dinner": "Steak",
  "snack": "Banana"
}
```
- **Response**: `204 No Content`
- **Error**: `404 Not Found` if day doesn't exist

---

### Task Management

#### 8. **Create Task**
- **Method**: `POST /api/days/{dayId}/tasks`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `dayId` (integer)
- **Request Body**:
```json
{
  "description": "Buy groceries"
}
```
- **Response**: `201 Created`
```json
{
  "id": 1
}
```
- **Error**: `401 Unauthorized` if not authenticated

---

#### 9. **Get Tasks by Day**
- **Method**: `GET /api/days/{dayId}/tasks`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `dayId` (integer)
- **Response**: `200 OK`
```json
[
  {
    "id": 1,
    "description": "Buy groceries",
    "isCompleted": false
  },
  {
    "id": 2,
    "description": "Finish report",
    "isCompleted": true
  }
]
```
- **Error**: `401 Unauthorized` if not authenticated

---

#### 10. **Get Task by ID**
- **Method**: `GET /api/tasks/{id}`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `id` (integer)
- **Response**: `200 OK`
```json
{
  "id": 1,
  "description": "Buy groceries",
  "isCompleted": false
}
```
- **Error**: `404 Not Found` if task doesn't exist

---

#### 11. **Update Task**
- **Method**: `PUT /api/tasks/{id}`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `id` (integer)
- **Request Body**:
```json
{
  "description": "Buy groceries and cook dinner",
  "isCompleted": true
}
```
- **Response**: `204 No Content`
- **Error**: `404 Not Found` if task doesn't exist

---

#### 12. **Delete Task**
- **Method**: `DELETE /api/tasks/{id}`
- **Authentication**: Required (Bearer Token)
- **Path Parameters**: `id` (integer)
- **Response**: `204 No Content`
- **Error**: `404 Not Found` if task doesn't exist

---

## Running the Application

### Prerequisites
- .NET 8.0 SDK
- Visual Studio Code or Visual Studio 2022 (optional)

### Build & Run
```bash
cd Logra-API

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Run in development mode
dotnet run

# Run with watch for code changes
dotnet watch run
```

The API will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger UI**: `https://localhost:5001/swagger/index.html`

### Environment Configuration

#### Development (`appsettings.Development.json`)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

#### Production Settings
Set `ASPNETCORE_ENVIRONMENT=Production` before running in production.

## Security Features

### Password Security
- **Algorithm**: PBKDF2 with SHA-256
- **Iterations**: 10,000+
- **Salt Length**: 16 bytes

### Data Encryption
- Optional encryption for sensitive note fields (`DailyNote`, `MorningNote`)
- **Key** configured in `appsettings.json` under `Encryption.Key`
- Automatic encryption/decryption in service layer

### JWT Claims
- `sub` (subject): User ID
- `email`: User email
- `iat` (issued at): Token creation time
- `exp` (expiration): Token expiration time

## Code Structure

```
Logra-API/
├── Controllers/           # HTTP endpoints
│   ├── UserController.cs
│   ├── DayController.cs
│   └── TaskController.cs
├── Models/               # EF Core entities
│   ├── User.cs
│   ├── Day.cs
│   ├── TaskItem.cs
│   └── LograContext.cs
├── DTOs/                 # Data Transfer Objects
│   ├── UserDTO.cs
│   ├── DayDTO.cs
│   └── TaskDTO.cs
├── Repositories/         # Data access layer
│   ├── Interfaces/
│   └── Implementations/
├── Services/             # Business logic
│   ├── Interfaces/
│   └── Implementations/
├── Security/             # Authentication & encryption
│   ├── PasswordHasher.cs
│   ├── JwtTokenGenerator.cs
│   └── EncryptionService.cs
├── Program.cs            # Startup configuration
├── appsettings.json      # Configuration
└── logra.db              # SQLite database (auto-created)
```

## Error Handling

All endpoints return appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `204` | No Content - Successful operation with no response body |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing or invalid authentication |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error - Server error |

## Testing with cURL

### Register a new user
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Create a day (with token from login)
```bash
curl -X POST http://localhost:5000/api/day \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "date": "2026-01-06",
    "mood": "great"
  }'
```

## CORS Configuration

The API allows requests from any origin with the `AllowFrontend` policy:
- Origin: `*` (Any)
- Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Headers: Any

Configure in production by modifying the CORS policy in `Program.cs`.

## Dependencies

Key NuGet packages:
- `Microsoft.EntityFrameworkCore.Sqlite` - SQLite database provider
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT authentication
- `Swashbuckle.AspNetCore` - Swagger/OpenAPI documentation
- `Microsoft.EntityFrameworkCore.Tools` - EF Core migrations and scaffolding

## Notes

- All timestamps are stored as `DATETIME` in SQLite (UTC recommended)
- User IDs are extracted from JWT claims (`ClaimTypes.NameIdentifier`)
- Encrypted fields are decrypted transparently in DTOs
- Database uniqueness constraint: one day per user per date (`UNIQUE(usuarioId, fecha)`)

## Support

For issues or questions, refer to the inline code comments or review the service/repository implementations.
