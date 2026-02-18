import { useState, useCallback } from "react";
import LoadingContext from "./LoadingContext";

/**
 * LoadingProvider component that provides loading context to its children. By wrapping this provider around the app,
 * it is then possible to pass down loading states and trigger loading without manually implementing one in every page.
 */
const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);

    const startLoading = useCallback(() => setLoading(true), []);
    const stopLoading = useCallback(() => setLoading(false), []);

    return <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
