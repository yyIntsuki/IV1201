import type { Competence as CompetenceType } from "@/types/competence"; // Alias to avoid confusion

/**
 * Represents one competence in a list of competence.
 * To get the list of available competence, please use constants/competence.
*/
export interface Competence {
    competence: CompetenceType;     // string parsed from competence_id
    yearsOfExperience: number;      // years_of_experience
}

/**
 * Represents one availablity in a list of availablities.
*/
export interface Availability {
    fromDate: string;               // from_date
    toDate: string;                 // to_date
}

export type ApplicationStatus = "accepted" | "rejected" | "unhandled";

export interface JobApplication {
    id: string;
    fullName: string;
    status: ApplicationStatus;
    competenceProfile: Competence[];
    availability: Availability[];
}
