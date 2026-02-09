import { EXPERTISE_AREAS } from "@/constants/expertise-areas";

/**
 * Types related to job applications.
 * ExpertiseArea is defined here to avoid type errors.
 */
export type ExpertiseArea = (typeof EXPERTISE_AREAS)[number];

export type ApplicationStatus = "accepted" | "rejected" | "unhandled";

export interface Expertise {
    area: string;
    years: number;
}

export interface Availability {
    start: string;
    end: string;
}

export interface JobApplication {
    id: string;
    fullName: string;
    status: ApplicationStatus;
    expertise: Expertise[];
    availability: Availability[];
}
