// ----------------------------------------------------------------------

export default function Table(theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 'none',
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgb(0, 172, 172)',
            color: 'white',
          },
          '&.Mui-selected': {
            background: '#007994',
            color: 'white',
            '&:hover': {
              color: 'white',
              background: 'rgb(0, 172, 172)',
            },
          },
        },
      },
    },
  };
}
