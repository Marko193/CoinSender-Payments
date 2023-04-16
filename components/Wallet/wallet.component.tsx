'use client';

import { getConnection, getConnectionName } from '@/connection/utils';
import {
  coinbaseWalletConnection,
  injectedConnection,
  walletConnectConnection,
} from '@/connection';
import Image from 'next/image';
import { updateSelectedWallet } from '@/state/user/reducer';
import { updateConnectionError } from '@/state/connection/reducer';
import { useAppDispatch } from '@/state/hooks';
import { Button, Stack, Typography } from '@mui/material';

import MetamaskLogo from '@/assets/wallet-icons/metamask.svg';
import WalletConnectLogo from '@/assets/wallet-icons/wallet-connect.svg';
import CoinbaseLogo from '@/assets/wallet-icons/coinbase.svg';
import { useCallback } from 'react';
// import { isMobile } from 'utils/userAgent';

const Wallet = ({ handleClose }: any) => {
  const dispatch = useAppDispatch();

  function getOptions() {
    // if (isMobile) {
    //   return [walletConnectConnection, coinbaseWalletConnection];
    // }

    return [injectedConnection, walletConnectConnection, coinbaseWalletConnection];
  }

  const handleWalletConnection = useCallback(async (walletConnector: any) => {
    const connectionType = getConnection(walletConnector).type;

    try {
      dispatch(updateConnectionError({ connectionType, error: undefined }));
      await walletConnector.activate();
      dispatch(updateSelectedWallet({ wallet: connectionType }));

      handleClose();
    } catch (error: any) {
      console.debug(`web3-react connection error: ${error}`);
      dispatch(updateConnectionError({ connectionType, error: error.message }));
    }
  }, []);

  return (
    <div>
      <Stack gap={1} mb={3}>
        <Typography fontSize="24px" textAlign="center">
          Connect your wallet
        </Typography>
      </Stack>
      <Stack flexDirection="column" gap={2}>
        {getOptions().map((walletConnector, i) => {
          return (
            <Stack key={`wallet-button-${i}`}>
              <Button
                sx={{
                  display: {
                    xs:
                      getConnectionName(walletConnector.type) === 'MetaMask' ||
                      getConnectionName(walletConnector.type) === 'Browser Wallet'
                        ? 'none'
                        : 'flex',
                    md: 'flex',
                  },
                  justifyContent: 'start',
                  gap: 2,
                }}
                size="large"
                variant="outlined"
                onClick={() => handleWalletConnection(walletConnector.connector)}
              >
                {getConnectionName(walletConnector.type) === 'MetaMask' && (
                  <Image src={MetamaskLogo} alt="Metamask" />
                )}
                {getConnectionName(walletConnector.type) === 'WalletConnect' && (
                  <Image src={WalletConnectLogo} alt="Wallet Connect" />
                )}
                {getConnectionName(walletConnector.type) === 'Coinbase Wallet' && (
                  <Image src={CoinbaseLogo} alt="Wallet Connect" />
                )}
                Connect {getConnectionName(walletConnector.type)}
              </Button>
            </Stack>
          );
        })}
      </Stack>
    </div>
  );
};

export default Wallet;
