import { Container, Typography } from "@mui/material"

const UnauthorizedPage = () => {
    return (
        <Container sx={{
            display:'flex',
            width:'100%',
            height:'100vh',
            justifyContent:'center',
            alignItems:'center'
        }}>
            <Typography>
                Нет прав доступа
            </Typography>
        </Container>
    )
}

export default UnauthorizedPage