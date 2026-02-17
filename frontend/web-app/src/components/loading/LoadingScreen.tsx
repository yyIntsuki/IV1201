import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useLoading from "@/hooks/use-loading";

const LoadingScreen = () => {
    const { loading } = useLoading();

    return (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingScreen;
