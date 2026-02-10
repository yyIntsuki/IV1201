import { COMPETENCE } from "@/constants/competence";
import type { Competence } from "@/types/competence";

/**
 * Parses a role number into a string. To be used directly after getting the JSON data from API.
 * @param competenceId a number. For details see constant/competence.
 * @returns the converted competence in string form
 */
export const parseRole = (competenceId: number): Competence => {
    const competence = COMPETENCE[competenceId - 1];
    if (!competence) throw new Error("Invalid competence ID");
    return competence as Competence;
};