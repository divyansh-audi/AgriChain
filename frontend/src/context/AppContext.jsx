import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3 } from './Web3Context';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { account, connected } = useWeb3();
  
  const [farmerData, setFarmerData] = useState({
    name: '',
    location: '',
    farmSize: '',
    cropType: '',
    farmingMethod: '',
    yearsOfExperience: '',
    email: '',
    phone: '',
    kycStatus: 'Pending',
    nftCreated: false,
    registrationDate: null,
    cropImage: null,
    profileImage: null,
    joinDate: new Date().toISOString(),
  });

  const [stats, setStats] = useState({
    carbonCredits: 0,
    activeLoans: 0,
    insurancePolicies: 0,
    totalValue: 0,
    creditScore: 650,
  });

  const [weatherData, setWeatherData] = useState({
    current: {
      temperature: 28,
      humidity: 65,
      condition: 'Partly Cloudy',
      windSpeed: 12,
    },
    forecast: [
      { day: 'Today', high: 32, low: 24, condition: 'Sunny', rain: 0 },
      { day: 'Tomorrow', high: 30, low: 22, condition: 'Cloudy', rain: 20 },
      { day: 'Day 3', high: 28, low: 20, condition: 'Rainy', rain: 80 },
    ],
  });

  const [activities, setActivities] = useState([]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to AgriChain',
      message: 'Complete your registration to access all features',
      type: 'info',
      read: false,
      timestamp: new Date(),
    },
  ]);

  // Load farmer data from localStorage when account changes
  useEffect(() => {
    if (account && connected) {
      const savedData = localStorage.getItem(`farmerData_${account}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFarmerData(prev => ({ ...prev, ...parsedData }));
        
        // Update stats for registered farmers
        if (parsedData.nftCreated) {
          setStats({
            carbonCredits: 150,
            activeLoans: 2,
            insurancePolicies: 3,
            totalValue: 12500,
            creditScore: 750,
          });
          
          setActivities([
            {
              id: 1,
              type: 'Registration',
              description: 'Farmer NFT created successfully',
              amount: 0,
              status: 'Completed',
              date: parsedData.registrationDate || new Date().toISOString().split('T')[0],
            },
          ]);
        }
      }
    }
  }, [account, connected]);

  const updateFarmerData = (newData) => {
    const updatedData = { ...farmerData, ...newData };
    setFarmerData(updatedData);
    
    // Save to localStorage
    if (account) {
      localStorage.setItem(`farmerData_${account}`, JSON.stringify(updatedData));
    }
  };

  const completeFarmerRegistration = (registrationData) => {
    const completeData = {
      ...farmerData,
      ...registrationData,
      nftCreated: true,
      registrationDate: new Date().toISOString(),
      kycStatus: 'Verified',
    };
    
    setFarmerData(completeData);
    
    // Save to localStorage
    if (account) {
      localStorage.setItem(`farmerData_${account}`, JSON.stringify(completeData));
    }
    
    // Update stats for new farmer
    setStats({
      carbonCredits: 50,
      activeLoans: 0,
      insurancePolicies: 1,
      totalValue: 2500,
      creditScore: 700,
    });
    
    // Add registration activity
    addActivity({
      type: 'Registration',
      description: 'Farmer NFT created successfully',
      amount: 0,
      status: 'Completed',
    });
    
    // Add welcome notification
    addNotification({
      title: 'Registration Complete!',
      message: 'Your Farmer NFT has been created. Welcome to AgriChain!',
      type: 'success',
    });
  };

  const updateStats = (newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const isRegistered = () => {
    return connected && farmerData.nftCreated;
  };

  const value = {
    farmerData,
    stats,
    weatherData,
    activities,
    notifications,
    updateFarmerData,
    completeFarmerRegistration,
    updateStats,
    addActivity,
    markNotificationAsRead,
    addNotification,
    isRegistered,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
