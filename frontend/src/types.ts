export type Book = {
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

export type BooksResponse = {
  books: Book[]
  totalBooks: number
}

export type CartItem = {
  bookID: number
  title: string
  price: number
  quantity: number
}
