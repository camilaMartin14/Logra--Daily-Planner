# Logra API - Complete Integration Guide for Frontend

## Overview

This document provides a complete, ready-to-use integration guide for the Logra Daily Planner backend API. All endpoints are fully functional and tested.

---

## Base Configuration

### Server URL
- **Development**: `http://localhost:5000` or `https://localhost:5001`
- **Production**: Configure your production domain

### Database
- **Type**: SQLite (`logra.db`)
- **Location**: Project root directory
- **Auto-created**: Yes, on first application run

### Connection String
```
Data Source=logra.db
```

---

## Authentication Flow

### 1. User Registration

**Endpoint**: `POST /api/user/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response** (201 Created):
```json
{
  "id": 1
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Email already registered"
}
```

**Frontend Implementation**:
```javascript
async function registerUser(email, password, firstName, lastName) {
  const response = await fetch('http://localhost:5000/api/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName })
  });
  
  if (!response.ok) throw new Error('Registration failed');
  const data = await response.json();
  return data.id;
}
```

---

### 2. User Login

**Endpoint**: `POST /api/user/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM2MTE0NDAwLCJleHAiOjE3MzYxMTgwMDB9.SignatureHere",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid credentials"
}
```

**Frontend Implementation**:
```javascript
async function loginUser(email, password) {
  const response = await fetch('http://localhost:5000/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  
  // Store token in localStorage or sessionStorage
  localStorage.setItem('authToken', data.token);
  return data.user;
}
```

**Token Storage Best Practices**:
- Store in `localStorage` for persistent login (less secure but convenient)
- Store in `sessionStorage` for session-only login
- Consider using httpOnly cookies for highest security (requires CORS adjustments)

---

### 3. Get Current User Profile

**Endpoint**: `GET /api/user/me`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid or expired token"
}
```

**Frontend Implementation**:
```javascript
async function getCurrentUser(token) {
  const response = await fetch('http://localhost:5000/api/user/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch user');
  return await response.json();
}

// Helper: Get token from storage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper: Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
}
```

---

## Day Management Endpoints

### 4. Create a New Day

**Endpoint**: `POST /api/day`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "date": "2026-01-06T00:00:00",
  "mood": "happy",
  "dailyNote": "Had a productive day",
  "morningNote": "Woke up feeling energetic",
  "waterIntake": 8,
  "sleepHours": 8,
  "breakfast": "Oatmeal with berries",
  "lunch": "Grilled chicken salad",
  "dinner": "Spaghetti carbonara",
  "snack": "Apple with peanut butter"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Date required"
}
```

**Frontend Implementation**:
```javascript
async function createDay(dayData) {
  const token = getAuthToken();
  const response = await fetch('http://localhost:5000/api/day', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dayData)
  });
  
  if (!response.ok) throw new Error('Failed to create day');
  return await response.json();
}

