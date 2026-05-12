import {Typography, Box, Divider } from "@mui/material"

const Footer = () => {
    return (
        <>
            <Divider variant="fullWidth" sx={{
                border: '2px solid rgba(73, 139, 214, 0.9)',
                mb: 3,
                mt: 3,
            }} />
            
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, pr: 4, pl: 4 }}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Компания
                    </Typography>
                    <Typography variant="body2">
                        ООО "RB-automatics"
                    </Typography>
                    <Typography variant="body2">
                        ИНН: 1234567890
                    </Typography>
                </Box>
                
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Адрес
                    </Typography>
                    <Typography variant="body2">
                        г. Москва, ул. Промышленная, д. 123
                    </Typography>
                    <Typography variant="body2">
                        Бизнес-центр "Технопарк", офис 456
                    </Typography>
                </Box>
                
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Контакты
                    </Typography>
                    <Typography variant="body2">
                        +7 (999) 123-45-67
                    </Typography>
                    <Typography variant="body2">
                        info@rb-automatics.ru
                    </Typography>
                    <Typography variant="body2">
                        Пн-Пт: 9:00 - 21:00
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default Footer