import recruiterService from "@/services/recruiter-service";
import type { Competence } from "@/types/competence";

const fetchAvailabilitiesApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/fetch-availabilities-api", () => ({ default: fetchAvailabilitiesApiMock }));

const updateAvailabilityStatusApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/update-availability-status-api", () => ({ default: updateAvailabilityStatusApiMock }));

const fetchUserCompetenceApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/fetch-user-competence-api", () => ({ default: fetchUserCompetenceApiMock }));

const isValidCompetenceMock = vi.hoisted(() => vi.fn<(value: unknown) => value is Competence>());
vi.mock("@/utils/competence-parser", () => ({ default: { isValidCompetence: isValidCompetenceMock } }));

/**
 * Unit tests for the recruiterService module.
 *
 * These tests ensure that recruiterService correctly transforms API responses into domain types,
 * constructs the correct payloads for status updates, and propagates errors.
 */
describe("recruiterService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getApplications", () => {
        /**
         * Verifies that raw API response fields are correctly mapped to the camelCase ApplicationRecord
         * domain type, including fullName construction and empty competenceProfile.
         */
        it("maps availability response fields to ApplicationRecord", async () => {
            fetchAvailabilitiesApiMock.mockResolvedValueOnce([
                {
                    availability_id: 1,
                    user_id: 10,
                    name: "Jane",
                    surname: "Doe",
                    from_date: "2026-01-01",
                    to_date: "2026-01-15",
                    status: "unhandled",
                },
            ]);

            const result = await recruiterService.getApplications();

            expect(result).toEqual([
                {
                    applicationId: 1,
                    userId: 10,
                    fullName: "Jane Doe",
                    status: "unhandled",
                    competenceProfile: [],
                    availability: [{ fromDate: "2026-01-01", toDate: "2026-01-15" }],
                },
            ]);
        });

        it("returns an empty array when no applications exist", async () => {
            fetchAvailabilitiesApiMock.mockResolvedValueOnce([]);

            const result = await recruiterService.getApplications();

            expect(result).toEqual([]);
        });

        it("propagates API errors", async () => {
            fetchAvailabilitiesApiMock.mockRejectedValueOnce(new Error("Unauthorized"));

            await expect(recruiterService.getApplications()).rejects.toThrow("Unauthorized");
        });
    });

    describe("setApplicationStatus", () => {
        /**
         * Verifies that the status and expectedStatus are correctly mapped to the snake_case payload
         * fields expected by the API.
         */
        it("calls updateAvailabilityStatusApi with correct payload", async () => {
            updateAvailabilityStatusApiMock.mockResolvedValueOnce(true);

            await recruiterService.setApplicationStatus(1, "accepted", "unhandled");

            expect(updateAvailabilityStatusApiMock).toHaveBeenCalledOnce();
            expect(updateAvailabilityStatusApiMock).toHaveBeenCalledWith(1, {
                status: "accepted",
                expected_status: "unhandled",
            });
        });

        it("propagates API errors", async () => {
            updateAvailabilityStatusApiMock.mockRejectedValueOnce(new Error("Conflict"));

            await expect(recruiterService.setApplicationStatus(1, "accepted", "unhandled")).rejects.toThrow("Conflict");
        });
    });

    describe("getUserCompetence", () => {
        /**
         * Verifies that raw API response fields are correctly mapped to the camelCase CompetenceEntry
         * domain type.
         */
        it("maps response fields to CompetenceEntry", async () => {
            fetchUserCompetenceApiMock.mockResolvedValueOnce([
                { competence: "ticket sales", years_of_experience: 3 },
                { competence: "lotteries", years_of_experience: 1.5 },
            ]);
            isValidCompetenceMock.mockReturnValue(true);

            const result = await recruiterService.getUserCompetence(10);

            expect(result).toEqual([
                { competence: "ticket sales", yearsOfExperience: 3 },
                { competence: "lotteries", yearsOfExperience: 1.5 },
            ]);
        });

        /**
         * Verifies that an unknown competence string from the API causes a descriptive error to be thrown
         * rather than silently passing through.
         */
        it("throws for an unknown competence received from the API", async () => {
            fetchUserCompetenceApiMock.mockResolvedValueOnce([{ competence: "driving", years_of_experience: 2 }]);
            isValidCompetenceMock.mockReturnValue(false);

            await expect(recruiterService.getUserCompetence(10)).rejects.toThrow(
                'Unknown competence received from API: "driving"',
            );
        });

        it("propagates API errors", async () => {
            fetchUserCompetenceApiMock.mockRejectedValueOnce(new Error("Unauthorized"));

            await expect(recruiterService.getUserCompetence(10)).rejects.toThrow("Unauthorized");
        });
    });
});
