import CompetenceParser from "@/utils/competence-parser";

/**
 * Unit tests for the CompetenceParser utility.
 *
 * These tests verify bidirectional mapping between numeric competence IDs
 * (used by the backend) and competence strings (used by the frontend),
 * as well as the isValidCompetence type guard.
 *
 * The COMPETENCE constant is NOT mocked — tests rely on the real values
 * so that any accidental changes to the constant are caught here.
 * Current values: ["ticket sales", "lotteries", "roller coaster operation"]
 */
describe("CompetenceParser", () => {
    describe("idToCompetence", () => {
        it("maps ID 1 to 'ticket sales'", () => {
            expect(CompetenceParser.idToCompetence(1)).toBe("ticket sales");
        });

        it("maps ID 2 to 'lotteries'", () => {
            expect(CompetenceParser.idToCompetence(2)).toBe("lotteries");
        });

        it("maps ID 3 to 'roller coaster operation'", () => {
            expect(CompetenceParser.idToCompetence(3)).toBe("roller coaster operation");
        });

        it("throws for ID 0", () => {
            expect(() => CompetenceParser.idToCompetence(0)).toThrow("Invalid competence ID: 0");
        });

        it("throws for an ID that exceeds the number of competences", () => {
            expect(() => CompetenceParser.idToCompetence(999)).toThrow("Invalid competence ID: 999");
        });

        it("throws for a negative ID", () => {
            expect(() => CompetenceParser.idToCompetence(-1)).toThrow("Invalid competence ID: -1");
        });
    });

    describe("competenceToId", () => {
        it("maps 'ticket sales' to ID 1", () => {
            expect(CompetenceParser.competenceToId("ticket sales")).toBe(1);
        });

        it("maps 'lotteries' to ID 2", () => {
            expect(CompetenceParser.competenceToId("lotteries")).toBe(2);
        });

        it("maps 'roller coaster operation' to ID 3", () => {
            expect(CompetenceParser.competenceToId("roller coaster operation")).toBe(3);
        });

        /**
         * Verifies that idToCompetence and competenceToId are true inverses of each other.
         * Converting to ID and back should return the original competence string.
         */
        it("is the inverse of idToCompetence for all valid competences", () => {
            const competences = ["ticket sales", "lotteries", "roller coaster operation"] as const;

            for (const competence of competences) {
                const id = CompetenceParser.competenceToId(competence);
                expect(CompetenceParser.idToCompetence(id)).toBe(competence);
            }
        });
    });

    describe("isValidCompetence", () => {
        /**
         * Known valid competence strings should return true.
         */
        it("returns true for 'ticket sales'", () => {
            expect(CompetenceParser.isValidCompetence("ticket sales")).toBe(true);
        });

        it("returns true for 'lotteries'", () => {
            expect(CompetenceParser.isValidCompetence("lotteries")).toBe(true);
        });

        it("returns true for 'roller coaster operation'", () => {
            expect(CompetenceParser.isValidCompetence("roller coaster operation")).toBe(true);
        });

        /**
         * An arbitrary string that is not in the COMPETENCE array should return false.
         */
        it("returns false for an unknown string", () => {
            expect(CompetenceParser.isValidCompetence("driving")).toBe(false);
        });

        /**
         * Non-string types should return false regardless of content.
         */
        it("returns false for a number", () => {
            expect(CompetenceParser.isValidCompetence(1)).toBe(false);
        });

        it("returns false for null", () => {
            expect(CompetenceParser.isValidCompetence(null)).toBe(false);
        });

        it("returns false for undefined", () => {
            expect(CompetenceParser.isValidCompetence(undefined)).toBe(false);
        });

        /**
         * An empty string is not a valid competence.
         */
        it("returns false for an empty string", () => {
            expect(CompetenceParser.isValidCompetence("")).toBe(false);
        });
    });
});
