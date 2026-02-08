import type { JobApplication } from "../types/application";

export const dummyApplications: JobApplication[] = [
    {
        id: "1",
        fullName: "Alice Andersson",
        status: "unhandled",
    },
    {
        id: "2",
        fullName: "Bob Berg",
        status: "accepted",
    },
    {
        id: "3",
        fullName: "Charlie Chen",
        status: "rejected",
    },
];
