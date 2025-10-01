export interface Author {
    id: string;
    name: string;
    biography?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Book {
    updatedAt: string;
    id: string;
    title: string;
    authorId: string;
    year?: number;
    summary?: string;
    createdAt?: string;
    updatedt?: string;
}