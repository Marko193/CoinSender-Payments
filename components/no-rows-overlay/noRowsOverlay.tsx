import { Stack } from '@mui/material';

interface ComponentProps {
  title: string;
}

export const NoRowsOverlayComponent = ({ title }: ComponentProps) => {
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      {title}
    </Stack>
  );
};
