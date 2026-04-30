
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/userSlice";
import Header from "./Header";

const handleExit = () => {
    localStorage.removeItem('jwtToken')
    window.location.reload()
}

const AdminPanel = () => {
    useEffect(() => {
    document.title = 'Админ панель';
    }, []);

    const user = useAppSelector(selectUser)

    return (
        <Container maxWidth="lg">
        <Header/>
        <Typography sx={{
            textAlign:'center',
            fontSize: '24px'
        }}>
            Админ панель
        </Typography>
        </Container>
    )
}

export default AdminPanel