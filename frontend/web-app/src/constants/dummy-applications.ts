import type { JobApplication } from "@/types/application";

const dummyApplications: JobApplication[] = [
    {
        id: "1",
        fullName: "Alice Andersson",
        status: "unhandled",
        competenceProfile: [
            { competence: "ticket sales", yearsOfExperience: 2 },
            { competence: "lotteries", yearsOfExperience: 1 },
        ],
        availability: [
            { fromDate: "2026-06-01", toDate: "2026-08-31" },
        ],
    },
    {
        id: "2",
        fullName: "Bob Berg",
        status: "accepted",
        competenceProfile: [
            { competence: "roller coaster operation", yearsOfExperience: 4 },
        ],
        availability: [
            { fromDate: "2026-05-15", toDate: "2026-09-15" },
            { fromDate: "2026-06-01", toDate: "2026-08-31" },
        ],
    },
    {
        id: "3",
        fullName: "Charlie Chen",
        status: "rejected",
        competenceProfile: [
            { competence: "ticket sales", yearsOfExperience: 3 },
            { competence: "lotteries", yearsOfExperience: 2 },
            { competence: "roller coaster operation", yearsOfExperience: 4 },
        ],
        availability: [
            { fromDate: "2026-05-15", toDate: "2026-09-15" },
            { fromDate: "2026-06-01", toDate: "2026-08-31" },
            { fromDate: "2026-08-01", toDate: "2026-09-30" },
        ],
    },
];

export default dummyApplications;
