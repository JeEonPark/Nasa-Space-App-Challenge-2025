// Question information
export interface Question {
    id: number;
    file: string;         // Image path
    lat: number;          // Correct latitude
    lon: number;          // Correct longitude
    title: string;        // Photo title
    collection?: string;  // Collection name (optional)
    difficulty?: number;  // Optional: difficulty level
    timestamp?: number;   // Optional: capture timestamp
}
