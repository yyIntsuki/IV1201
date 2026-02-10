import type { JobApplication } from "@/types/application";

import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import Chip from "@mui/material/Chip";

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
    return (
        <Box
            sx={{
                width: 650,
                display: "flex",
                flexDirection: "column",
                border: "1px solid gray",
                borderRadius: 1,
                overflow: "hidden",
            }}>
            <TableContainer sx={{ flex: 1, overflow: "auto" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Applicant Name</strong>
                            </TableCell>
                            <TableCell sx={{ width: 120 }}>
                                <strong>Status</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id} hover sx={{ cursor: "pointer" }} onClick={() => onRowClick(app)}>
                                <TableCell>{app.fullName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={app.status}
                                        size="small"
                                        color={
                                            app.status === "accepted" ? "success"
                                            : app.status === "rejected" ?
                                                "error"
                                            :   "default"
                                        }
                                    />
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
            />
        </Box>
    );
};

export default ApplicationsTable;
