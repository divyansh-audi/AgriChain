import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Alert,
  Snackbar,
  Chip,
  Container,
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { 
    account, 
    connected, 
    connectWallet, 
    disconnectWallet, 
    loading, 
    error,
    getCurrentNetwork,
    isCorrectNetwork,
  } = useWeb3();
  
  const { notifications, markNotificationAsRead, isRegistered } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotifAnchorEl(null);
  };

  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const currentNetwork = getCurrentNetwork();

  const navigationItems = [
    { path: '/', label: 'Home' },
    ...(isRegistered() ? [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/insurance', label: 'Insurance' },
      { path: '/lending', label: 'Lending' },
      { path: '/carbon', label: 'Carbon Credits' },
    ] : []),
    ...(connected && !isRegistered() ? [
      { path: '/register', label: 'Register' },
    ] : []),
  ];

  React.useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          color: '#1a365d',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: '#1a365d',
                fontWeight: 700,
                fontFamily: '"Manrope", "Inter", "Roboto", sans-serif !important',
                fontSize: '1.5rem',
                letterSpacing: '-0.01em',
                '&:visited, &:hover, &:active, &:focus': {
                  color: '#1a365d',
                  fontFamily: '"Manrope", "Inter", "Roboto", sans-serif !important',
                },
              }}
            >
              🌾 AgriChain
            </Typography>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 3 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{
                    color: location.pathname === item.path ? '#1a365d' : '#4a5568',
                    bgcolor: location.pathname === item.path ? '#f7fafc' : 'transparent',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontFamily: '"Inter", "Roboto", sans-serif !important',
                    '&:hover': {
                      bgcolor: '#f7fafc',
                      color: '#1a365d',
                    },
                    '&:visited': {
                      color: location.pathname === item.path ? '#1a365d' : '#4a5568',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {connected && !isCorrectNetwork() && (
              <Chip
                label="Wrong Network"
                size="small"
                sx={{ 
                  mr: 2,
                  bgcolor: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  fontFamily: '"Inter", "Roboto", sans-serif !important',
                }}
              />
            )}

            {connected && currentNetwork && (
              <Chip
                label={currentNetwork.name}
                size="small"
                sx={{ 
                  mr: 2,
                  bgcolor: '#f0f9ff',
                  color: '#1a365d',
                  border: '1px solid #bfdbfe',
                  fontFamily: '"Inter", "Roboto", sans-serif !important',
                }}
              />
            )}

            {connected && (
              <IconButton 
                color="inherit" 
                onClick={handleNotificationMenu} 
                sx={{ 
                  mr: 1,
                  color: '#4a5568',
                  '&:hover': { bgcolor: '#f7fafc' }
                }}
              >
                <Badge badgeContent={unreadNotifications} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            )}

            {connected ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 2, 
                    display: { xs: 'none', sm: 'block' },
                    color: '#4a5568',
                    fontFamily: '"Inter", "Roboto", sans-serif !important',
                  }}
                >
                  {formatAddress(account)}
                </Typography>
                <IconButton 
                  color="inherit" 
                  onClick={handleMenu}
                  sx={{ 
                    color: '#4a5568',
                    '&:hover': { bgcolor: '#f7fafc' }
                  }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 14px rgba(26, 54, 93, 0.15)',
                      fontFamily: '"Inter", "Roboto", sans-serif !important',
                    }
                  }}
                >
                  {isRegistered() && (
                    <MenuItem 
                      onClick={() => { navigate('/profile'); handleClose(); }}
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif !important' }}
                    >
                      Profile
                    </MenuItem>
                  )}
                  {isRegistered() && (
                    <MenuItem 
                      onClick={() => { navigate('/dashboard'); handleClose(); }}
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif !important' }}
                    >
                      Dashboard
                    </MenuItem>
                  )}
                  {!isRegistered() && (
                    <MenuItem 
                      onClick={() => { navigate('/register'); handleClose(); }}
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif !important' }}
                    >
                      Register
                    </MenuItem>
                  )}
                  <MenuItem 
                    onClick={() => { disconnectWallet(); handleClose(); }}
                    sx={{ fontFamily: '"Inter", "Roboto", sans-serif !important' }}
                  >
                    Disconnect
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button 
                onClick={connectWallet}
                disabled={loading}
                variant="contained"
                sx={{ 
                  bgcolor: '#1a365d',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontFamily: '"Inter", "Roboto", sans-serif !important',
                  '&:hover': {
                    bgcolor: '#2d3748',
                  },
                }}
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}

            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: { 
                  width: 320, 
                  maxHeight: 400,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(26, 54, 93, 0.15)',
                  fontFamily: '"Inter", "Roboto", sans-serif !important',
                }
              }}
            >
              {notifications.length === 0 ? (
                <MenuItem disabled sx={{ fontFamily: '"Inter", "Roboto", sans-serif !important' }}>
                  No notifications
                </MenuItem>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => {
                      markNotificationAsRead(notification.id);
                      handleNotificationClose();
                    }}
                    sx={{
                      bgcolor: notification.read ? 'transparent' : '#f7fafc',
                      whiteSpace: 'normal',
                      alignItems: 'flex-start',
                      py: 2,
                      fontFamily: '"Inter", "Roboto", sans-serif !important',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                      {notification.type === 'warning' ? (
                        <Warning color="warning" sx={{ mr: 1, mt: 0.5 }} />
                      ) : (
                        <CheckCircle color="success" sx={{ mr: 1, mt: 0.5 }} />
                      )}
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            fontFamily: '"Inter", "Roboto", sans-serif !important',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontFamily: '"Inter", "Roboto", sans-serif !important' }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontFamily: '"Inter", "Roboto", sans-serif !important' }}
                        >
                          {notification.timestamp.toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;
