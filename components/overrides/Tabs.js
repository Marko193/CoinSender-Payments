// ----------------------------------------------------------------------

export default function Tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: theme.palette.primary.main,
        },
      },
    },
  };
}
