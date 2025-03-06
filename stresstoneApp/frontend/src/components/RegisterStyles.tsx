import { SxProps, Theme } from '@mui/material';

const RegisterStyles: Record<string, SxProps<Theme>> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    // backgroundColor: "#f3f4f6", // Equivalent to Tailwind's bg-gray-100
  },
  card: {
    width: '710px', // Fixed width
    height: '727px', // Fixed height
    padding: 3,
    backgroundColor: '#F5F5F5',
    fill: '50%',
    boxShadow: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centers the content vertically inside the card
    alignItems: 'center', // Centers the content horizontally inside the card
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 30,
  },
  textFieldContainer: {
    mt: 0.5, // Reduced margin-top to decrease the gap
    display: 'flex',
    justifyContent: 'center', // Centers the input fields horizontally
    width: '360px', // Ensures it takes up full width
  },

  registerButton: {
    display: 'inline-block',
    marginTop: '4px',
    width: '121px',
    padding: '6px 16px',
    opacity: '100%',
    color: '#1976D2',
    borderRadius: '4px',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '1px solid #000000',
    '&:hover': {
      opacity: '50%',
    },
    marginLeft: 'auto', // Push the button to the right
  },

  registerText: {
    textAlign: 'center',
    marginTop: 2,
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'flex', // Enable flexbox
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    height: '100%', // Ensure full height for centering
  },
};

export default RegisterStyles;
