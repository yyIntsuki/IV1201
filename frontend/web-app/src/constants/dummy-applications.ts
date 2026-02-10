import type { JobApplication } from "@/types/application";

const dummyApplications: JobApplication[] = [];

const firstNames = ["David", "Eva", "Fiona", "George", "Hanna", "Ian", "Julia", "Kevin", "Lena", "Martin", "Nina", "Oscar", "Petra", "Quinn", "Rafael", "Sofia", "Tom", "Ulla", "Victor", "Wendy", "Xander", "Yara", "Zane"];
const lastNames = ["Nilsson", "Olsen", "Peterson", "Quist", "Rasmussen", "Svensson", "Thompson", "Ulrik", "Vik", "Wahlberg", "Xing", "Yilmaz", "Zimmerman"];
const statuses: JobApplication["status"][] = ["unhandled", "accepted", "rejected"];
const competences = ["ticket sales", "lotteries", "roller coaster operation"];
const years = [1, 2, 3, 4, 5];

for (let i = 1; i <= 25; i++) {
    const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const competenceProfile = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => ({
        competence: competences[Math.floor(Math.random() * competences.length)],
        yearsOfExperience: years[Math.floor(Math.random() * years.length)],
    }));

    const availability = Array.from({ length: 1 + Math.floor(Math.random() * 2) }, (_, idx) => {
        const startMonth = 5 + idx * 2;
        const endMonth = startMonth + 2;
        return {
            fromDate: `2026-${String(startMonth).padStart(2, "0")}-01`,
            toDate: `2026-${String(endMonth).padStart(2, "0")}-28`,
        };
    });

    dummyApplications.push({
        id: i.toString(),
        fullName,
        status,
        competenceProfile,
        availability,
    });
}

export default dummyApplications;
