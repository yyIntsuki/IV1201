import ROLES from "@/constants/roles";

/**
 * Role type representing user roles in the system.
 */
export type Role = (typeof ROLES)[number];
