import { createContext } from "react";

interface LoadingContextType {
    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

/**
 * Loading context to provide loading state throughout the app.
 */
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export default LoadingContext;
