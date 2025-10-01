import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { authors, books } from "../data";
import { Author } from "../models";
import { validateAuthorPayload } from "../middleware/validation";

const router = Router();

// POST/authors
// create new author

router.post("/", validateAuthorPayload, (req, res) => {
    const { name, biography} = req.body;

    // prevent duplicates (case senstive)
  const exists = authors.find(a => name.trim().toLowerCase() === name.trim());
  if (exists) {
    return res.status(409).json({error: "Author already exists."});
  }
      
  const newAuthor: Author = {
    id: uuidvd4(),
    name: name.trim(),
    biography: biography?.trim(),
    createdAt: new Date().toISOString()
  };
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

// GET/authors
//list all authors

router.get("/", (req, res) => {
    res.json(authors)
});

//GET author by ID

router.get("/:id", (req, res) => {
    const author = authors.find(a => a.id === req.params.id);
    if (!author) return res.status(404).json({ error: "Auhtor not found"});
    res.json(author);
});


// PUT/ authors

//update author

router.put("/:id", validateAuthorPayload, (req, res) => {
    const author = authors.find(a => a.id === req.params.id); 
    if (!author) return res.status(404).json({ error: "Author not found"});

    const { name, biography } = req.body;

    // check duplicate name\

    const conflict = authors.find(a => a.id !== author.id && a.name.trim().toLowerCase() === name.trim().toLowerCase());
if (conflict) return res.status(409).json({error: "Anothe author with that name already exists."});

    author.name = name.trim();
    author.biography = biography?.trim();
    author.updatedAt = new Date().toISOString();
    res.json(author);
});

//DELETE/authors
// delete author and prevent deletion in case author has books

router.delete("/:id", (req, res) => {
    const idx = authors.findIndex(a => a.id === req.params.id);

    const authorId = req.params.id;
    const hasBooks = books.some(b => b.authorId === authorId);
    if (hasBooks) {
        return res.status(400).json({ error: "cannot delete author with existing books. Delete or reassign books first"});
    }

    authors.splice(idx, 1);
    res.status(204).send();
});

//GET/ authorrs
//List 

router.get("/:id/books", (req, res) => {
    const author = authors.find(a => a.id === req.params.id);
    if (!author) return res.status(404).json({ error: "Author not found."});

    // query params

    const { title, year, q, sort, page = "1", limit = "10"} = req.query;
    let results = books.filter(b => b.authorId === author.id);

    if (title && typeof title === "string") {
        results = results.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));

    }
    if (year && !isNaN(Number(year))) {
        results = results.filter(b=> b.year === Number(year));
    }
    if (q && typeof q === "string") {
        const term = q.toLowerCase();
        results = results.filter(b => b.title.toLowerCase().includes(term) || (b.summary || "").toLowerCase().includes(term));
    }

    if (sort === "title") results.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "year") results.sort((a, b ) => (a.year || 0) - (b.year || 0) );

    //pagination

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 10));
    const start = (pageNum -1) * limitNum;
    const paged = results.slice(start, start + limitNum);

    res.json ({
        meta: { total: results.length, page: pageNum, limit: limitNum},
        data: paged
    });
});

export default router;
