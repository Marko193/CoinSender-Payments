// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',

          fontSize: '12px',
          background: '#007994',
          color: 'white',
          '&:hover': {
            boxShadow: 'none',
            background: 'rgb(0, 172, 172)',
          },
        },

        sizeLarge: {
          height: 48,
        },
        containedInherit: {
          color: theme.palette.grey[800],
          // boxShadow: theme.customShadows.z8,
          '&:hover': {
            backgroundColor: theme.palette.grey[400],
          },
        },
        containedPrimary: {
          // boxShadow: theme.customShadows.primary,
        },
        containedSecondary: {
          // boxShadow: theme.customShadows.secondary,
        },
        outlinedInherit: {
          border: `1px solid ${theme.palette.grey[500_32]}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        outlined: {
          background: 'white',
          color: 'black',
          border: '1px solid #007994',
          '&:hover': {
            backgroundColor: '#007994',
            border: `1px solid #007994`,
            color: 'white',
          },
        },
        textInherit: {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
