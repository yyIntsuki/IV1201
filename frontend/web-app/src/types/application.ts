import type { Competence as CompetenceType } from "@/types/competence"; // Alias to avoid confusion

/**
 * Represents one competence in a list of competence.
 * To get the list of available competence, please use constants/competence.
 */
export interface Competence {
    competence: CompetenceType;
    yearsOfExperience: number;
}

/**
 * Represents one availablity in a list of availablities.
 */
export interface Availability {
    fromDate: string;
    toDate: string;
}

/**
 * Common base application format.
 */
export interface ApplicationCore {
    competenceProfile: Competence[];
    availability: Availability[];
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
