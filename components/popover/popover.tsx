import { ReactNode } from 'react';
import Popover from '@mui/material/Popover';
import { alpha, styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const ArrowStyle = styled('span')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    top: -7,
    zIndex: 1,
    width: 12,
    right: 20,
    height: 12,
    content: "''",
    position: 'absolute',
    borderRadius: '0 0 4px 0',
    transform: 'rotate(-135deg)',
    background: theme.palette.background.paper,
    borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
  },
}));

interface PopoverProps {
  children: ReactNode;
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
}

export default function CustomPopover({ children, anchorEl, handleClose, ...other }: PopoverProps) {
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Popover
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorEl={anchorEl}
      id={id}
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          mt: 1.5,
          ml: 0.5,
          overflow: 'inherit',
          padding: 3,
        },
      }}
      {...other}
    >
      <ArrowStyle className="arrow" />
      <Stack>{children}</Stack>
    </Popover>
  );
}
