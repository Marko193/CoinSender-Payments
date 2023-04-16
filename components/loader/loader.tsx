import { Stack, SxProps, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { ReactNode } from 'react';

interface LoaderProps {
  sx?: SxProps;
  children?: ReactNode;
}

export const LoaderComponent = ({ sx = { color: '#007994' }, children }: LoaderProps) => {
  return (
    <Stack justifyContent="center" alignItems="center" height="50vh" gap={3}>
      <CircularProgress sx={sx} />
      {children && children}
    </Stack>
  );
};
