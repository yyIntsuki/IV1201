import type { Competence } from "@/types/competence";

/**
 * Represents one competence in a list of competence.
 * To get the list of available competence, please use constants/competence.
 */
export interface CompetenceEntry {
    competence: Competence;
    yearsOfExperience: number;
}

/**
 * Represents one availablity in a list of availablities.
 */
export interface AvailabilityEntry {
    fromDate: string;
    toDate: string;
}

/**
 * Common base application format.
 */
export interface ApplicationCore {
    competenceProfile: CompetenceEntry[];
    availability: AvailabilityEntry[];
}

/**
 * Represents the application submission used for Applicant.
 */
export interface ApplicationSubmission extends ApplicationCore {
    userId: number;
}

/**
 * Represents the available application statuses.
 */
export type ApplicationStatus = "accepted" | "rejected" | "unhandled";

/**
 * Represents the application submission used for Recruiter.
 */
export interface ApplicationRecord extends ApplicationCore {
    applicationId: number;
    userId: number;
    fullName: string;
    status: ApplicationStatus;
}
