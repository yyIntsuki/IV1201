import { useState } from "react";
import LoadingContext from "./LoadingContext";

/**
 * LoadingProvider component that provides loading context to its children. By wrapping this provider around the app,
 * it is then possible to pass down loading states and trigger loading without manually implementing one in every page.
 */
const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider
            value={{ loading, startLoading: () => setLoading(true), stopLoading: () => setLoading(false) }}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;
