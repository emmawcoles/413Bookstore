import { useEffect, useState } from 'react'
import type { Book, BooksResponse, CartItem } from '../types'
import { fetchBooks } from '../api/bookApi'

const PAGE_SIZE_OPTIONS = [5, 10, 15]
const CART_STORAGE_KEY = 'bookstore-cart'

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<string[]>([])
  // Restore the shopping cart from session storage when the page first loads.
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = sessionStorage.getItem(CART_STORAGE_KEY)

    if (!savedCart) {
      return []
    }

    try {
      return JSON.parse(savedCart) as CartItem[]
    } catch {
      return []
    }
  })
  const [pageSize, setPageSize] = useState(5)
  const [pageNum, setPageNum] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadBooks() {
      try {
        setIsLoading(true)
        setError('')

        const data = await fetchBooks(
          { pageSize, pageNum, sortOrder, category: selectedCategory },
          controller.signal,
        )
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
  }, [pageNum, pageSize, sortOrder, selectedCategory])

  useEffect(() => {
    const controller = new AbortController()

    // Load a large page once so the category filter can be built client-side.
    async function loadCategories() {
      try {
        const data: BooksResponse = await fetchBooks(
          { pageSize: 1000, pageNum: 1, sortOrder: 'asc', category: 'All' },
          controller.signal,
        )
        const uniqueCategories = [...new Set(data.books.map((book) => book.category))].sort()
        setCategories(uniqueCategories)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
      }
    }

    loadCategories()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize))
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  function addToCart(book: Book) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.bookID === book.bookID)

      if (existingItem) {
        return currentCart.map((item) =>
          item.bookID === book.bookID ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...currentCart,
        {
          bookID: book.bookID,
          title: book.title,
          price: book.price,
          quantity: 1,
        },
      ]
    })
  }

  return (
    <section className="container py-5">
      <div className="hero-card shadow-sm">
        <p className="eyebrow mb-2">IS 413 Project Bookstore</p>
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-lg-end">
          <div>
            <h1 className="display-5 fw-semibold mb-3">Emma&apos;s Online Bookstore</h1>
            <p className="lead mb-0 text-secondary">
              Explore the catalog, change how many books appear per page, and sort titles
              instantly.
            </p>
          </div>
          <div className="stats-chip">
            <span className="stats-number">{totalBooks}</span>
            <span className="stats-label">total books</span>
          </div>
        </div>
      </div>

      <section className="catalog-card shadow-sm mt-4">
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="sticky-top" style={{ top: '1rem' }}>
              <div className="controls-bar mb-4">
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
                  <label htmlFor="category" className="form-label fw-semibold mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setPageNum(1)
                    }}
                  >
                    <option value="All">All</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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

              <div className="cart-summary">
                <div className="d-flex flex-column gap-3">
                  <div>
                    <h2 className="h5 mb-1">Shopping Cart</h2>
                    <p className="mb-0 text-secondary">
                      <span className="badge text-bg-dark me-2">{totalCartItems}</span>
                      item{totalCartItems === 1 ? '' : 's'} in cart
                    </p>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <span className="fw-semibold">Total: ${cartTotal.toFixed(2)}</span>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => setShowCart((current) => !current)}
                    >
                      {showCart ? 'Back to Books' : 'View Cart'}
                    </button>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <p className="mb-0 mt-3 text-secondary">Your cart is empty.</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            {showCart ? (
              <div>
                <h3 className="h5 mb-3">Cart Details</h3>
                {cart.length === 0 ? (
                  <div className="status-panel">Your cart is empty.</div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-striped align-middle mb-3">
                        <thead className="table-light">
                          <tr>
                            <th>Title</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => (
                            <tr key={item.bookID}>
                              <td>{item.title}</td>
                              <td>{item.quantity}</td>
                              <td>${item.price.toFixed(2)}</td>
                              <td>${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="pagination-bar">
                      <p className="mb-0 fw-semibold">Total: ${cartTotal.toFixed(2)}</p>
                      <button
                        type="button"
                        className="btn btn-dark"
                        onClick={() => setShowCart(false)}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : isLoading ? (
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
                        <th></th>
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
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => addToCart(book)}
                            >
                              Add to Cart
                            </button>
                          </td>
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
          </div>
        </div>
      </section>
    </section>
  )
}

export default BooksPage
