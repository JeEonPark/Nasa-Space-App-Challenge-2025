import type { Question } from '../models';
import earthObservatoryData from './earth_observatory.json';

interface EarthObservatoryEntry {
    name: string;
    spacecraft_nadir_point: string;
    photo_center_point: string;
}

/**
 * Parse coordinate string (e.g., "37.8° N, 122.4° W") to lat/lon numbers
 */
function parseCoordinates(coordStr: string): { lat: number; lon: number } | null {
    if (!coordStr) return null;

    const parts = coordStr.split(',').map(s => s.trim());
    if (parts.length !== 2) return null;

    // Parse latitude
    const latMatch = parts[0].match(/([\d.]+)°?\s*([NS])/);
    if (!latMatch) return null;
    let lat = parseFloat(latMatch[1]);
    if (latMatch[2] === 'S') lat = -lat;

    // Parse longitude
    const lonMatch = parts[1].match(/([\d.]+)°?\s*([EW])/);
    if (!lonMatch) return null;
    let lon = parseFloat(lonMatch[1]);
    if (lonMatch[2] === 'W') lon = -lon;

    return { lat, lon };
}

/**
 * Convert earth_observatory.json data to Question array
 */
function loadQuestions(): Question[] {
    const questions: Question[] = [];
    let id = 1;

    const data = earthObservatoryData as Record<string, EarthObservatoryEntry>;

    for (const [imageId, entry] of Object.entries(data)) {
        // Use photo_center_point if available, otherwise spacecraft_nadir_point
        const coords = parseCoordinates(entry.photo_center_point) ||
                      parseCoordinates(entry.spacecraft_nadir_point);

        if (coords) {
            questions.push({
                id: id++,
                lat: coords.lat,
                lon: coords.lon,
                title: entry.name
            });
        }
    }

    return questions;
}

export const questions: Question[] = loadQuestions();

/**
 * Get random question from the pool
 */
export function getRandomQuestion(): Question {
    return questions[Math.floor(Math.random() * questions.length)];
}
