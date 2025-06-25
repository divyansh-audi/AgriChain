import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Container,
  Alert,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Security,
  Nature,
  LocationOn,
  CalendarToday,
  CloudQueue,
  Warning,
  CheckCircle,
  Analytics,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { account, connected, connectWallet, getCurrentNetwork } = useWeb3();
  const { farmerData, stats, isRegistered, weatherData, activities, notifications } = useApp();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Redirect to registration if connected but not registered
  useEffect(() => {
    if (connected && !isRegistered()) {
      navigate('/register');
    }
  }, [connected, isRegistered, navigate]);

  const currentNetwork = getCurrentNetwork();

  // Enhanced stats with blockchain metrics
  const enhancedStats = [
    {
      title: 'Carbon Credits',
      value: stats.carbonCredits || 0,
      unit: 'Credits',
      icon: <Nature sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: '+12%',
      description: 'ERC-20 tokens earned',
      chainlinkFeature: 'Proof of Reserves',
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans || 0,
      unit: 'Loans',
      icon: <AccountBalance sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: 'Stable',
      description: 'Cross-chain via CCIP',
      chainlinkFeature: 'Automation',
    },
    {
      title: 'Insurance Policies',
      value: stats.insurancePolicies || 0,
      unit: 'Policies',
      icon: <Security sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: '+1',
      description: 'Weather-triggered',
      chainlinkFeature: 'Functions + Automation',
    },
    {
      title: 'Portfolio Value',
      value: `$${(stats.totalValue || 0).toLocaleString()}`,
      unit: '',
      icon: <TrendingUp sx={{ fontSize: 40, color: '#1a365d' }} />,
      trend: '+8.5%',
      description: 'Real-time via Data Feeds',
      chainlinkFeature: 'Price Feeds',
    },
  ];

  const quickActions = [
    {
      title: 'Weather Insurance',
      description: 'Create new weather-triggered policy',
      icon: <Security />,
      action: () => navigate('/insurance'),
      chainlinkTech: 'Functions + Automation',
    },
    {
      title: 'Cross-Chain Loan',
      description: 'Apply for Ethereum→Avalanche loan',
      icon: <AccountBalance />,
      action: () => navigate('/lending'),
      chainlinkTech: 'CCIP',
    },
    {
      title: 'Carbon Credits',
      description: 'Trade tokenized carbon credits',
      icon: <Nature />,
      action: () => navigate('/carbon'),
      chainlinkTech: 'Proof of Reserves',
    },
    {
      title: 'Market Data',
      description: 'View real-time crop prices',
      icon: <Analytics />,
      action: () => navigate('/analytics'),
      chainlinkTech: 'Data Feeds',
    },
  ];

  if (!connected) {
    return (
      <Box sx={{ 
        width: '100vw',
        overflowX: 'hidden',
        bgcolor: '#fafafa', 
        minHeight: '100vh',
        m: 0,
        p: 0,
      }}>
        <Container 
          maxWidth={false} 
          disableGutters 
          sx={{ 
            width: '100vw',
            px: { xs: 3, md: 4 },
            py: 8,
            m: 0,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
              p: 4,
            }}
          >
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                color: '#1a365d',
                fontFamily: '"Manrope", "Inter", sans-serif',
              }}
            >
              🌾 Welcome to AgriChain
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4, 
                maxWidth: 600,
                color: '#4a5568',
                fontFamily: '"Inter", "Roboto", sans-serif',
                lineHeight: 1.6,
              }}
            >
              Connect your wallet to access your blockchain-powered farmer dashboard with 
              Chainlink oracles, cross-chain lending, and automated insurance.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={connectWallet}
              sx={{ 
                bgcolor: '#1a365d',
                color: 'white',
                px: 6, 
                py: 2, 
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                fontFamily: '"Inter", "Roboto", sans-serif',
                '&:hover': {
                  bgcolor: '#2d3748',
                },
              }}
            >
              Connect Wallet to Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ 
        width: '100vw',
        overflowX: 'hidden',
        bgcolor: '#fafafa', 
        minHeight: '100vh',
        m: 0,
        p: 0,
      }}>
        <Container 
          maxWidth={false} 
          disableGutters 
          sx={{ 
            width: '100vw',
            px: { xs: 3, md: 4 },
            py: 4,
            m: 0,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#1a365d' }}>
            Loading your blockchain dashboard...
          </Typography>
          <LinearProgress sx={{ mb: 3 }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100vw',
      overflowX: 'hidden',
      bgcolor: '#fafafa', 
      minHeight: '100vh',
      m: 0,
      p: 0,
    }}>
      <Container 
        maxWidth={false} 
        disableGutters 
        sx={{ 
          width: '100vw',
          px: { xs: 3, md: 4 },
          py: 4,
          m: 0,
        }}
      >
        {/* Welcome Header with Blockchain Info */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 3,
          width: '100%',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'white', 
              color: '#1a365d',
              fontSize: '2.5rem',
            }}>
              👨‍🌾
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontFamily: '"Manrope", "Inter", sans-serif',
                }}
              >
                Welcome back, {farmerData.name || 'Farmer'}! 🌾
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Chip 
                  icon={<LocationOn />} 
                  label={farmerData.location || 'Location'} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
                <Chip 
                  icon={<CalendarToday />} 
                  label={`Farm: ${farmerData.farmSize || 'N/A'}`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
                <Chip 
                  label={`Crop: ${farmerData.cropType || 'N/A'}`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
                {farmerData.nftCreated && (
                  <Chip 
                    label="NFT Minted ✓" 
                    sx={{ 
                      bgcolor: 'rgba(76, 175, 80, 0.8)', 
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Connected to: {currentNetwork?.name || 'Unknown Network'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Wallet: {account?.slice(0, 6)}...{account?.slice(-4)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Chainlink Integration Status */}
        <Alert 
          severity="info" 
          sx={{ mb: 4, bgcolor: '#f0f9ff', border: '1px solid #bfdbfe' }}
          icon={<CheckCircle />}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            🔗 Chainlink Services Active: Functions (Weather Data) • Automation (Payouts) • CCIP (Cross-Chain) • Data Feeds (Prices)
          </Typography>
        </Alert>

        {/* Enhanced Stats Cards */}
        <Box sx={{ mb: 4, width: '100%' }}>
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 600, 
            mb: 3,
            fontFamily: '"Manrope", "Inter", sans-serif',
          }}>
            📊 Portfolio Overview
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}>
            {enhancedStats.map((stat, index) => (
              <Card key={index} sx={{ 
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(26, 54, 93, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {stat.icon}
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        color: '#1a365d',
                        fontFamily: '"Manrope", "Inter", sans-serif',
                      }}>
                        {stat.value}
                      </Typography>
                      {stat.unit && (
                        <Typography variant="body2" sx={{ color: '#4a5568' }}>
                          {stat.unit}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ 
                    color: '#4a5568', 
                    mb: 1,
                    fontWeight: 500,
                  }}>
                    {stat.title}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ 
                    color: '#6b7280',
                    display: 'block',
                    mb: 1,
                  }}>
                    {stat.description}
                  </Typography>
                  
                  <Chip
                    label={stat.chainlinkFeature}
                    size="small"
                    sx={{
                      bgcolor: '#f0f9ff',
                      color: '#1a365d',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  />
                  
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Weather Monitoring & Quick Actions */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
          gap: 4,
          mb: 4,
          width: '100%',
        }}>
          {/* Weather Widget with Chainlink Integration */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 600,
                fontFamily: '"Manrope", "Inter", sans-serif',
                mb: 3,
              }}>
                <CloudQueue sx={{ mr: 1 }} />
                Weather Monitoring
                <Chip 
                  label="Chainlink Functions" 
                  size="small" 
                  sx={{ 
                    ml: 2, 
                    bgcolor: '#f0f9ff', 
                    color: '#1a365d',
                    fontSize: '0.7rem',
                  }} 
                />
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CloudQueue sx={{ fontSize: 64, color: '#1a365d', mb: 2 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: '#1a365d',
                  fontFamily: '"Manrope", "Inter", sans-serif',
                }}>
                  {weatherData?.current?.temperature || 28}°C
                </Typography>
                <Typography variant="body1" sx={{ color: '#4a5568' }}>
                  {weatherData?.current?.condition || 'Partly Cloudy'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Insurance Triggers:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="No rain 7+ days" size="small" color="warning" />
                  <Chip label="Rain >100mm/day" size="small" color="error" />
                </Box>
              </Box>

              <Alert severity="success" sx={{ fontSize: '0.8rem' }}>
                AccuWeather API monitored via Chainlink Functions every 6 hours
              </Alert>
            </CardContent>
          </Card>

          {/* Quick Actions with Chainlink Features */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 600,
                fontFamily: '"Manrope", "Inter", sans-serif',
                mb: 3,
              }}>
                <TrendingUp sx={{ mr: 1 }} />
                Blockchain Services
              </Typography>
              
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 3,
              }}>
                {quickActions.map((action, index) => (
                  <Box key={index}>
                    <Button
                      variant="outlined"
                      onClick={action.action}
                      sx={{ 
                        py: 3, 
                        px: 2,
                        flexDirection: 'column',
                        borderColor: '#e2e8f0',
                        color: '#1a365d',
                        width: '100%',
                        height: '120px',
                        '&:hover': {
                          borderColor: '#1a365d',
                          bgcolor: '#f7fafc',
                        },
                      }}
                    >
                      {React.cloneElement(action.icon, { sx: { mb: 1, fontSize: 28 } })}
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600, 
                        textAlign: 'center',
                        mb: 0.5,
                      }}>
                        {action.title}
                      </Typography>
                    </Button>
                    <Chip
                      label={action.chainlinkTech}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: '#f0f9ff',
                        color: '#1a365d',
                        fontSize: '0.7rem',
                        width: '100%',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity & Notifications */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 4,
          width: '100%',
        }}>
          {/* Recent Activity */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                fontFamily: '"Manrope", "Inter", sans-serif',
                mb: 3,
              }}>
                📈 Recent Activity
              </Typography>
              
              {activities && activities.length > 0 ? (
                <Box>
                  {activities.slice(0, 5).map((activity, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      py: 2,
                      borderBottom: index < 4 ? '1px solid #e2e8f0' : 'none',
                    }}>
                      <Avatar sx={{ bgcolor: '#f0f9ff', color: '#1a365d', mr: 2 }}>
                        {activity.type === 'Insurance' ? <Security /> : 
                         activity.type === 'Loan' ? <AccountBalance /> : 
                         activity.type === 'Carbon Credits' ? <Nature /> : <TrendingUp />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.date} • {activity.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={activity.status}
                        size="small"
                        color={activity.status === 'Completed' ? 'success' : 'warning'}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity. Start using AgriChain services to see your activity here.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card sx={{ border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                fontFamily: '"Manrope", "Inter", sans-serif',
                mb: 3,
              }}>
                🔔 Notifications
              </Typography>
              
              {notifications && notifications.length > 0 ? (
                <Box>
                  {notifications.slice(0, 5).map((notification, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      py: 2,
                      borderBottom: index < 4 ? '1px solid #e2e8f0' : 'none',
                    }}>
                      <Avatar sx={{ 
                        bgcolor: notification.type === 'warning' ? '#fef3c7' : '#dcfce7', 
                        color: notification.type === 'warning' ? '#92400e' : '#166534',
                        mr: 2,
                        mt: 0.5,
                      }}>
                        {notification.type === 'warning' ? <Warning /> : <CheckCircle />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {notification.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No new notifications
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
