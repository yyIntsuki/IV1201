import { useTranslation } from "react-i18next";

import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

/**
 * Sets the language for the application globally.
 */
const LanguageToggleButton = () => {
    const { i18n } = useTranslation();

    const handleChange = (_: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
        if (!newLanguage) return; // required for exclusive toggle
        i18n.changeLanguage(newLanguage);
    };

    return (
        <ToggleButtonGroup color="primary" value={i18n.language} exclusive onChange={handleChange} size="small">
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="sv">SV</ToggleButton>
        </ToggleButtonGroup>
    );
};

export default LanguageToggleButton;
