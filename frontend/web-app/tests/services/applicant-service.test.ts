import applicantService from "@/services/applicant-service";
import type { ApplicationSubmission } from "@/types/application";
import type { Competence } from "@/types/competence";

const submitApplicationApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/submit-application-api", () => ({ default: submitApplicationApiMock }));

const competenceToIdMock = vi.hoisted(() => vi.fn<(c: Competence) => number>());
vi.mock("@/utils/competence-parser", () => ({ default: { competenceToId: competenceToIdMock } }));

/**
 * Unit tests for the applicantService module.
 *
 * These tests ensure that the applicantService correctly transforms the submission data and interacts with the API,
 * as well as properly propagating errors from the API.
 */
describe("applicantService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Call submitApplicationApi with correct payload,
     * ensuring that the service correctly transforms the input data.
     */
    it("should call submitApplicationApi with correct payload", async () => {
        const submission: ApplicationSubmission = {
            userId: 123,
            competenceProfile: [
                { competence: "ticket sales", yearsOfExperience: 3 },
                { competence: "lotteries", yearsOfExperience: 2 },
            ],
            availability: [{ fromDate: "2026-01-01", toDate: "2026-01-15" }],
        };

        competenceToIdMock.mockImplementation((competence) => {
            const map: Record<string, number> = { "ticket sales": 1, lotteries: 2 };
            return map[competence];
        });

        submitApplicationApiMock.mockResolvedValue(true);

        await applicantService.submitApplication(submission);

        expect(submitApplicationApiMock).toHaveBeenCalledOnce();
        expect(submitApplicationApiMock).toHaveBeenCalledWith({
            user_id: 123,
            competence_profile: [
                { competence_id: 1, years_of_experience: 3 },
                { competence_id: 2, years_of_experience: 2 },
            ],
            availability: [{ from_date: "2026-01-01", to_date: "2026-01-15" }],
        });
    });

    /**
     * Make sure API error propagation works correctly,
     * ensuring that any errors thrown by the API are correctly propagated to the caller of the service.
     */
    it("should propagate API errors", async () => {
        const submission: ApplicationSubmission = {
            userId: 123,
            competenceProfile: [{ competence: "ticket sales", yearsOfExperience: 3 }],
            availability: [{ fromDate: "2026-01-01", toDate: "2026-01-15" }],
        };

        competenceToIdMock.mockReturnValue(1);
        submitApplicationApiMock.mockRejectedValue(new Error("API failed"));

        await expect(applicantService.submitApplication(submission)).rejects.toThrow("API failed");
    });
});
