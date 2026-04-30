import { useEffect } from "react";
import Header from "./Header";
import { Container } from "@mui/material";

const UserPage = () => {
    useEffect(() => {
        document.title = 'Главная';
        }, []);

    return(
        <Container maxWidth="lg">
            <Header/>
        </Container>
    )
}

export default UserPage