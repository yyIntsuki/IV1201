import type { TFunction } from "i18next";

/**
 * A form validator, which returns validation errors in the selected locales.
 * @param t the i18next useTranslation hook.
 * @returns the corresponding validation error.
 */
const formValidator = (t: TFunction) => ({
    validateFirstName: (value: string): string | null => {
        if (!value.trim()) return t("validation.firstNameRequired");
        return null;
    },

    validateLastName: (value: string): string | null => {
        if (!value.trim()) return t("validation.lastNameRequired");
        return null;
    },

    validateEmail: (value: string): string | null => {
        if (!value.trim()) return t("validation.emailRequired");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return t("validation.emailInvalid");
        return null;
    },

    validatePersonNumber: (value: string): string | null => {
        if (!value.trim()) return t("validation.personNumberRequired");

        const pnrRegex = /^(\d{4})(\d{2})(\d{2})-(\d{4})$/;
        const match = value.match(pnrRegex);

        if (!match) return t("validation.personNumberFormat");

        const [, yearStr, monthStr, dayStr] = match;

        const year = Number(yearStr);
        const month = Number(monthStr) - 1;
        const day = Number(dayStr);

        const currentYear = new Date().getFullYear();

        const date = new Date(year, month, day);

        const isInvalid =
            year < 1900 ||
            year > currentYear ||
            date.getFullYear() !== year ||
            date.getMonth() !== month ||
            date.getDate() !== day;

        if (isInvalid) return t("validation.personNumberInvalid");

        return null;
    },

    validateUsername: (value: string): string | null => {
        if (!value.trim()) return t("validation.usernameRequired");
        if (value.length < 4) return t("validation.usernameTooShort");
        return null;
    },

    validatePassword: (value: string): string | null => {
        if (!value.trim()) return t("validation.passwordRequired");
        if (value.length < 8) return t("validation.passwordTooShort");
        return null;
    },
});

export default formValidator;
