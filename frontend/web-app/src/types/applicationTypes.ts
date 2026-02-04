type ApplicationStatus = "accepted" | "rejected" | "unhandled";

export interface JobApplication {
	id: string;
	fullName: string;
	status: ApplicationStatus;
}
