import fetchUserCompetenceApi from "@/api/fetch-user-competence-api";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the fetchUserCompetenceApi function.
 *
 * These tests ensure that fetchUserCompetenceApi calls the correct endpoint and handles both
 * successful responses and errors appropriately.
 */
describe("fetchUserCompetenceApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls the correct endpoint with GET", async () => {
        apiRequestMock.mockResolvedValueOnce([]);

        await fetchUserCompetenceApi(42);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith(
            "/api/v1/competence/42",
            expect.objectContaining({ method: "GET" }),
        );
    });

    it("returns competence profile entries on success", async () => {
        const mockResponse = [
            { competence: "ticket sales", years_of_experience: 3 },
            { competence: "lotteries", years_of_experience: 1.5 },
        ];

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await fetchUserCompetenceApi(1);

        expect(result).toEqual(mockResponse);
    });

    it("propagates API errors", async () => {
        apiRequestMock.mockRejectedValueOnce(new Error("Unauthorized"));

        await expect(fetchUserCompetenceApi(1)).rejects.toThrow("Unauthorized");
    });
});
