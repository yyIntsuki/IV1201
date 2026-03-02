/**
 * Route constants to avoid hard-coding URL redirections in the code.
 */
const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    COMPLETE_ACCOUNT: "/complete-account",
    APPLICANT: "/applicant",
    RECRUITER: "/recruiter",
} as const;

export default ROUTES;
