import { useTranslation } from "react-i18next";
import type { JobApplication } from "@/types/application";
import ApplicationStatusChip from "./ApplicationStatusChip";

import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";

interface ApplicationsTableProps {
    applications: JobApplication[];
    totalCount: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    onRowClick: (app: JobApplication) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
    applications,
    totalCount,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onRowClick,
}) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                minWidth: 450,
                display: "flex",
                flexDirection: "column",
                border: "1px solid gray",
                borderRadius: 1,
                overflow: "hidden",
            }}>
            <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>{t("recruiter.applications.table.applicantName")}</strong>
                            </TableCell>
                            <TableCell sx={{ width: 120 }} align="center">
                                <strong>{t("recruiter.applications.table.statusTitle")}</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id} hover sx={{ cursor: "pointer" }} onClick={() => onRowClick(app)}>
                                <TableCell>{app.fullName}</TableCell>
                                <TableCell align="center">
                                    <ApplicationStatusChip status={app.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_e, newPage) => onPageChange(newPage)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10]}
                onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
                labelRowsPerPage={t("pagination.rowsPerPage")}
                labelDisplayedRows={({ from, to, count }) =>
                    t("pagination.displayedRows", "{{from}}–{{to}} of {{count}}", { from, to, count })
                }
            />
        </Box>
    );
};

export default ApplicationsTable;
