# library-API-la-semetsi

A minimal in-memory library API for managing authors and books.

# Run

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000/`

# Endpoints

**Authors**
- `POST /authors` — create author `{ name, biography? }`
- `GET /authors` — list all authors
- `GET /authors/:id` — get author
- `PUT /authors/:id` — update author `{ name, biography? }`
- `DELETE /authors/:id` — delete author (blocked if author has books)
- `GET /authors/:id/books` — list books for an author (supports search & pagination)

**Books**
- `POST /books` — create book `{ title, authorId, year?, summary? }`
- `GET /books` — list books (supports filtering & pagination)
- `GET /books/:id` — get a book
- `PUT /books/:id` — update book `{ title, authorId, year?, summary? }`
- `DELETE /books/:id` — delete book

## Query params for listing
- `title`, `author`, `authorId`, `year`, `q` (search)
- `sort=title|year|createdAt`
- `page` (default 1), `limit` (default 10, max 100)
[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/lindo-semetsi-hub/library-API-la-semetsi)