import { useState } from 'react'
import type { Book } from '../types'
import { updateBook } from '../api/bookApi'

interface EditBookFormProps {
  book: Book
  onSuccess: () => void
  onCancel: () => void
}

function EditBookForm({ book, onSuccess, onCancel }: EditBookFormProps) {
  const [formData, setFormData] = useState<Book>({ ...book })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await updateBook(book.bookID, formData)
      onSuccess()
    } catch {
      setError('Failed to update the book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="h5 mb-3">Edit Book</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="edit-title" className="form-label">
            Title
          </label>
          <input
            id="edit-title"
            name="title"
            type="text"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edit-author" className="form-label">
            Author
          </label>
          <input
            id="edit-author"
            name="author"
            type="text"
            className="form-control"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edit-publisher" className="form-label">
            Publisher
          </label>
          <input
            id="edit-publisher"
            name="publisher"
            type="text"
            className="form-control"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edit-isbn" className="form-label">
            ISBN
          </label>
          <input
            id="edit-isbn"
            name="isbn"
            type="text"
            className="form-control"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edit-classification" className="form-label">
            Classification
          </label>
          <input
            id="edit-classification"
            name="classification"
            type="text"
            className="form-control"
            value={formData.classification}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edit-category" className="form-label">
            Category
          </label>
          <input
            id="edit-category"
            name="category"
            type="text"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edit-pageCount" className="form-label">
            Page Count
          </label>
          <input
            id="edit-pageCount"
            name="pageCount"
            type="number"
            className="form-control"
            value={formData.pageCount}
            onChange={handleChange}
            required
            min={1}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="edit-price" className="form-label">
            Price
          </label>
          <input
            id="edit-price"
            name="price"
            type="number"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
            min={0}
            step={0.01}
          />
        </div>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-dark" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditBookForm
