import { dummyApplications } from "../constants/applications";

import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

const Recruiter = () => {
    return (
        <Container>
            <Typography variant="h1">Recruiter Page</Typography>
            <Typography variant="body1">List of job applications below.</Typography>

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
                        {dummyApplications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>{app.fullName}</TableCell>
                                <TableCell>{app.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Recruiter;
