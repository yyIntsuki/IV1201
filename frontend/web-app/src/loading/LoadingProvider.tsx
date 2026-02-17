import { useState } from "react";
import LoadingContext from "./LoadingContext";

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
