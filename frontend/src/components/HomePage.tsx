
import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/userSlice";

const handleExit = () => {
    localStorage.removeItem('jwtToken')
    window.location.reload()
}

const HomePage = () => {
    useEffect(() => {
    document.title = 'Главная';
    }, []);

    const user = useAppSelector(selectUser)

    return (
        <>
        <Box sx={{display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center",}}>
            <Typography variant="h4" component="h1" gutterBottom sx={{marginRight: 2}}>
                Добро пожаловать на главную страницу!
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom sx={{marginRight: 2}}>
                Вы вошли как: {user.name} ({user.email}) - Роль: {user.role}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleExit}>
                Выйти
            </Button>
        </Box>
        </>
    )
}

export default HomePage