import { updateAvailabilityStatusApi, type AvailabilityStatusPayload } from "@/api/update-availability-status-api";

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
        const availabilityId = 1;
        const payload: AvailabilityStatusPayload = { status: "accepted", expected_status: "unhandled" };

        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(availabilityId, payload);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/availabilities/1/status", {
            method: "POST",
            data: payload,
        });
        expect(result).toBe(true);
    });

    it("handles rejection status update", async () => {
        const availabilityId = 2;
        const payload: AvailabilityStatusPayload = { status: "rejected", expected_status: "unhandled" };

        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(availabilityId, payload);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/availabilities/2/status", {
            method: "POST",
            data: payload,
        });
        expect(result).toBe(true);
    });

    it("handles status change from accepted to rejected", async () => {
        const availabilityId = 3;
        const payload: AvailabilityStatusPayload = { status: "rejected", expected_status: "accepted" };

        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(availabilityId, payload);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(result).toBe(true);
    });

    it("handles status reset to unhandled", async () => {
        const availabilityId = 4;
        const payload: AvailabilityStatusPayload = { status: "unhandled", expected_status: "accepted" };

        apiRequestMock.mockResolvedValueOnce(true);

        const result = await updateAvailabilityStatusApi(availabilityId, payload);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(result).toBe(true);
    });

    it("propagates API errors", async () => {
        const availabilityId = 1;
        const payload: AvailabilityStatusPayload = { status: "accepted", expected_status: "unhandled" };

        const error = new Error("Conflict: status already changed");

        apiRequestMock.mockRejectedValueOnce(error);

        await expect(updateAvailabilityStatusApi(availabilityId, payload)).rejects.toThrow(
            "Conflict: status already changed",
        );
    });
});
