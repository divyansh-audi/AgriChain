//updated code to include button to check weather through the API
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { Web3Provider } from './context/Web3Context';
import { AppProvider } from './context/AppContext';

// Common UI Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Insurance from './pages/Insurance';
import Lending from './pages/Lending';
import CarbonCredits from './pages/CarbonCredits';
import Profile from './pages/Profile';
import Registration from './pages/Registration';

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
      light: '#2d3748',
      dark: '#0f1419',
    },
    secondary: {
      main: '#4a5568',
      light: '#718096',
      dark: '#2d3748',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a365d',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': [
          'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap")'
        ],
        html: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        body: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        '*': {
          fontFamily: 'inherit',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Inter", "Roboto", sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
  },
});

function App() {
  // Load fonts manually on first mount
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    link.onload = () => {
      document.body.style.fontFamily =
        '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';
    };

    if (!document.head.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <AppProvider>
          <Router>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                fontFamily:
                  '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              <Header />
              <main
                style={{
                  flex: 1,
                  fontFamily: 'inherit',
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/lending" element={<Lending />} />
                  <Route path="/carbon" element={<CarbonCredits />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/register" element={<Registration />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;





/*import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Web3Provider } from './context/Web3Context';
import { AppProvider } from './context/AppContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Insurance from './pages/Insurance';
import Lending from './pages/Lending';
import CarbonCredits from './pages/CarbonCredits';
import Profile from './pages/Profile';
import Registration from './pages/Registration';

// Enhanced theme with proper font loading
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
      light: '#2d3748',
      dark: '#0f1419',
    },
    secondary: {
      main: '#4a5568',
      light: '#718096',
      dark: '#2d3748',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a365d',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': [
          'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap")'
        ],
        html: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        body: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        '*': {
          fontFamily: 'inherit',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Inter", "Roboto", sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
  },
});

function App() {
  // Ensure fonts are loaded before rendering
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    link.onload = () => {
      // Force re-render after fonts load
      document.body.style.fontFamily = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';
    };
    
    if (!document.head.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <AppProvider>
          <Router>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            }}>
              <Header />
              <main style={{ 
                flex: 1,
                fontFamily: 'inherit',
              }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/lending" element={<Lending />} />
                  <Route path="/carbon" element={<CarbonCredits />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/register" element={<Registration />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
