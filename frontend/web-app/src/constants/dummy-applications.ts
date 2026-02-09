import type { JobApplication } from "../types/application";

export const dummyApplications: JobApplication[] = [
    {
        id: "1",
        fullName: "Alice Andersson",
        status: "unhandled",
        expertise: [
            { area: "ticket sales", years: 2 },
            { area: "lotteries", years: 1 },
        ],
        availability: [
            { start: "2026-06-01", end: "2026-08-31" },
        ],
    },
    {
        id: "2",
        fullName: "Bob Berg",
        status: "accepted",
        expertise: [
            { area: "roller coaster operation", years: 4 },
        ],
        availability: [
            { start: "2026-05-15", end: "2026-09-15" },
            { start: "2026-06-01", end: "2026-08-31" },
        ],
    },
    {
        id: "3",
        fullName: "Charlie Chen",
        status: "rejected",
        expertise: [
            { area: "ticket sales", years: 3 },
            { area: "lotteries", years: 2 },
            { area: "roller coaster operation", years: 4 },
        ],
        availability: [
            { start: "2026-05-15", end: "2026-09-15" },
            { start: "2026-06-01", end: "2026-08-31" },
            { start: "2026-08-01", end: "2026-09-30" },
        ],
    },
];
