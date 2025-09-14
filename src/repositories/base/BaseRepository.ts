import {
    CollectionReference,
    DocumentReference,
    Timestamp,
    doc
} from 'firebase/firestore';

export interface BaseDocument {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export abstract class BaseRepository<T extends BaseDocument> {
    protected collection: CollectionReference<T>;

    constructor(collection: CollectionReference<T>) {
        this.collection = collection;
    }

    /**
     * Create a new document in the collection
     */
    abstract create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;

    /**
     * Get a document by its ID
     */
    abstract getById(id: string): Promise<T | null>;

    /**
     * Update a document by its ID
     */
    abstract update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void>;

    /**
     * Delete a document by its ID
     */
    abstract delete(id: string): Promise<void>;

    /**
     * Get all documents from the collection
     */
    abstract getAll(): Promise<T[]>;

    /**
     * Check if a document exists by its ID
     */
    abstract exists(id: string): Promise<boolean>;

    /**
     * Get the collection reference
     */
    protected getCollection(): CollectionReference<T> {
        return this.collection;
    }

    /**
     * Get a document reference by ID
     */
    protected getDocRef(id: string): DocumentReference<T> {
        return doc(this.collection, id) as DocumentReference<T>;
    }
}
