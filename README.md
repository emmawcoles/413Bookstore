# IS 413 Mission 11 Bookstore

This project is an online bookstore built with an ASP.NET Core API backend and a React frontend. It uses the provided SQLite database and displays books with pagination, adjustable page size, Bootstrap styling, and title sorting.

## Features

- Connects to the provided `Bookstore.sqlite` database
- Lists all required book fields:
  - Title
  - Author
  - Publisher
  - ISBN
  - Classification
  - Category
  - Number of Pages
  - Price
- Shows 5 books per page by default
- Lets the user change the number of results per page
- Supports sorting by title
- Uses Bootstrap for styling

## Project Structure

- `backend/Mission11.API`
  ASP.NET Core Web API connected to SQLite with Entity Framework Core
- `frontend`
  React + Vite frontend that calls the backend API

## Requirements

Make sure these are installed:

- .NET 10 SDK
- Node.js
- npm

## Database Location

The SQLite database file should be located at:

`backend/Mission11.API/Data/Bookstore.sqlite`

## How to Run

Open two terminals from the project root.

### 1. Start the backend

```powershell
cd backend/Mission11.API
dotnet run
```

The API runs on:

- `http://localhost:5002`
- `https://localhost:7129`

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs on:

- `http://localhost:5173`

The Vite dev server is configured to proxy `/api` requests to the backend.

## Build and Lint

### Backend build

```powershell
cd backend/Mission11.API
dotnet build
```

### Frontend build

```powershell
cd frontend
npm run build
```

### Frontend lint

```powershell
cd frontend
npm run lint
```

## Main API Endpoint

### Get paginated books

`GET /api/books?pageSize=5&pageNum=1&sortOrder=asc`

Query parameters:

- `pageSize`: number of books per page
- `pageNum`: current page number
- `sortOrder`: `asc` or `desc`

## Notes

- The backend model matches the `Books` table in the provided database.
- The frontend resets to page 1 when the page size changes.
- Title sorting can be toggled between ascending and descending order.
