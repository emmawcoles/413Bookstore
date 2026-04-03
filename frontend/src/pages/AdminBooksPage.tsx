import { useEffect, useState } from 'react'
import type { Book } from '../types'
import { fetchBooks, deleteBook } from '../api/bookApi'
import AddBookForm from '../components/AddBookForm'
import EditBookForm from '../components/EditBookForm'

type ViewMode = 'list' | 'add' | 'edit'

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  async function loadAllBooks() {
    try {
      setIsLoading(true)
      setError('')
      const data = await fetchBooks({ pageSize: 1000, pageNum: 1 })
      setBooks(data.books)
    } catch {
      setError('Failed to load books.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllBooks()
  }, [])

  async function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return
    }

    try {
      await deleteBook(id)
      await loadAllBooks()
    } catch {
      setError('Failed to delete the book.')
    }
  }

  function handleEditClick(book: Book) {
    setEditingBook(book)
    setViewMode('edit')
  }

  function handleFormSuccess() {
    setViewMode('list')
    setEditingBook(null)
    loadAllBooks()
  }

  function handleCancel() {
    setViewMode('list')
    setEditingBook(null)
  }

  return (
    <section className="container py-5">
      <div className="hero-card shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="eyebrow mb-2">Administration</p>
            <h1 className="display-6 fw-semibold mb-0">Manage Books</h1>
          </div>
          {viewMode === 'list' && (
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => setViewMode('add')}
            >
              + Add Book
            </button>
          )}
        </div>
      </div>

      <div className="catalog-card shadow-sm">
        {error && <div className="alert alert-danger">{error}</div>}

        {viewMode === 'add' && (
          <AddBookForm onSuccess={handleFormSuccess} onCancel={handleCancel} />
        )}

        {viewMode === 'edit' && editingBook && (
          <EditBookForm
            book={editingBook}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        )}

        {viewMode === 'list' && (
          <>
            {isLoading ? (
              <div className="status-panel">Loading books...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>ISBN</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.bookID}>
                        <td>{book.bookID}</td>
                        <td className="fw-semibold">{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.category}</td>
                        <td>{book.isbn}</td>
                        <td>${book.price.toFixed(2)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleEditClick(book)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(book.bookID)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default AdminBooksPage
