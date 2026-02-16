import { Outlet } from "react-router";
import ErrorProvider from "@/errors/ErrorProvider";
import Header from "./Header";
import Footer from "./Footer";

import Container from "@mui/material/Container";

const MainLayout = () => (
    <>
        <ErrorProvider>
            <Header />

            <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Outlet />
            </Container>

            <Footer />
        </ErrorProvider>
    </>
);

export default MainLayout;