// Example usage
const newDay = await createDay({
  date: new Date().toISOString(),
  mood: 'happy',
  dailyNote: 'Great day!',
  breakfast: 'Eggs',
  lunch: 'Sandwich',
  dinner: 'Pizza'
});
```

---

### 5. Get Day by ID

**Endpoint**: `GET /api/day/{dayId}`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `dayId` (integer): The ID of the day to retrieve

**Success Response** (200 OK):
```json
{
  "id": 1,
  "date": "2026-01-06T00:00:00",
  "mood": "happy",
  "dailyNote": "Had a productive day",
  "morningNote": "Woke up feeling energetic",
  "waterIntake": 8,
  "sleepHours": 8,
  "breakfast": "Oatmeal with berries",
  "lunch": "Grilled chicken salad",
  "dinner": "Spaghetti carbonara",
  "snack": "Apple with peanut butter"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Day not found"
}
```

**Frontend Implementation**:
```javascript
async function getDayById(dayId) {
  const token = getAuthToken();
  const response = await fetch(`http://localhost:5000/api/day/${dayId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) throw new Error('Day not found');
    throw new Error('Failed to fetch day');
  }
  return await response.json();
}
```

---

### 6. Get or Create Day by Date

**Endpoint**: `GET /api/day/date/{date}`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `date` (string): Date in `YYYY-MM-DD` format

**Behavior**:
- Returns existing day if found
- Creates new day with default values if not found
- User ID extracted automatically from JWT token

**Success Response** (200 OK):
```json
{
  "id": 1,
  "date": "2026-01-06T00:00:00",
  "mood": "",
  "dailyNote": "",
  "morningNote": "",
  "waterIntake": 0,
  "sleepHours": null,
  "breakfast": "",
  "lunch": "",
  "dinner": "",
  "snack": ""
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid or expired token"
}
```

**Frontend Implementation**:
```javascript
async function getOrCreateDayByDate(dateString) {
  // dateString format: "2026-01-06"
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:5000/api/day/date/${dateString}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to get/create day');
  return await response.json();
}

// Example usage - Get today's day
const today = new Date().toISOString().split('T')[0]; // "2026-01-06"
const todayData = await getOrCreateDayByDate(today);
```

---

### 7. Update Day

**Endpoint**: `PUT /api/day/{dayId}`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `dayId` (integer): The ID of the day to update

**Request Body** (all fields optional):
```json
{
  "mood": "tired",
  "dailyNote": "Long day at work",
  "morningNote": "Didn't sleep well",
  "waterIntake": 6,
  "sleepHours": 6,
  "breakfast": "Toast",
  "lunch": "Soup",
  "dinner": "Fish",
  "snack": "Orange"
}
```

**Success Response** (204 No Content):
```
(empty body)
```

**Error Response** (404 Not Found):
```json
{
  "error": "Day not found"
}
```

**Frontend Implementation**:
```javascript
async function updateDay(dayId, updates) {
  const token = getAuthToken();
  const response = await fetch(`http://localhost:5000/api/day/${dayId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) throw new Error('Failed to update day');
  // 204 No Content response - no JSON body
}

// Example usage
await updateDay(1, {
  mood: 'excited',
  waterIntake: 10,
  breakfast: 'Smoothie bowl'
});
```

---

## Task Management Endpoints

### 8. Create Task

**Endpoint**: `POST /api/days/{dayId}/tasks`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `dayId` (integer): The ID of the day

**Request Body**:
```json
{
  "description": "Finish project report"
}
```

**Success Response** (201 Created):
```json
{
  "id": 1
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid or expired token"
}
```

**Frontend Implementation**:
```javascript
async function createTask(dayId, description) {
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:5000/api/days/${dayId}/tasks`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description })
    }
  );
  
  if (!response.ok) throw new Error('Failed to create task');
  return await response.json();
}

// Example usage
const newTask = await createTask(1, 'Buy groceries');
console.log(newTask.id); // 1
```

---

### 9. Get Tasks by Day

**Endpoint**: `GET /api/days/{dayId}/tasks`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `dayId` (integer): The ID of the day

**Success Response** (200 OK):
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
  },
  {
    "id": 3,
    "description": "Call mom",
    "isCompleted": false
  }
]
```

**Empty Response** (200 OK):
```json
[]
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid or expired token"
}
```

**Frontend Implementation**:
```javascript
async function getTasksByDay(dayId) {
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:5000/api/days/${dayId}/tasks`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return await response.json();
}

// Example usage
const tasks = await getTasksByDay(1);
const completedTasks = tasks.filter(t => t.isCompleted);
const pendingTasks = tasks.filter(t => !t.isCompleted);
```

---

### 10. Get Task by ID

**Endpoint**: `GET /api/tasks/{taskId}`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `taskId` (integer): The ID of the task

**Success Response** (200 OK):
```json
{
  "id": 1,
  "description": "Buy groceries",
  "isCompleted": false
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Task not found"
}
```

**Frontend Implementation**:
```javascript
async function getTaskById(taskId) {
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:5000/api/tasks/${taskId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    if (response.status === 404) throw new Error('Task not found');
    throw new Error('Failed to fetch task');
  }
  return await response.json();
}
```

---

### 11. Update Task

**Endpoint**: `PUT /api/tasks/{taskId}`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `taskId` (integer): The ID of the task

**Request Body**:
```json
{
  "description": "Buy groceries and cook dinner",
  "isCompleted": true
}
```

**Success Response** (204 No Content):
```
(empty body)
```

**Error Response** (404 Not Found):
```json
{
  "error": "Task not found"
}
```

**Frontend Implementation**:
```javascript
async function updateTask(taskId, updates) {
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:5000/api/tasks/${taskId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    }
  );
  
  if (!response.ok) throw new Error('Failed to update task');
}

// Example usage - Mark task as complete
await updateTask(1, {
  description: 'Buy groceries',
  isCompleted: true
});
```

---

### 12. Delete Task

**Endpoint**: `DELETE /api/tasks/{taskId}`

**Headers Required**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
- `taskId` (integer): The ID of the task

**Success Response** (204 No Content):
```
(empty body)
```

**Error Response** (404 Not Found):
```json
{
  "error": "Task not found"
}
```

**Frontend Implementation**:
```javascript
async function deleteTask(taskId) {
  const token = getAuthToken();
  const response = await fetch(
    `http://localhost:5000/api/tasks/${taskId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to delete task');
}

