// ----------------------------------------------------------------------

export default function Switch(theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#007994',
        },
        colorPrimary: {
          '&.Mui-checked': {
            color: '#007994',
          },
        },
        track: {
          opacity: 1,
          backgroundColor: '#f0f0f0',
          '.Mui-checked.Mui-checked + &': {
            opacity: 1,
            backgroundColor: '#f0f0f0',
          },
        },
      },
    },
  };
}
