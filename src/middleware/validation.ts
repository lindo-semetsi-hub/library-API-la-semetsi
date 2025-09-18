import { Request, Response, NextFunction } from "express";

export function validateAuthorPayload(req: Request, res: Response, next: NextFunction) {
    const { name} = req.body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({error: "Invalid author payload: 'name' is required."});
    }
    next();
}

export function validateBookPayload(req: Request, res: Response, next: NextFunction) {
    const { title, authorId, year } = req.body;
    if (!title || typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ error: "Invalid book payload: 'title' is required."});
    }
    if (!authorId || typeof authorId !== "string" || title.trim().length === 0) {
        return res.status(400).json({ error: "Invalid book payload: 'authorId' is required."});
    }
    if (typeof year !== "number" || !Number.isInteger(year) || year <0) {
        return res.status(400).json({ error: "Invalid book payload: 'year' must be a positive integer."});
    }


}
