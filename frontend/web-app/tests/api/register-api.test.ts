import registerApi from "@/api/register-api";
import type { Account } from "@/types/account";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the registerApi function.
 *
 * These tests ensure that the registerApi correctly maps the Account object to the backend payload
 * and sends a POST request to the correct endpoint. Error handling is tested in integration tests.
 */
describe("registerApi", () => {
    it("maps Account to backend payload and sends POST request", async () => {
        const account: Account = {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane@example.com",
            personNumber: "19900101-1234",
            username: "janedoe",
            password: "password123",
        };

        await registerApi(account);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/users", {
            method: "POST",
            data: {
                name: "Jane",
                surname: "Doe",
                pnr: "19900101-1234",
                email: "jane@example.com",
                username: "janedoe",
                password: "password123",
                role_id: 2,
            },
        });
    });
});
