// ----------------------------------------------------------------------

export default function MuiFormControlLabel(theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: 14,
          marginLeft: 2,
        },
        root: {
          display: 'flex',
          flexDirection: 'row',
          marginLeft: 0,
          gap: 3,
        },
      },
    },
  };
}
