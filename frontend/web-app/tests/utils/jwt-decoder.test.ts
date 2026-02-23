import { decodeJwt, isJwtExpired, getJwtRemainingTime, getRoleFromJwt, getUserIdFromJwt } from "@/utils/jwt-decoder";

const jwtDecodeMock = vi.hoisted(() => vi.fn());
vi.mock("jwt-decode", () => ({ jwtDecode: jwtDecodeMock }));

/**
 * Unit tests for the jwt-decoder utility functions.
 *
 * These tests verify correct JWT decoding, expiry detection, remaining time calculation,
 * and field extraction. The underlying jwtDecode library is mocked so tests remain
 * independent of real JWT signing and can control payloads precisely.
 */
describe("jwt-decoder", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("decodeJwt", () => {
        /**
         * Returns the decoded payload when jwtDecode succeeds.
         */
        it("returns decoded payload for a valid token", () => {
            const payload = { user_id: 1, role_id: 2, exp: 9999999999 };
            jwtDecodeMock.mockReturnValue(payload);

            const result = decodeJwt("valid.token.here");

            expect(jwtDecodeMock).toHaveBeenCalledWith("valid.token.here");
            expect(result).toEqual(payload);
        });

        /**
         * Returns null when jwtDecode throws, e.g. for a malformed token string.
         */
        it("returns null when jwtDecode throws", () => {
            jwtDecodeMock.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            const result = decodeJwt("not-a-jwt");

            expect(result).toBeNull();
        });
    });

    describe("isJwtExpired", () => {
        /**
         * Returns false when the token's exp is in the future.
         */
        it("returns false for a token that has not expired", () => {
            const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
            jwtDecodeMock.mockReturnValue({ user_id: 1, role_id: 2, exp: futureExp });

            expect(isJwtExpired("token")).toBe(false);
        });

        /**
         * Returns true when the token's exp is in the past.
         */
        it("returns true for a token that has expired", () => {
            const pastExp = Math.floor(Date.now() / 1000) - 1; // 1 second ago
            jwtDecodeMock.mockReturnValue({ user_id: 1, role_id: 2, exp: pastExp });

            expect(isJwtExpired("token")).toBe(true);
        });

        /**
         * Returns true when decoding fails, treating an invalid token as expired.
         */
        it("returns true when token cannot be decoded", () => {
            jwtDecodeMock.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            expect(isJwtExpired("garbage")).toBe(true);
        });
    });

    describe("getJwtRemainingTime", () => {
        /**
         * Returns a positive number of milliseconds for a token that hasn't expired.
         */
        it("returns remaining milliseconds for a valid token", () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

            const expInSeconds = Math.floor(Date.now() / 1000) + 60; // 60 seconds from now
            jwtDecodeMock.mockReturnValue({ user_id: 1, role_id: 2, exp: expInSeconds });

            const result = getJwtRemainingTime("token");

            expect(result).toBe(60 * 1000); // 60,000 ms

            vi.useRealTimers();
        });

        /**
         * Returns 0 when the token has already expired instead of a negative number.
         */
        it("returns 0 for an already-expired token", () => {
            const pastExp = Math.floor(Date.now() / 1000) - 10;
            jwtDecodeMock.mockReturnValue({ user_id: 1, role_id: 2, exp: pastExp });

            expect(getJwtRemainingTime("token")).toBe(0);
        });

        /**
         * Returns 0 when the token cannot be decoded.
         */
        it("returns 0 when token cannot be decoded", () => {
            jwtDecodeMock.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            expect(getJwtRemainingTime("garbage")).toBe(0);
        });
    });

    describe("getRoleFromJwt", () => {
        /**
         * Extracts role_id from a valid decoded payload.
         */
        it("returns role_id from a valid token", () => {
            jwtDecodeMock.mockReturnValue({ user_id: 5, role_id: 1, exp: 9999999999 });

            expect(getRoleFromJwt("token")).toBe(1);
        });

        /**
         * Returns null when decoding fails.
         */
        it("returns null when token cannot be decoded", () => {
            jwtDecodeMock.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            expect(getRoleFromJwt("garbage")).toBeNull();
        });
    });

    describe("getUserIdFromJwt", () => {
        /**
         * Extracts user_id from a valid decoded payload.
         */
        it("returns user_id from a valid token", () => {
            jwtDecodeMock.mockReturnValue({ user_id: 42, role_id: 2, exp: 9999999999 });

            expect(getUserIdFromJwt("token")).toBe(42);
        });

        /**
         * Returns null when decoding fails.
         */
        it("returns null when token cannot be decoded", () => {
            jwtDecodeMock.mockImplementation(() => {
                throw new Error("Invalid token");
            });

            expect(getUserIdFromJwt("garbage")).toBeNull();
        });
    });
});
