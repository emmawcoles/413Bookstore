import { useEffect, useState } from 'react'
import './App.css'

type Book = {
  bookID: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

type BooksResponse = {
  books: Book[]
  totalBooks: number
}

const PAGE_SIZE_OPTIONS = [5, 10, 15]

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [pageSize, setPageSize] = useState(5)
  const [pageNum, setPageNum] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadBooks() {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(
          `/api/books?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Unable to load books right now.')
        }

        const data: BooksResponse = await response.json()
        setBooks(data.books)
        setTotalBooks(data.totalBooks)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        setError('We could not load the bookstore catalog.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()

    return () => controller.abort()
  }, [pageNum, pageSize, sortOrder])

  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize))

  return (
    <main className="bookstore-shell">
      <section className="container py-5">
        <div className="hero-card shadow-sm">
          <p className="eyebrow mb-2">Mission 11 Online Bookstore</p>
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-lg-end">
            <div>
              <h1 className="display-5 fw-semibold mb-3">Emma&apos;s Online Bookstore</h1>
              <p className="lead mb-0 text-secondary">
                Explore the catalog, change how many books appear per page, and sort titles instantly.
              </p>
            </div>
            <div className="stats-chip">
              <span className="stats-number">{totalBooks}</span>
              <span className="stats-label">total books</span>
            </div>
          </div>
        </div>

        <section className="catalog-card shadow-sm mt-4">
          <div className="controls-bar">
            <div>
              <label htmlFor="pageSize" className="form-label fw-semibold mb-2">
                Results per page
              </label>
              <select
                id="pageSize"
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPageNum(1)
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="form-label fw-semibold d-block mb-2">Sort by title</span>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() =>
                  setSortOrder((currentOrder) =>
                    currentOrder === 'asc' ? 'desc' : 'asc',
                  )
                }
              >
                {sortOrder === 'asc' ? 'A to Z' : 'Z to A'}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="status-panel">Loading books...</div>
          ) : error ? (
            <div className="status-panel text-danger">{error}</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Publisher</th>
                      <th>ISBN</th>
                      <th>Classification</th>
                      <th>Category</th>
                      <th>Pages</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.bookID}>
                        <td className="fw-semibold">{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td>{book.isbn}</td>
                        <td>{book.classification}</td>
                        <td>{book.category}</td>
                        <td>{book.pageCount}</td>
                        <td>${book.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-bar">
                <p className="mb-0 text-secondary">
                  Page {pageNum} of {totalPages}
                </p>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    disabled={pageNum === 1}
                    onClick={() => setPageNum((currentPage) => currentPage - 1)}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
                    disabled={pageNum >= totalPages}
                    onClick={() => setPageNum((currentPage) => currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
