export interface Book {
    id: string
    isbn: string
    title: string
    authors?: string | null
    cover?: string | null
}
