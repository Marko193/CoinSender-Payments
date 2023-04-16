import { FunctionComponent, ReactNode } from 'react';
import { Header } from '@/components/header/header.component';
import { Container } from '@mui/material';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FunctionComponent<MainLayoutProps> = ({ children }) => {

  return (
    <div>
      <Header />
      <Container>{children} </Container>
    </div>
  );
};
