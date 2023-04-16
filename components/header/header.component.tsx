import { useRouter } from 'next/router';
import styles from '@/components/header/header.module.scss';
import Logo from '@/assets/Logo.svg';
import Image from 'next/image';
import {
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import CustomPopover from '../popover/popover';
import { updateSelectedWallet } from '@/state/user/reducer';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '@/state/hooks';
import { formatNetworks, makeShortenWalletAddress } from '@/helpers/stringUtils';
import { getChainNameById, getHumanValue } from '@/utils';
import useSyncChain from '@/hooks/useSyncChain';
import { ModalWindow } from '../modal/modal';
import dynamic from 'next/dynamic';
import { isSupportedChain } from '@/constants/chains';
import { useSelector } from 'react-redux';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Link from 'next/link';

// @ts-ignore
const Wallet = dynamic(() => import('@/components/Wallet/wallet.component'), { ssr: false });

export const Header = () => {
  const [menuItem, setMenuItem] = useState('CoinSender');

  const router: any = useRouter();
  useSyncChain();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const isLoading = useSelector(({ loader: { isLoading } }: any) => isLoading);

  const { connector, account, chainId, provider } = useWeb3React();
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!account) {
        handleWalletModal();
        setAnchorEl(null);
        return;
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [account]);

  useEffect(() => {
    // FIXME: PLEASE DON"T TOUCH :D
    async function fetchBalance() {
      if (provider && account && isSupportedChain(chainId)) {
        const bal = (await provider.getBalance(account)).toString();

        setBalance(bal);
      }
    }

    if (chainId === undefined) {
      setBalance('0');
    } else {
      fetchBalance();
    }
  }, [chainId, account, provider, connector]);

  const disconnectHandler = useCallback(async () => {
    if (connector.deactivate) {
      await connector.deactivate();
    }
    connector.resetState();
    dispatch(updateSelectedWallet({ wallet: undefined }));
  }, []);

  const handleWalletModal = useCallback(() => {
    setOpenWalletModal((prev) => !prev);
  }, []);

  const changeMenuItem = (event: SelectChangeEvent) => {
    setMenuItem(event.target.value as string);
    switch (event.target.value) {
      case 'CoinSender':
        router.push('/');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerItems}>
          <div className="logo">
            <div>
              <Image src={Logo} alt="Logo" />
            </div>
          </div>

          <div className={styles.mobile_wrapper}>
            <div className={styles.items_list}>
              <div className={styles.item_block}>
                <div className={styles.coming_soon_label}>Coming soon</div>
                <span className={styles.coming_soon_tab}>Dashboard</span>
              </div>
              <div className={styles.item_block_active}>
                <div className={styles.coming_soon_label} style={{ opacity: 0 }}>
                  Coming soon
                </div>
                <FormControl size="small">
                  <Select
                    className={styles.select}
                    value={menuItem}
                    onChange={changeMenuItem}
                    sx={{
                      borderRadius: 0,
                      fontFamily: '__Inter_01180f, __Inter_Fallback_01180f',
                      fontWeight: 400,
                      fontStyle: 'normal',

                      '&:hover': {
                        fontWeight: 'bold',
                      },

                      '& .MuiOutlinedInput': {
                        fontSize: '16px',
                      },

                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '0 !important',
                      },
                      '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                      },
                    }}
                  >
                    <MenuItem className={styles.menu_item} value="CoinSender">
                      <Link
                        href="/"
                        style={{ color: 'black', fontWeight: router.pathname == '/' ? 1000 : 400 }}
                      >
                        CoinSender
                      </Link>
                    </MenuItem>
                    <MenuItem className={styles.menu_item} value="CoinSender NFT" disabled>
                      CoinSender NFT
                    </MenuItem>
                    <MenuItem className={styles.menu_item} value="CoinSender Claim" disabled>
                      CoinSender Claim
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className={styles.item_block}>
                <Link href="/swap" style={{ color: 'black', paddingTop: '10px' }}>
                  Swap
                </Link>
              </div>

              {/*<div className={styles.item_block} style={{ alignItems: 'start' }}>*/}
              {/*  <div*/}
              {/*    id={styles.not_using_label}*/}
              {/*    className={styles.coming_soon_label}*/}
              {/*    style={{ opacity: 0 }}*/}
              {/*  >*/}
              {/*    Coming soon*/}
              {/*  </div>*/}
              {/*  <span className={styles.active_tab} style={{*/}
              {/*    fontWeight: router.pathname == '/swap' ? 1000 : 400,*/}
              {/*    // color: router.pathname == '/swap' ? 'red' : 'blue',*/}
              {/*  }} onClick={() => router.push('/swap')}>*/}
              {/*    Swap*/}
              {/*  </span>*/}
              {/*</div>*/}
              <div className={styles.item_block}>
                <div className={styles.coming_soon_label}>Coming soon</div>
                <span className={styles.coming_soon_tab}>Bridges</span>
              </div>
            </div>
            <div className={styles.wallet}>
              {!account ? (
                <Button
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    fontSize: { xs: '8px', md: '12px' },
                    padding: { xs: '6px', md: '6px 16px' },
                  }}
                  onClick={handleWalletModal}
                >
                  Connect wallet
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleClick}
                    disabled={isLoading}
                    sx={{
                      fontSize: { xs: '8px', md: '12px' },
                      padding: { xs: '6px', md: '6px 16px' },
                    }}
                  >
                    {makeShortenWalletAddress(account)}
                  </Button>
                  <CustomPopover anchorEl={anchorEl} handleClose={handleClose}>
                    <Stack gap={1}>
                      <Stack>
                        Network:{' '}
                        {chainId &&
                          isSupportedChain(chainId) &&
                          formatNetworks(getChainNameById(chainId))}
                      </Stack>
                      <Divider />
                      <Stack>Wallet Address: {makeShortenWalletAddress(account)}</Stack>
                      <Divider />
                      <Stack>Balance: {balance ? getHumanValue(balance).toString() : 0}</Stack>
                      <Stack>
                        <Button onClick={() => disconnectHandler()}>Disconnect</Button>
                      </Stack>
                    </Stack>
                  </CustomPopover>
                </>
              )}

              <a href="https://coinsender.io/" style={{ display: 'flex', alignItems: 'center' }}>
                <ExitToAppIcon sx={{ color: 'black' }} className={styles.exit_icon} />
              </a>
            </div>
          </div>
        </div>
        <ModalWindow open={openWalletModal} handleClose={handleWalletModal}>
          <Wallet handleClose={handleWalletModal} />
        </ModalWindow>
      </div>
    </>
  );
};
