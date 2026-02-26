import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Recruiter from "@/pages/Recruiter";
import type { ApplicationRecord } from "@/types/application";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const getApplicationsMock = vi.hoisted(() => vi.fn());
const getUserCompetenceMock = vi.hoisted(() => vi.fn());
const setApplicationStatusMock = vi.hoisted(() => vi.fn());
vi.mock("@/services/recruiter-service", () => ({
    default: {
        getApplications: getApplicationsMock,
        getUserCompetence: getUserCompetenceMock,
        setApplicationStatus: setApplicationStatusMock,
    },
}));

const startLoadingMock = vi.fn();
const stopLoadingMock = vi.fn();
vi.mock("@/hooks/use-loading", () => ({
    default: () => ({ startLoading: startLoadingMock, stopLoading: stopLoadingMock }),
}));

const showApiErrorMock = vi.fn();
vi.mock("@/hooks/use-error", () => ({ default: () => ({ showApiError: showApiErrorMock }) }));

vi.mock("@/components/recruiter/ApplicationsTable", () => ({
    default: function ApplicationsTableMock({
        applications,
        onRowClick,
    }: {
        applications: ApplicationRecord[];
        totalCount: number;
        page: number;
        rowsPerPage: number;
        onPageChange: (page: number) => void;
        onRowsPerPageChange: (rows: number) => void;
        onRowClick: (app: ApplicationRecord) => void;
    }) {
        return (
            <div data-testid="applications-table">
                {applications.map((app) => (
                    <div
                        key={app.applicationId}
                        data-testid={`row-${app.applicationId}`}
                        onClick={() => onRowClick(app)}>
                        {app.fullName}
                    </div>
                ))}
            </div>
        );
    },
}));

vi.mock("@/components/recruiter/ApplicationDetailsDialog", () => ({
    default: function ApplicationDetailsDialogMock({
        application,
        onClose,
        onStatusChange,
    }: {
        application: ApplicationRecord | null;
        competenceProfile: ApplicationRecord["competenceProfile"] | null;
        onClose: () => void;
        onStatusChange: (status: string) => void;
    }) {
        if (!application) return null;
        return (
            <div data-testid="application-dialog">
                <span data-testid="dialog-name">{application.fullName}</span>
                <span data-testid="dialog-status">{application.status}</span>
                <button onClick={() => onStatusChange("accepted")}>accept</button>
                <button onClick={onClose}>close</button>
            </div>
        );
    },
}));

const mockApplication: ApplicationRecord = {
    applicationId: 1,
    userId: 10,
    fullName: "Jane Doe",
    status: "unhandled",
    competenceProfile: [],
    availability: [{ fromDate: "2026-01-01", toDate: "2026-01-15" }],
};

/**
 * Unit tests for the Recruiter page component.
 *
 * These tests ensure that the Recruiter page correctly orchestrates data fetching, passes data to
 * child components, and handles row clicks and status changes.
 */
describe("Recruiter Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getApplicationsMock.mockResolvedValue([mockApplication]);
        getUserCompetenceMock.mockResolvedValue([{ competence: "ticket sales", yearsOfExperience: 3 }]);
        setApplicationStatusMock.mockResolvedValue(undefined);
    });

    /**
     * Verifies that the page loads applications on mount and renders them in the table.
     */
    it("loads and displays applications on mount", async () => {
        render(<Recruiter />);

        await waitFor(() => {
            expect(screen.getByTestId("row-1")).toBeInTheDocument();
        });

        expect(getApplicationsMock).toHaveBeenCalledOnce();
        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
        expect(startLoadingMock).toHaveBeenCalled();
        expect(stopLoadingMock).toHaveBeenCalled();
    });

    /**
     * Verifies that clicking a row opens the dialog and triggers a competence fetch.
     */
    it("opens dialog and fetches competence when a row is clicked", async () => {
        render(<Recruiter />);

        await waitFor(() => screen.getByTestId("row-1"));
        fireEvent.click(screen.getByTestId("row-1"));

        await waitFor(() => {
            expect(screen.getByTestId("application-dialog")).toBeInTheDocument();
        });

        expect(getUserCompetenceMock).toHaveBeenCalledWith(mockApplication.userId);
        expect(screen.getByTestId("dialog-name")).toHaveTextContent("Jane Doe");
    });

    /**
     * Verifies that closing the dialog clears the selected application.
     */
    it("closes the dialog when onClose is called", async () => {
        render(<Recruiter />);

        await waitFor(() => screen.getByTestId("row-1"));
        fireEvent.click(screen.getByTestId("row-1"));
        await waitFor(() => screen.getByTestId("application-dialog"));

        fireEvent.click(screen.getByText("close"));

        await waitFor(() => {
            expect(screen.queryByTestId("application-dialog")).not.toBeInTheDocument();
        });
    });

    /**
     * Verifies that a status change updates the application in the table and in the dialog.
     */
    it("updates application status when onStatusChange is called", async () => {
        render(<Recruiter />);

        await waitFor(() => screen.getByTestId("row-1"));
        fireEvent.click(screen.getByTestId("row-1"));
        await waitFor(() => screen.getByTestId("application-dialog"));

        fireEvent.click(screen.getByText("accept"));

        await waitFor(() => {
            expect(setApplicationStatusMock).toHaveBeenCalledWith(
                mockApplication.applicationId,
                "accepted",
                mockApplication.status,
            );
        });

        expect(screen.getByTestId("dialog-status")).toHaveTextContent("accepted");
    });

    /**
     * Verifies that a failed application load surfaces an error without crashing.
     */
    it("shows an error when loading applications fails", async () => {
        getApplicationsMock.mockRejectedValueOnce(new Error("Unauthorized"));

        render(<Recruiter />);

        await waitFor(() => {
            expect(showApiErrorMock).toHaveBeenCalled();
        });
    });

    /**
     * Verifies that a failed competence fetch surfaces an error without closing the dialog.
     */
    it("shows an error when fetching competence fails", async () => {
        getUserCompetenceMock.mockRejectedValueOnce(new Error("Server error"));

        render(<Recruiter />);

        await waitFor(() => screen.getByTestId("row-1"));
        fireEvent.click(screen.getByTestId("row-1"));

        await waitFor(() => {
            expect(showApiErrorMock).toHaveBeenCalled();
        });

        expect(screen.getByTestId("application-dialog")).toBeInTheDocument();
    });
});
