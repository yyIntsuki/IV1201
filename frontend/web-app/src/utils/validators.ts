export const validateFirstName = (value: string): string | null => {
    if (!value.trim()) return "First name is required.";
    return null;
};

export const validateLastName = (value: string): string | null => {
    if (!value.trim()) return "Last name is required.";
    return null;
};

export const validateEmail = (value: string): string | null => {
    if (!value.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Enter a valid email.";
    return null;
};

export const validatePersonNumber = (value: string): string | null => {
    if (!value.trim()) return "Person number is required.";
    const pnrRegex = /^\d{8}-\d{4}$/;
    if (!pnrRegex.test(value)) return "Format: YYYYMMDD-XXXX";
    return null;
};

export const validateUsername = (value: string): string | null => {
    if (!value.trim()) return "Username is required.";
    if (value.length < 4) return "Username must be at least 4 characters.";
    return null;
};

export const validatePassword = (value: string): string | null => {
    if (!value.trim()) return "Password is required.";
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    // if (!passwordRegex.test(value)) return "Password must be at least 8 characters and include letters and numbers.";
    if (value.length < 4) return "Password must be at least 4 characters."; // Temporary for testing
    return null;
};
