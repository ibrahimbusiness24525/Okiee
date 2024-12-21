import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Chip, ThemeProvider, createTheme } from '@mui/material';
import JazzcashImg from '../../assets/images/user/Jazzcash.png';
import EasypaisaImg from '../../assets/images/user/easy paisa.png';
import BankImg from '../../assets/images/user/Bank.png';
import PaymentModal from '../../Modals/PaymentModal';  

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 600, // Bold font for card titles
    },
    body2: {
      color: '#555', // Lighter text color for descriptions
    }
  },
  shadows: ["none", "0px 4px 20px rgba(0, 0, 0, 0.1)"] // Softer shadow for the card
});

const InternetPricingComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    description: '',
    paymentDetails: ''
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    setShowModal(false);
  };

  const plans = [
    {
      title: "Jazz Cash",
      description: "Follow instructions according to payment method",
      buttonText: "Pay now",
      imageUrl: JazzcashImg
    },
    {
      title: "Easy Paisa",
      description: "Follow instructions according to payment method",
      buttonText: "Pay now",
      imageUrl: EasypaisaImg
    },
    {
      title: "Bank Account",
      description: "Follow instructions according to payment method",
      buttonText: "Pay now",
      imageUrl: BankImg
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4, bgcolor: '#f7f7f7', minHeight: '100vh' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" align="center">
          Mostly Used Payment Options
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph align="center">
          Authorized payment options to ensure safe transactions
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card raised sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[1] }}>
                <CardContent sx={{ p: 3 }}>
                  <img
                    src={plan.imageUrl}
                    alt={plan.title}
                    style={{ width: '100%', height: 'auto', marginBottom: '16px', borderRadius: '8px' }}
                  />
                  <Typography variant="h6" component="h2" gutterBottom align="center">
                    {plan.title}
                  </Typography>
                  <Typography variant="body2" align="center" paragraph>
                    {plan.description}
                  </Typography>
                  <Button 
                    onClick={handleShow} 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ fontWeight: 'bold', padding: '10px 0' }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Payment Modal */}
      <PaymentModal
        showModal={showModal}
        data={formData}
        handleChange={handleChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </ThemeProvider>
  );
};

export default InternetPricingComponent;
