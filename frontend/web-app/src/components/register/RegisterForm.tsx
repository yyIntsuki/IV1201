import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface RegisterFormProps {
    firstName: string;
    lastName: string;
    email: string;
    personNumber: string;
    username: string;
    password: string;
    setFirstName: (val: string) => void;
    setLastName: (val: string) => void;
    setEmail: (val: string) => void;
    setPersonNumber: (val: string) => void;
    setUsername: (val: string) => void;
    setPassword: (val: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    firstName,
    lastName,
    email,
    personNumber,
    username,
    password,
    setFirstName,
    setLastName,
    setEmail,
    setPersonNumber,
    setUsername,
    setPassword,
    handleSubmit,
}) => {
    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}>
            <TextField
                // error
                // helperText="Incorrect entry."
                required
                slotProps={{ inputLabel: { required: false } }}
                label="First Name"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Email"
                type="email"
                placeholder="jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Personal Number"
                placeholder="YYYYMMDD-XXXX"
                value={personNumber}
                onChange={(e) => setPersonNumber(e.target.value)}
            />
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" type="submit">
                Register
            </Button>
        </Box>
    );
};
