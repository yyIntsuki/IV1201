/**
 * Single source of truth for all role definitions.
 * Maps role name to its numeric database ID.
 */
const ROLES = { recruiter: 1, applicant: 2 } as const;

export default ROLES;
