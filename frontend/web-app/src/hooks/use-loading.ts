import { useContext } from "react";
import LoadingContext from "@/loading/LoadingContext";

/**
 * Custom hook to access loading context.
 * @returns The loading context.
 */
const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used within LoadingProvider");
    return context;
};

export default useLoading;
