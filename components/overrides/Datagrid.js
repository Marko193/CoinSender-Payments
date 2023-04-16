// ----------------------------------------------------------------------

export default function Datagrid(theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          userSelect: 'none',
        },
        columnHeader: {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        },
        cell: {
          cursor: 'pointer',
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        },
        row: {
          '&.Mui-selected': {
            background: '#00799414',
            '&:hover': {
              background: '#00799420',
            },
          },

          '&:hover': {
            background: '#00799414',
          },
        },
      },
    },
  };
}
