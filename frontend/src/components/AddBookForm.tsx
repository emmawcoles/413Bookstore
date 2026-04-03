import { useState } from 'react'
import { addBook } from '../api/bookApi'

interface AddBookFormProps {
  onSuccess: () => void
  onCancel: () => void
}

function AddBookForm({ onSuccess, onCancel }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  })
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
      await addBook(formData)
      onSuccess()
    } catch {
      setError('Failed to add the book. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="h5 mb-3">Add New Book</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="add-title" className="form-label">
            Title
          </label>
          <input
            id="add-title"
            name="title"
            type="text"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="add-author" className="form-label">
            Author
          </label>
          <input
            id="add-author"
            name="author"
            type="text"
            className="form-control"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="add-publisher" className="form-label">
            Publisher
          </label>
          <input
            id="add-publisher"
            name="publisher"
            type="text"
            className="form-control"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="add-isbn" className="form-label">
            ISBN
          </label>
          <input
            id="add-isbn"
            name="isbn"
            type="text"
            className="form-control"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="add-classification" className="form-label">
            Classification
          </label>
          <input
            id="add-classification"
            name="classification"
            type="text"
            className="form-control"
            value={formData.classification}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="add-category" className="form-label">
            Category
          </label>
          <input
            id="add-category"
            name="category"
            type="text"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="add-pageCount" className="form-label">
            Page Count
          </label>
          <input
            id="add-pageCount"
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
          <label htmlFor="add-price" className="form-label">
            Price
          </label>
          <input
            id="add-price"
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
          {submitting ? 'Adding...' : 'Add Book'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddBookForm
