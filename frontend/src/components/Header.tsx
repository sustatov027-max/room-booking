import { Box, Button, Divider, Typography } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';

const handleExit = () => {
    localStorage.removeItem('jwtToken')
    window.location.reload()
}

const Header = () => {
    return(
    <>
        <Box sx={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'left',

            padding:2
        }}>
            <Typography component={'h1'} variant="h4" sx={{
                ml:2
            }}>
                Система бронирования переговорок
            </Typography>
            <Button
            onClick={handleExit}><LogoutIcon sx={{fontSize:"28px"}}/></Button>
        </Box>
        <Divider variant="middle" sx={{
            border:'2px solid rgba(73, 139, 214, 0.9)',
            mb:3
        }}></Divider>
    </>
    )
}

export default Header