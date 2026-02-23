import { useContext } from "react";
import LoadingContext from "@/loading/LoadingContext";

/**
 * Retrieves the loading context, throwing an error if used outside of a LoadingProvider.
 * The context returned contains the following properties:
 *   - loading: a boolean indicating whether the application is currently loading
 *   - startLoading: a function that sets the loading state to true
 *   - stopLoading: a function that sets the loading state to false
 * @returns The loading context
 */
const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used within LoadingProvider");
    return context;
};

export default useLoading;
