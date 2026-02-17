import COMPETENCE from "@/constants/competence";
import type { Competence } from "@/types/competence";

/**
 * Maps between numeric competence IDs and their string representation.
 * Provides bidirectional functions for frontend and backend.
 */
const CompetenceParser = {
    /**
     * Convert API numeric ID to frontend string Competence
     * @param id numeric competence ID (1-based)
     * @returns Competence string
     */
    idToCompetence(id: number): Competence {
        const competence = COMPETENCE[id - 1];
        if (!competence) throw new Error(`Invalid competence ID: ${id}`);
        return competence;
    },

    /**
     * Convert frontend string Competence to API numeric ID
     * @param competence Competence string
     * @returns numeric competence ID (1-based)
     */
    competenceToId(competence: Competence): number {
        const index = COMPETENCE.indexOf(competence);
        if (index === -1) throw new Error(`Invalid competence: ${competence}`);
        return index + 1;
    },
};

export default CompetenceParser;
