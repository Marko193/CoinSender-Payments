import 'normalize.css/normalize.css';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { Inter } from '@next/font/google';
import { Suspense, useMemo } from 'react';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import Web3Provider from '@/components/Web3Provider';
import { Provider } from 'react-redux';
import store from '@/state';

import componentsOverride from '@/components/overrides';
import { QueryClient, QueryClientProvider } from 'react-query';

const inter = Inter({
  weight: '400',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  const themeOptions = useMemo(
    () => ({
      pallete: {
        primary: {
          lighter: '#c6efff',
          light: '#a1ffff',
          dark: '#00acac',
          main: '#007994',
          darker: '#00f3f324',
          contrastText: '#0b1127',
        },
      },
      shape: { borderRadius: 8 },
    }),
    [],
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <main className={inter.className}>
                <Component {...pageProps} />
              </main>
            </ThemeProvider>
          </StyledEngineProvider>
        </Web3Provider>
      </QueryClientProvider>
    </Provider>
  );
}
