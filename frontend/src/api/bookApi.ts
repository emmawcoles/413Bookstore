import type { Book, BooksResponse } from '../types'

const API_BASE = 'https://emma-bookstore-api-4-fnfuhfhfgvbsgccz.centralus-01.azurewebsites.net'

interface FetchBooksParams {
  pageSize?: number
  pageNum?: number
  sortOrder?: string
  category?: string
}

export async function fetchBooks(
  params: FetchBooksParams = {},
  signal?: AbortSignal,
): Promise<BooksResponse> {
  const searchParams = new URLSearchParams({
    pageSize: (params.pageSize ?? 5).toString(),
    pageNum: (params.pageNum ?? 1).toString(),
    sortOrder: params.sortOrder ?? 'asc',
    category: params.category ?? 'All',
  })

  const response = await fetch(`${API_BASE}/api/books?${searchParams.toString()}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch books.')
  }

  return response.json()
}

export async function addBook(book: Omit<Book, 'bookID'>): Promise<Book> {
  const response = await fetch(`${API_BASE}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })

  if (!response.ok) {
    throw new Error('Failed to add book.')
  }

  return response.json()
}

export async function updateBook(id: number, book: Book): Promise<void> {
  const response = await fetch(`${API_BASE}/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })

  if (!response.ok) {
    throw new Error('Failed to update book.')
  }
}

export async function deleteBook(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/books/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete book.')
  }
}