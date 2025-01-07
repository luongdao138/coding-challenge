export interface BookResponse {
  id: string
  title: string
  author: string
  isSoldOut?: boolean
  price?: number
  publishedAt?: Date
}
