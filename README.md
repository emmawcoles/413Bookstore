# IS 413 Mission 11 and 12 Bookstore

This project is an online bookstore built with an ASP.NET Core API backend and a React frontend. It uses the provided SQLite database and now includes the Mission 11 and Mission 12 requirements: pagination, adjustable page size, title sorting, category filtering, a session-based shopping cart, and Bootstrap-based layout/styling.

## Features

- Connects to the provided `Bookstore.sqlite` database
- Supports backend and frontend category filtering
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
- Includes a shopping cart with:
  - Add to Cart
  - quantity tracking
  - subtotal and total calculations
  - session persistence with `sessionStorage`
  - cart summary on the main page
  - full cart view with Continue Shopping
- Uses Bootstrap Grid for layout
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

### Get paginated books filtered by category

`GET /api/books?pageSize=5&pageNum=1&sortOrder=asc&category=Biography`

Query parameters:

- `pageSize`: number of books per page
- `pageNum`: current page number
- `sortOrder`: `asc` or `desc`
- `category`: optional category filter; use `All` or omit it to return all books

## Notes

- The backend model matches the `Books` table in the provided database.
- The frontend resets to page 1 when the page size changes.
- The frontend resets to page 1 when the category changes.
- Title sorting can be toggled between ascending and descending order.
- The shopping cart is stored in `sessionStorage` for the duration of the browser session.
- The full cart view uses a simple frontend toggle so users can continue shopping without losing their page, category, or sort state.
