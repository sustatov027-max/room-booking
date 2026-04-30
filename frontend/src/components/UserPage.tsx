import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/userSlice";
import Header from "./Header";
import { Container } from "@mui/material";

const UserPage = () => {
    useEffect(() => {
        document.title = 'Главная';
        }, []);

    const user = useAppSelector(selectUser)

    return(
        <Container maxWidth="lg">
            <Header/>
        </Container>
    )
}

export default UserPage