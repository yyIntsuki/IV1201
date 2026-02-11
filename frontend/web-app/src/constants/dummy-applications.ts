import type { JobApplication } from "@/types/application";

const dummyApplications: JobApplication[] = [];

const names = [
    "Alexandrina Sebastiane",
    "Alice Thymefield",
    "Anby Demara",
    "Anton Ivanov",
    "Harumasa Asaba",
    "Astra Yao",
    "Ben Bigger",
    "Billy Kid",
    "Burnice White",
    "Caesar King",
    "Corin Wickes",
    "Ellen Joe",
    "Evelyn Chevalier",
    "Grace Howard",
    "Hoshimi Miyabi",
    "Hugo Vlad",
    "Jane Doe",
    "Fufu Ju",
    "Koleda Belobog",
    "Manato Komano",
    "Lucia Elowen",
    "Luciana de Montefio",
    "Nekomiya Mana",
    "Nicole Demara",
    "Orpheus Magnusson",
    "Pan Yinhu",
    "Piper Wheel",
    "Pulchra Fellini",
    "Seth Lowell",
    "Yanagi Tsukishiro",
    "Yuzuha Ukinami",
    "Vivian Banshee",
    "Shunguang Ye",
    "Yidhari Murphy",
    "Yuan Zhu"
];
const statuses: JobApplication["status"][] = ["unhandled", "accepted", "rejected"];
const competences = ["ticket sales", "lotteries", "roller coaster operation"];
const years = [1, 2, 3, 4, 5];

const shuffle = <T>(arr: T[]) => arr.sort(() => 0.5 - Math.random());

shuffle(names);
const uniqueNames = names.slice(0, 25);

for (let i = 0; i < 25; i++) {
    const fullName = uniqueNames[i];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const shuffledCompetences = shuffle([...competences]);
    const numCompetences = 1 + Math.floor(Math.random() * shuffledCompetences.length);
    const competenceProfile = shuffledCompetences.slice(0, numCompetences).map((c) => ({
        competence: c,
        yearsOfExperience: years[Math.floor(Math.random() * years.length)],
    }));

    const numAvailability = 1 + Math.floor(Math.random() * 5);
    const availability = Array.from({ length: numAvailability }, () => {
        const startMonth = 1 + Math.floor(Math.random() * 12);
        const endMonth = Math.min(startMonth + 2, 12);
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
