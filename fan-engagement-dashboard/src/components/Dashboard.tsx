import React from 'react';
import { 
  Box, 
  Paper, 
  Container, 
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes
} from '@mui/material';

const mdTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
    },
  })
);

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Container maxWidth="xl">
          <Paper elevation={3}>
            {children}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;