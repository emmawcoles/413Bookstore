import { Routes, Route, Link } from 'react-router-dom'
import BooksPage from './pages/BooksPage'
import AdminBooksPage from './pages/AdminBooksPage'
import './App.css'

function App() {
  return (
    <main className="bookstore-shell">
      <nav className="navbar navbar-expand bg-dark navbar-dark px-3">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">
            Bookstore
          </Link>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminbooks">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/adminbooks" element={<AdminBooksPage />} />
      </Routes>
    </main>
  )
}

export default App