// Example usage
await deleteTask(1);
```

---

## Complete Frontend Integration Example

```javascript
// API Service Class
class LograAPI {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  // Auth
  async register(email, password, firstName, lastName) {
    const res = await fetch(`${this.baseUrl}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    if (!res.ok) throw new Error('Registration failed');
    return await res.json();
  }

  async login(email, password) {
    const res = await fetch(`${this.baseUrl}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    this.token = data.token;
    localStorage.setItem('authToken', data.token);
    return data.user;
  }

  async getCurrentUser() {
    const res = await fetch(`${this.baseUrl}/api/user/me`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
  }

  // Days
  async createDay(dayData) {
    const res = await fetch(`${this.baseUrl}/api/day`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dayData)
    });
    if (!res.ok) throw new Error('Failed to create day');
    return await res.json();
  }

  async getDayById(dayId) {
    const res = await fetch(`${this.baseUrl}/api/day/${dayId}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch day');
    return await res.json();
  }

  async getDayByDate(dateString) {
    const res = await fetch(`${this.baseUrl}/api/day/date/${dateString}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch day');
    return await res.json();
  }

  async updateDay(dayId, updates) {
    const res = await fetch(`${this.baseUrl}/api/day/${dayId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update day');
  }

  // Tasks
  async createTask(dayId, description) {
    const res = await fetch(`${this.baseUrl}/api/days/${dayId}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description })
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
  }

  async getTasksByDay(dayId) {
    const res = await fetch(`${this.baseUrl}/api/days/${dayId}/tasks`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  }

  async updateTask(taskId, updates) {
    const res = await fetch(`${this.baseUrl}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update task');
  }

  async deleteTask(taskId) {
    const res = await fetch(`${this.baseUrl}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    if (!res.ok) throw new Error('Failed to delete task');
  }
}

// Usage
const api = new LograAPI();

// Register and login
await api.register('user@example.com', 'Pass123!', 'John', 'Doe');
const user = await api.login('user@example.com', 'Pass123!');

// Get today's day
const today = new Date().toISOString().split('T')[0];
const day = await api.getDayByDate(today);

// Create and manage tasks
const task = await api.createTask(day.id, 'Buy milk');
const tasks = await api.getTasksByDay(day.id);
await api.updateTask(task.id, { isCompleted: true });
```

---

## HTTP Status Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `204` | No Content | Successful operation, no response body |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing/invalid authentication token |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Server-side error occurred |

---

## Environment Setup

Create a `.env` file in your frontend project:
```
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

Then use in your app:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## Notes

- All timestamps are in ISO 8601 format (`YYYY-MM-DDTHH:mm:ss`)
- Tokens expire after 60 minutes (configurable in `appsettings.json`)
- CORS is enabled for all origins in development
- Database auto-generates IDs (don't send `id` in POST requests)
- Password must be at least 8 characters with mixed case and numbers
