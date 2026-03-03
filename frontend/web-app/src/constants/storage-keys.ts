/**
 * Storage keys used in localStorage.
 */
const STORAGE_KEYS = {
    /* LOCAL */
    TOKEN: "token",
    LANGUAGE: "lang",
    /* SESSION */
    COMPLETION_TOKEN: "completion_token",
    COMPLETION_UID: "completion_uid",
} as const;

export default STORAGE_KEYS;
