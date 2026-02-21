import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Applicant from "@/pages/Applicant";
import applicantService from "@/services/applicant-service";
import { getUserIdFromJwt } from "@/utils/jwt-decoder";
import type { Competence, Availability } from "@/types/application";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
    Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const submitApplicationMock = vi.mocked(applicantService.submitApplication);
vi.mock("@/services/applicant-service", () => ({ default: { submitApplication: vi.fn() } }));

const getUserIdMock = vi.mocked(getUserIdFromJwt);
vi.mock("@/utils/jwt-decoder", () => ({ getUserIdFromJwt: vi.fn(() => 2) }));

const startLoadingMock = vi.fn();
const stopLoadingMock = vi.fn();
vi.mock("@/hooks/use-loading", () => ({
    default: () => ({ startLoading: startLoadingMock, stopLoading: stopLoadingMock }),
}));

const showErrorMock = vi.fn();
const showApiErrorMock = vi.fn();
vi.mock("@/hooks/use-error", () => ({ default: () => ({ showError: showErrorMock, showApiError: showApiErrorMock }) }));

vi.mock("@/components/applicant/CompetenceInput", () => ({
    default: function CompetenceInputMock({
        onChange,
        onValidityChange,
    }: {
        value: Competence[];
        onChange: (val: Competence[]) => void;
        onValidityChange?: (valid: boolean) => void;
    }) {
        React.useEffect(() => {
            onChange([{ competence: "ticket sales", yearsOfExperience: 3 }]);
            onValidityChange?.(true);
        }, [onChange, onValidityChange]);
        return <div data-testid="competence-input" />;
    },
}));

vi.mock("@/components/applicant/AvailabilityInput", () => ({
    default: function AvailabilityInputMock({
        onChange,
        onValidityChange,
    }: {
        value: Availability[];
        onChange: (val: Availability[]) => void;
        onValidityChange?: (valid: boolean) => void;
    }) {
        React.useEffect(() => {
            onChange([{ fromDate: "2026-02-22", toDate: "2026-02-23" }]);
            onValidityChange?.(true);
        }, [onChange, onValidityChange]);
        return <div data-testid="availability-input" />;
    },
}));

vi.mock("@/components/applicant/ReviewSummaryList", () => ({
    default: () => <div data-testid="review-summary-list" />,
}));

/**
 * Unit tests for the Applicant page component.
 *
 * These tests ensure that the Applicant page correctly orchestrates the underlying hooks, handles user input, submits the form,
 * and displays errors when submission fails.
 */
describe("Applicant Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem("TOKEN", "dummy-token");
        submitApplicationMock.mockResolvedValue(undefined);
    });

    /**
     * Test the happy path of filling out the application form and submitting successfully.
     */
    test("submits application successfully", async () => {
        render(<Applicant />);

        expect(screen.getByTestId("competence-input")).toBeInTheDocument();
        fireEvent.click(screen.getByText(/next/i));

        await waitFor(() => screen.getByTestId("availability-input"));
        fireEvent.click(screen.getByText(/next/i));

        await waitFor(() => screen.getByTestId("review-summary-list"));
        fireEvent.click(screen.getByText(/submit/i));

        await waitFor(() => {
            expect(submitApplicationMock).toHaveBeenCalledTimes(1);
        });

        expect(await screen.findByText("applicant.applicationForm.submitted.title")).toBeInTheDocument();
        expect(screen.getByText("applicant.applicationForm.submitted.message")).toBeInTheDocument();

        expect(startLoadingMock).toHaveBeenCalled();
        expect(stopLoadingMock).toHaveBeenCalled();
        expect(showErrorMock).not.toHaveBeenCalled();
        expect(showApiErrorMock).not.toHaveBeenCalled();
    });

    /**
     * Test that an error is shown when the user ID cannot be extracted from the JWT, and that the application is not submitted.
     */
    test("shows error when userId is missing", async () => {
        getUserIdMock.mockReturnValueOnce(null);

        render(<Applicant />);

        fireEvent.click(screen.getByText(/next/i));
        await waitFor(() => screen.getByTestId("availability-input"));

        fireEvent.click(screen.getByText(/next/i));
        await waitFor(() => screen.getByTestId("review-summary-list"));

        fireEvent.click(screen.getByText(/submit/i));

        await waitFor(() => {
            expect(showErrorMock).toHaveBeenCalled();
        });

        expect(submitApplicationMock).not.toHaveBeenCalled();
    });
});
