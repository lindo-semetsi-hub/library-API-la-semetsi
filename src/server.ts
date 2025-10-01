import express, { Express } from "express";
import bodyParser from "body-parser";
import authorsRouter from "./routes/authors";
import booksRouter from "./routes/books";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { authors, books } from "./data";
import {v4 as uuidv4} from "uuid";

  
  const app = express();
  app.use(bodyParser.json());
  app.use(logger);
  
  // Mount routes
  app.use("/authors", authorsRouter);
  app.use("/books", booksRouter);
  
  // Root
  app.get("/", (req, res) => {
    res.json({
      message: "Library API - running",
      endpoints: [
        "POST /authors",
        "GET /authors",
        "GET /authors/:id",
        "PUT /authors/:id",
        "DELETE /authors/:id",
        "GET /authors/:id/books",
        "POST /books",
        "GET /books",
        "GET /books/:id",
        "PUT /books/:id",
        "DELETE /books/:id"
      ]
    });
  });
  
  // Centralized error handler
  app.use(errorHandler);
  
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(PORT, () => {
    console.log(`Library API listening at http://localhost:${PORT}`);
  });