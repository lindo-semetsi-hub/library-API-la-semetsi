import { Router } from "express";
import { vs as uuidv4} from "uuid";
import { books, authors} from "../data";
import { Book } from "../models";
import { validateBookPayload } from "../middleware/validation";
import { timeLog } from "console";

const router = Router ();

// POST / books
// create new book

router.post('/', validateBookPayload, (req, res) => {
    const { title, authorId, year, summary }= req.body;
    const author = authors.find(a => a.id === authorId);
    if (!author) return res.status(400).json({error: "Invalid authorId: author not found. "});

    const duplicate = books.find(b => b.authorId === authorId && b.title.trim().toLowerCase() === title.trim().toLowerCase());
    if (duplicate) return res.status(409).json({erro: "Duplicate book for the same author."});

    const newBook: Book = {
        id: uuidv4(),
        title: title.trim(),
        authorId,
        year: typeof year === "number" ? year : undefined,
        summary: summary?.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: ""
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// GET / books
// list all books with filtering, serach, sort and pagination

router.get("/", (req, res) => {
    const { title, author: authorName, authorId, year, q, sort, page = "1", limit = "10" } = req.query;
    let results = [...books];

    if (title && typeof title === "string") {
        results = results.filter(b => b.title.toLowerCase().includes(title.toLowerCase()))
    }
    if (authorId && typeof authorId === "string") {
        results = results.filter(b => b.authorId === authorId); 
    }
    if (authorName && typeof authorName === "string") {
        const term = authorName.toLocaleUpperCase();
        results = results.filter(b => {
            const author = authors.find(a => a.id === b.authorId);
            return author ? author.name.toLowerCase().includes(term) : false;
        });
    }
    if (year && !isNaN(Number(year))) {
        results = results.filter(b => b.year === Number(year));
    }
    if (q && typeof q === "string") {
        const term = q.toLowerCase();
        results = results.filter(b => b.title.toLowerCase().includes(term) || (b.summary || "").toLowerCase().includes(term));
    }
    if (sort === "title") results.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "year") results.sort((a, b) => (a.year || 0) - (b.year || 0));
    else if (sort === "createdAt") results.sort((a, b) =>
     new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime());
  

    // pagination

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit), 10 ) || 1))
    const start = (pageNum -1 ) * limitNum;
    const paged = results.slice(start, start + limitNum);

    const data = paged.map( b=> {
        const author = authors.find(a => a.id === b.authorId);
        return {...b, authorName: author?.name || null};
    });

    res.json({
        meta: { total: results.length, page: pageNum, limit: limitNum},
        data
    });
});

//GET books/:id

router.get("/:id", (req, res )=> {
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found."});
    const author = authors.find(a => a.id === book.authorId);
    res.json({ ...book, authorNmae: author?.name || null});
});

// PUT/boks/id

router.put("/:id", validateBookPayload, (req, res) => {
    const book= books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found."});

    const { title, authorId, year, summary } = req.body;
    const author = authors.find(a=> a.id === authorId);
    if (!author) return res.status(400).json({ error: "Invalid authorId: author ot found"});

    //check duplicate conflict
    const conflict = books.find(b => b.id !== book.id && b.authorId === authorId && b.title.trim().toLowerCase() === title.trim().toLowerCase());
    if (conflict) return res.status(409).json({ error: "Another book by this author already has a title."});

    book.title = title.trim();
    book.authorId = authorId;
    book.year = typeof year === "number" ? year: undefined;
    book.summary = summary?.trim();
    book.updatedAt = new Date().toISOString();

    res.json(book);
});

//DELETE/ books/:d

router.delete("/:id", (req, res)=> {
    const idx = books.findIndex(b => b.id === req.params.id);
    if (idx === -1 ) return res.status(404).json ({ error: "Book not found"});
    books.splice(idx, 1);
    res.status(204).send();
});

export default router;