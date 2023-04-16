import Head from 'next/head';

import { Card, Stack, Typography, Grid, Button, Divider, Chip, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Logo from '@/assets/Logo.svg';
import SignInLogo from '@/assets/sign-in/sign-in.svg';
import Image from 'next/image';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Home() {
  return (
    <>
      <Head>
        <title>Coinsender</title>
        <meta name="description" content="Make a paymets in crypto with Coinsender" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Grid container height="100vh" sx={{ background: 'rgba(34, 214,255,0.1)' }}>
        <Grid item xs={4} sx={{ display: { xs: 'none', md: 'flex' } }} position="relative">
          <Stack width="100%" position="absolute" top="20px">
            <Stack display="flex" width="100%" top="20px" zIndex="1000">
              <a href="https://coinsender.io/" style={{ textAlign: 'center', width: '100%' }}>
                <Image src={Logo} alt="Logo" height="75" />
              </a>
            </Stack>
          </Stack>
          <Stack mt={15} justifyContent="center" width="100%" position="relative">
            <Image src={SignInLogo} alt="Logo" fill style={{ left: '-50px' }} />
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ background: 'white', borderRadius: '25px 0 0 25px' }}
          justifyContent="center"
          px={3}
          height="100%"
        >
          <Stack mt="20px">
            <a href="https://coinsender.io/">
              <ArrowBackIcon sx={{ color: 'black' }} />
            </a>
          </Stack>
          <Stack
            maxWidth="390px"
            sx={{ margin: '0 auto' }}
            justifyContent="center"
            height="90vh"
            mt="-20px"
          >
            <Typography
              variant="h4"
              sx={{ fontSize: '24px', fontWeight: '700' }}
              gutterBottom
              mb={5}
              textAlign="center"
            >
              Welcome to CoinSender
            </Typography>
            <Stack width="100%">
              <Stack>
                <Link style={{ textDecoration: 'none' }} href="https://dapp.coinsender.io/">
                  <Button fullWidth variant="contained">
                    Go to decentralized application
                  </Button>
                </Link>
              </Stack>

              <Box>
                <Divider sx={{ my: 3 }}>
                  <Chip sx={{ width: '45px' }} label="or" />
                </Divider>
              </Box>
              <Stack gap={2}>
                <Stack sx={{ background: 'rgb(229, 246, 252)', p: 2, borderRadius: '8px' }}>
                  <Stack mb={2} alignItems="center" flexDirection="row" gap={2}>
                    <InfoIcon color="info" />
                    <Typography>This application is currently in progress.</Typography>
                  </Stack>
                  <Stack gap={2}>
                    <a href="https://app.coinsender.io/application/auth">
                      <Button fullWidth variant="contained">
                        Login to centralized application
                      </Button>
                    </a>
                    <a href="https://app.coinsender.io/application/auth/signup">
                      <Button fullWidth variant="contained">
                        Register in centralized application
                      </Button>
                    </a>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
