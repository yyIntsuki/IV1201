import type { JobApplication } from "@/types/application";

import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Chip from "@mui/material/Chip";

interface ApplicationsTableProps {
    applications: JobApplication[];
    onRowClick: (app: JobApplication) => void;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ applications, onRowClick }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <strong>Applicant Name</strong>
                        </TableCell>
                        <TableCell>
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
    );
};
