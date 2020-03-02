import {Book} from "../types/Book";
import client from "../../../common/api/BaseClient";

export default {
    fetchBookDetails(bookId: string): Promise<Book | null> {
        return client.get<Book>(`/books/${bookId}`)
            .then(resp => resp.data)
            .catch(err => {
                if (err.response?.status === 400 || err.response?.status === 404) {
                    return null
                } else {
                    return Promise.reject(err)
                }
            })
    },
    findIsbnSuggestions(isbn: string): Promise<Book[]> {
        return client.get<Book[]>(`/books/isbn/${isbn}`).then(resp => resp.data)
    },
    createBook(isbn: string, title: string, authors?: string | null, cover?: string | null): Promise<Book> {
        return client.post<Book>('/books', {isbn, title, authors, cover}).then(resp => resp.data)
    }
}
