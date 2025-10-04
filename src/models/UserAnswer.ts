// User's answer
export interface UserAnswer {
    lat: number;
    lon: number;
    timestamp: number;         // Answer timestamp
    distanceToAnswer?: number; // Optional: distance to correct answer
    score?: number;            // Optional: answer score
}