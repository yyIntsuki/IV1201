import type { Role } from "../types/role";

export const parseRole = (roleId: number): Role => {
	switch (roleId) {
		case 1: return "applicant";
		case 2: return "recruiter";
		default: throw new Error("Invalid role ID");
	}
};