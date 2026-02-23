import COMPETENCE from "@/constants/competence";
import type { Competence } from "@/types/competence";

/**
 * Maps between numeric competence IDs and their string representation.
 * Provides bidirectional functions for frontend and backend.
 */
const CompetenceParser = {
    /**
     * Maps a numeric competence ID to its string representation.
     * Throws an error if the ID is invalid.
     *
     * @param id numeric competence ID (1-based)
     * @returns corresponding string representation of the competence
     * @throws Error if the ID is invalid
     */
    idToCompetence(id: number): Competence {
        const competence = COMPETENCE[id - 1];
        if (!competence) throw new Error(`Invalid competence ID: ${id}`);
        return competence;
    },

    /**
     * Maps a string representation of a competence to its numeric ID.
     * Throws an error if the competence is invalid.
     *
     * @param competence string representation of the competence
     * @returns numeric competence ID (1-based)
     * @throws Error if the competence is invalid
     */
    competenceToId(competence: Competence): number {
        const index = COMPETENCE.indexOf(competence);
        if (index === -1) throw new Error(`Invalid competence: ${competence}`);
        return index + 1;
    },

    /**
     * Type guard that checks if a given value is a valid competence string.
     * This function returns true if the value is a string and is included in the COMPETENCE array,
     * and false otherwise.
     * 
     * @param value the value to check
     * @returns true if the value is a valid competence string, false otherwise
     */
    isValidCompetence(value: unknown): value is Competence {
        return typeof value === "string" && COMPETENCE.includes(value as Competence);
    },
};

export default CompetenceParser;
