// ----------------------------------------------------------------------

export default function Checkbox(theme) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#007994',

          '&.Mui-checked': {
            color: '#007994',
          },
          '&.MuiCheckbox-indeterminate': {
            color: '#007994',
          },
        },
      },
    },
  };
}
