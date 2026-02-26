import updateAvailabilityStatusApi from "@/api/update-availability-status-api";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the updateAvailabilityStatusApi function.
 *
 * These tests ensure that the updateAvailabilityStatusApi correctly calls the backend API
 * with the right parameters and handles both successful responses and errors appropriately.
 */
describe("updateAvailabilityStatusApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls API with correct payload", async () => {
        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(1, { status: "accepted", expected_status: "unhandled" });

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/availabilities/1/status", {
            method: "POST",
            data: { status: "accepted", expected_status: "unhandled" },
        });
        expect(result).toBe(true);
    });

    it("handles rejection status update", async () => {
        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(2, { status: "rejected", expected_status: "unhandled" });

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/availabilities/2/status", {
            method: "POST",
            data: { status: "rejected", expected_status: "unhandled" },
        });
        expect(result).toBe(true);
    });

    it("handles status change from accepted to rejected", async () => {
        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(3, { status: "rejected", expected_status: "accepted" });

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(result).toBe(true);
    });

    it("handles status reset to unhandled", async () => {
        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(4, { status: "unhandled", expected_status: "accepted" });

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(result).toBe(true);
    });

    it("propagates API errors", async () => {
        apiRequestMock.mockRejectedValueOnce(new Error("Conflict: status already changed"));

        await expect(
            updateAvailabilityStatusApi(1, { status: "accepted", expected_status: "unhandled" }),
        ).rejects.toThrow("Conflict: status already changed");
    });
});
