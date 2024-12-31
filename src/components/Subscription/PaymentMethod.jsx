import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Modal } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import JazzcashImg from '../../assets/images/user/Jazzcash.png';
import SadaPayImg from '../../assets/images/user/SadaPay.png';
import NayaPayImg from '../../assets/images/user/NayaPay.jpg';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 600,
    },
    body2: {
      color: '#555',
    }
  },
  shadows: ["none", "0px 4px 20px rgba(0, 0, 0, 0.1)"]
});

const InternetPricingComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      title: "Jazz Cash",
      description: "Follow instructions according to payment method",
      buttonText: "Pay now",
      imageUrl: JazzcashImg,
      phoneNumber: "03296181822", // JazzCash-specific phone number
      AccountTitle:"Jazz Cash"
    },
    {
      title: "Sada Pay",
      description: "Follow instructions according to payment method",
      buttonText: "Pay now",
      imageUrl: SadaPayImg,
      phoneNumber: "03296181822", // SadaPay-specific phone number
      AccountTitle:"Ibrahim Faisal"

    },
    {
      title: "Naya Pay",
      description: "Follow instructions according to payment method",
      buttonText: "Pay now",
      imageUrl: NayaPayImg,
      phoneNumber: "03296181822", // NayaPay-specific phone number
      AccountTitle:"Okiiee"

    }
  ];

  const handleShow = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4, bgcolor: '#f7f7f7', minHeight: '100vh' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" align="center">
         Note:- Send screenshot on WhatsApp "03296181822"
        </Typography>
        {/* <Typography variant="body1" color="text.secondary" paragraph align="center">
          Authorized payment options to ensure safe transactions
        </Typography> */}
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card raised sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[1] }}>
                <CardContent sx={{ p: 3 }}>
                  <img
                    src={plan.imageUrl}
                    alt={plan.title}
                    style={{ width: '100%', height: '200px',objectFit: 'contain', marginBottom: '16px', borderRadius: '8px' }}
                  />
                  <Typography variant="h6" component="h2" gutterBottom align="center">
                    {plan.title}
                  </Typography>
                  <Typography variant="body2" align="center" paragraph>
                    {plan.description}
                  </Typography>
                  <Button
                    onClick={() => handleShow(plan)}
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
      <Modal open={showModal} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: 'white',
            borderRadius: 2,
            width: 400,
            mx: 'auto',
            mt: '20vh',
            boxShadow: 24,
          }}
        >
          {selectedPlan && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedPlan.title} Payment Details
              </Typography>
              <Typography variant="body1" paragraph>
              <span style={{ fontWeight: 'bold' }}>ACCOUNT TITLE : </span>  {selectedPlan.AccountTitle}
              </Typography>
              <Typography variant="body1" paragraph>
              <span style={{ fontWeight: 'bold' }}>PAY UPON :  </span>  {selectedPlan.phoneNumber}
              </Typography>
              <Typography variant="body1" paragraph>
              <span style={{ fontWeight: 'bold' }}>NOTE :  </span>  Don't forget to share the screenshot on the same phone no. mentioned above.
              </Typography>
              <Button onClick={handleClose} variant="contained" color="primary" fullWidth>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default InternetPricingComponent;