import submitApplicationApi from "@/api/submit-application-api";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the submitApplicationApi function.
 *
 * These tests ensure that the submitApplicationApi correctly calls the backend API
 * with the right parameters and handles both successful responses and errors appropriately.
 */
describe("submitApplicationApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls API with correct payload", async () => {
        const payload = {
            user_id: 123,
            competence_profile: [
                { competence_id: 1, years_of_experience: 3 },
                { competence_id: 2, years_of_experience: 2 },
            ],
            availability: [{ from_date: "2026-01-01", to_date: "2026-01-15" }],
        };

        apiRequestMock.mockResolvedValueOnce(true);

        const result = await submitApplicationApi(payload);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/applications", { method: "POST", data: payload });
        expect(result).toBe(true);
    });

    it("handles application with single competence", async () => {
        const payload = {
            user_id: 456,
            competence_profile: [{ competence_id: 1, years_of_experience: 5 }],
            availability: [
                { from_date: "2026-02-01", to_date: "2026-02-15" },
                { from_date: "2026-03-01", to_date: "2026-03-15" },
            ],
        };

        apiRequestMock.mockResolvedValueOnce(true);

        const result = await submitApplicationApi(payload);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(result).toBe(true);
    });

    it("propagates API errors", async () => {
        const payload = {
            user_id: 123,
            competence_profile: [{ competence_id: 1, years_of_experience: 3 }],
            availability: [{ from_date: "2026-01-01", to_date: "2026-01-15" }],
        };

        apiRequestMock.mockRejectedValueOnce(new Error("Validation error"));

        await expect(submitApplicationApi(payload)).rejects.toThrow("Validation error");
    });
});
