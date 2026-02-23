import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

import Container from "@mui/material/Container";

/**
 * The main layout component that renders a header, a container for the router outlet, and a footer.
 */
const MainLayout = () => (
    <>
        <Header />

        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Outlet />
        </Container>

        <Footer />
    </>
);

export default MainLayout;
