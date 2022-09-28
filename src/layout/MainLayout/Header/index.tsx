// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import MobileSection from './MobileSection';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';
import useAuth from 'hooks/useAuth';

// assets
import { IconLogout, IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const { logout } = useAuth();

    const { drawerOpen } = useSelector((state) => state.menu);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        overflow: 'hidden',
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                        '&:hover': {
                            background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                            color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                        }
                    }}
                    onClick={() => dispatch(openDrawer(!drawerOpen))}
                    color="inherit"
                >
                    <IconMenu2 stroke={1.5} size="1.3rem" />
                </Avatar>
            </Box>

            {/* mega-menu */}
            <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                    <IconLogout stroke={1.5} size="1.3rem" />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
            </ListItemButton>

            {/* mobile header */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};

export default Header;
