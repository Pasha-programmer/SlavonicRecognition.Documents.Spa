import { Box, MenuItem, MenuList, Stack } from '@mui/joy';
import { RoutePaths } from '../Constants/RoutePaths';

export default function Menu(){

    return(
        <Box sx={{display: 'flex', height: 300}}>
            <Stack spacing={2}>
                <MenuList>
                    <MenuItem component='a' href={RoutePaths.Documents}>Все документы</MenuItem>
                    <MenuItem component='a' href={RoutePaths.RecignizedDocuments}>Распознанные документы</MenuItem>
                    <MenuItem component='a' href={RoutePaths.Queue}>Очередь</MenuItem>
                </MenuList>
            </Stack>
        </Box>
    )
}