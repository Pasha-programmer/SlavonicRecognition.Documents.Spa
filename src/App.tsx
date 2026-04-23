import './App.css';

import Menu from './Components/Menu';
import { Box, Typography } from '@mui/joy';
import Router from './Components/Router';
import { RoutePaths } from './Constants/RoutePaths';

export default function App() {
    return (
        <>
            <Typography py={2} width='100%' component={'a'} href={RoutePaths.Home}>Система распознавания символов</Typography>
            <Box className="body">

                <Menu/>
                <Box className='content'>
                    <Router/>
                </Box>
            </Box>
        </>
    )
}
