import { fetchAvailabilitiesApi, type AvailabilityResponse } from "@/api/fetch-availabilities-api";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the fetchAvailabilitiesApi function.
 *
 * These tests ensure that the fetchAvailabilitiesApi correctly calls the backend API
 * with the right parameters and handles both successful responses and errors appropriately.
 */
describe("fetchAvailabilitiesApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls /api/v1/availabilities with GET and returns availability data", async () => {
        const mockResponse: AvailabilityResponse[] = [
            {
                availability_id: 1,
                user_id: 2,
                name: "Jane",
                surname: "Doe",
                from_date: "2026-01-01",
                to_date: "2026-01-15",
                status: "unhandled",
            },
            {
                availability_id: 2,
                user_id: 3,
                name: "John",
                surname: "Smith",
                from_date: "2026-02-01",
                to_date: "2026-02-28",
                status: "accepted",
            },
        ];

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await fetchAvailabilitiesApi();

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/availabilities", { method: "GET" });
        expect(result).toEqual(mockResponse);
    });

    it("returns empty array when no availabilities exist", async () => {
        const mockResponse: AvailabilityResponse[] = [];

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await fetchAvailabilitiesApi();

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(result).toEqual([]);
    });

    it("propagates API errors", async () => {
        const error = new Error("Unauthorized");

        apiRequestMock.mockRejectedValueOnce(error);

        await expect(fetchAvailabilitiesApi()).rejects.toThrow("Unauthorized");
    });
});
