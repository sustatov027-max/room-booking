
import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";

const handleExit = () => {
    localStorage.removeItem('jwtToken')
    window.location.reload()
}

const HomePage = () => {
    useEffect(() => {
    document.title = 'Главная';
  }, []);

    return (
        <>
        <Box sx={{display:"flex", justifyContent:"center"}}>
            <Typography variant="h4" component="h1" gutterBottom sx={{marginRight: 2}}>
                Добро пожаловать на главную страницу!
            </Typography>
            <Button variant="contained" color="primary" onClick={handleExit}>
                Выйти
            </Button>
        </Box>
        </>
    )
}

export default HomePage