export interface Book {
    title: string
    author_name?: string[]
    cover_i?: number
    key: string
}

export interface WishlistProp {
    id: number;
    text: string;
    books: Book[]
}