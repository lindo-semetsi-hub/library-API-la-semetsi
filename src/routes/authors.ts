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

    // check duplicate name
})
