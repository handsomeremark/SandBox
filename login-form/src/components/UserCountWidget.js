import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';

const UserCountWidget = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUserCount(response.data.length);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <Box
      height={150}
      width={150}
      my={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
      sx={{
        border: '2px solid grey', // Adjusted border style
        borderRadius: '8px',
        boxShadow: '0 5px 8px rgba(1, 1, 1, 0.1)',
        backgroundImage: 'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
        position: 'relative',
        color: 'white',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '16px',
          color: 'gray.400',
        }}
      >
        <FaUsers style={{ fontSize: '24px' }} />
      </Box>
      <Box sx={{ mt: 6, mb: 2 }}>
        Users: {userCount}
      </Box>
    </Box>
  );
};

export default UserCountWidget;
