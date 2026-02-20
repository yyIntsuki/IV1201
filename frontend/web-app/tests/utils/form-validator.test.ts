import { describe, it, expect } from "vitest";
import type { TFunction } from "i18next";
import formValidator from "@/utils/form-validator";

const t = ((key: string) => key) as unknown as TFunction;

/**
 * Unit tests for the formValidator utility functions.
 *
 * These tests ensure that all formValidator functions provide correct validation error messages,
 * handle edge cases, and are ready for future form fields even if unused.
 */
describe("formValidator", () => {
    const validators = formValidator(t);

    /**
     * validateIdentifier:
     *  - Returns error for empty input
     *  - Returns error for invalid email
     *  - Returns error for short username
     *  - Accepts valid email and username
     */
    describe("validateIdentifier", () => {
        it("returns error when empty", () => {
            expect(validators.validateIdentifier("")).toBe("validation.identifierRequired");
        });

        it("returns error for invalid email", () => {
            expect(validators.validateIdentifier("test@")).toBe("validation.emailInvalid");
        });

        it("returns error for short username", () => {
            expect(validators.validateIdentifier("abc")).toBe("validation.usernameTooShort");
        });

        it("accepts valid email", () => {
            expect(validators.validateIdentifier("test@example.com")).toBeNull();
        });

        it("accepts valid username", () => {
            expect(validators.validateIdentifier("validUser")).toBeNull();
        });
    });

    /**
     * validatePassword:
     *  - Returns error for empty input
     *  - Returns error for too short password
     *  - Accepts valid password
     */
    describe("validatePassword", () => {
        it("returns error when empty", () => {
            expect(validators.validatePassword("")).toBe("validation.passwordRequired");
        });

        it("returns error when too short", () => {
            expect(validators.validatePassword("1234567")).toBe("validation.passwordTooShort");
        });

        it("accepts valid password", () => {
            expect(validators.validatePassword("12345678")).toBeNull();
        });
    });

    /**
     * validateFirstName:
     *  - Returns error for empty input
     *  - Accepts non-empty input
     */
    describe("validateFirstName", () => {
        it("returns error when empty", () => {
            expect(validators.validateFirstName("")).toBe("validation.firstNameRequired");
        });

        it("accepts non-empty firstname", () => {
            expect(validators.validateFirstName("Jane")).toBeNull();
        });
    });

    /**
     * validateLastName:
     *  - Returns error for empty input
     *  - Accepts non-empty input
     */
    describe("validateLastName", () => {
        it("returns error when empty", () => {
            expect(validators.validateLastName("")).toBe("validation.lastNameRequired");
        });

        it("accepts non-empty lastname", () => {
            expect(validators.validateLastName("Doe")).toBeNull();
        });
    });

    /**
     * validateEmail:
     *  - Returns error for empty input
     *  - Returns error for invalid format
     *  - Accepts valid email
     */
    describe("validateEmail", () => {
        it("returns error when empty", () => {
            expect(validators.validateEmail("")).toBe("validation.emailRequired");
        });

        it("returns error for invalid email", () => {
            expect(validators.validateEmail("invalid-email")).toBe("validation.emailInvalid");
        });

        it("accepts valid email", () => {
            expect(validators.validateEmail("test@example.com")).toBeNull();
        });
    });

    /**
     * validatePersonNumber:
     *  - Returns error for empty input
     *  - Returns error for invalid format
     *  - Returns error for impossible dates
     *  - Accepts valid person number
     */
    describe("validatePersonNumber", () => {
        it("returns error when empty", () => {
            expect(validators.validatePersonNumber("")).toBe("validation.personNumberRequired");
        });

        it("returns error for invalid format", () => {
            expect(validators.validatePersonNumber("123")).toBe("validation.personNumberFormat");
            expect(validators.validatePersonNumber("abcd1234-5678")).toBe("validation.personNumberFormat");
        });

        it("returns error for impossible date", () => {
            expect(validators.validatePersonNumber("18000101-1234")).toBe("validation.personNumberInvalid");
            expect(validators.validatePersonNumber("20231301-1234")).toBe("validation.personNumberInvalid");
            expect(validators.validatePersonNumber("20230230-1234")).toBe("validation.personNumberInvalid");
        });

        it("accepts valid person number", () => {
            const currentYear = new Date().getFullYear();
            const validPnr = `${currentYear}0101-1234`;
            expect(validators.validatePersonNumber(validPnr)).toBeNull();
        });
    });
});
