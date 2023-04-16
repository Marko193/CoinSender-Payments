'use client';

import { ChangeEvent, FunctionComponent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import useSelectChain from '@/hooks/useSelectChain';
import useSyncChain from '@/hooks/useSyncChain';
import { TOKENS, TokensMap } from '@/constants/tokens';
import { isSupportedChain, SupportedChainId } from '@/constants/chains';
import { formatNetworks, ucFirst } from '@/helpers/stringUtils';

import {
  buildQuery,
  calculateCommissionFee,
  calculateDecimalsPlaces,
  getChainNameById,
  getHumanValue,
  getNonHumanValue,
  getNonHumanValueSumm,
  geTokensByChainId,
} from '@/utils';

import { isAddress } from '@ethersproject/address';

import { MULTISEND_DIFF_ETH, MULTISEND_DIFF_TOKEN, TOTAL_AMAOUNT_KEY } from '@/constants/queryKeys';
import { MULTI_SEND_CONTRACTS } from '@/constants/addresses';
import { useMultiSendContract } from '@/hooks/useContract';
import useTokenData from '@/hooks/useTokenData';
import { useMutation, useQuery } from 'react-query';
import { AlertComponent } from '../alert/alert';
import { updateConnectionError } from '@/state/connection/reducer';
import { getConnection } from '@/connection/utils';
import { ConnectionType } from '@/connection';
import { LoaderState, updateLoaderState } from '@/state/loader/reducer';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { useDebounceFunction } from '@/hooks/useDebounce';

const NETWORK_SELECTOR_CHAINS = [
  SupportedChainId.BSC,
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.CELO,
  SupportedChainId.AVALANCHE,
  SupportedChainId.GODWOKEN,
  SupportedChainId.FANTOM,
  SupportedChainId.GNOSIS,
  SupportedChainId.MOONBEAM,
  SupportedChainId.OASIS_EMERALD,
  SupportedChainId.OASIS_SAPPHIRE,
  SupportedChainId.FUSE,
  SupportedChainId.AURORA,
];

interface TransfersProps {
  title: string;
  transactionData: any;
  handleUploadModal: () => void;
  setTransactionSuccessMessage: () => void;
  setSelectedRow: any;
  successTransactionDate: () => void;
  loader: LoaderState;
  tableData: any;
}

export const SendTransferComponent: FunctionComponent<any> = ({
  title,
  handleUploadModal,
  transactionData,
  successTransactionDate,
  setSelectedRow,
  loader,
  tableData,
}: TransfersProps) => {
  const { chainId, provider, account, connector } = useWeb3React();
  const selectChain = useSelectChain();
  useSyncChain();
  const [tokens, setTokens] = useState<TokensMap[SupportedChainId] | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>('');
  const [transactionSuccessMessage, setTransactionSuccessMessage] = useState('');
  const [unsupportedAmounts, setUnsupportedAmounts] = useState<any>([]);
  const [networkInputValue, setNetworkInputValue] = useState('');

  const error = useAppSelector(({ connection }: any) => connection?.errorByConnectionType);
  const connectionType = getConnection(connector).type;

  const dispatch = useAppDispatch();
  const [isNativeToken, setIsNativeToken] = useState<boolean>(true);
  const [isNativeTokenSelected, setIsNativeTokenSelected] = useState<boolean>(false);
  const [addressType, setAddressType] = useState<boolean>(true);
  const [nativeTokenDecimals, setNativeTokenDecimals] = useState<number>(18);

  const setNetwork = async (targetChainId: SupportedChainId) => {
    await selectChain(targetChainId);
  };

  const someIsEdit = tableData && tableData?.some((item: any) => item?.isEdit || item?.isNew);

  const totalAmount =
    transactionData.amount.length > 0
      ? transactionData.amount
          .map((amount: string) => +amount)
          .reduce(function (a: number, b: number) {
            return a + b;
          })
      : 0;

  const totalAmountWithFee = totalAmount + (totalAmount / 100) * 0.1;

  const findCoinSymbol = (value: string) => {
    if (value && tokens) {
      const token = tokens.find(({ address }) => value === address);

      if (token) {
        setTokenSymbol(token?.symbol);
        return;
      }
    }
    return;
  };

  useEffect(() => {
    if (account && chainId) {
      if (!isSupportedChain(chainId)) {
        setTokens(null);
        dispatch(updateConnectionError({ connectionType, error: `Network not supported` }));
        return;
      }
      setTokens(geTokensByChainId(TOKENS, chainId));
    }
  }, [chainId, account]);

  useEffect(() => {
    if (tokens && tokens.length) {
      if (tokens[0].address === 'native') {
        setIsNativeToken(true);
        setIsNativeTokenSelected(true);
        setTokenAddress('');
      } else {
        setIsNativeTokenSelected(false);
        setTokenAddress(tokens[0].address);
        setIsNativeToken(false);
      }
      setTokenSymbol(tokens[0].symbol);
    }
  }, [tokens]);

  useEffect(() => {
    if (isSupportedChain(chainId) && !tokenAddress && tokens) {
      const currentToken = tokens.find((item) => item.address === 'native');

      if (currentToken?.decimals) {
        setNativeTokenDecimals(currentToken?.decimals);
      }
    }
  }, [chainId, tokens, tokenAddress]);

  const {
    approve,
    approveSigned,
    isAllowed,
    refetchAllowance,
    tokenDecimals,
    tokenBalance,
    isExist,
    tokenNameLoading,
    tokenSymbolLoading,
    tokenDecimalsLoading,
    tokenSymbol: tokenSymbolData,
  } = useTokenData(tokenAddress, MULTI_SEND_CONTRACTS);

  const {
    multiSendDiffToken: multiSendDiffTokenQuery,
    multiSendDiffEth: multiSendDiffEthQuery,
    calculateTotalAmountTaxes: calculateTotalAmountTaxesQuery,
    estimateGas: {
      multiSendDiffToken: multiSendDiffTokenEstimate,
      multiSendDiffEth: multiSendDiffEthEstimate,
    },
  } = useMultiSendContract();

  const amounts = useMemo(() => {
    return transactionData.amount.map((amount: number) =>
      getNonHumanValue(amount, isNativeToken ? nativeTokenDecimals : tokenDecimals).toString(),
    );
  }, [transactionData, isNativeToken, nativeTokenDecimals, tokenDecimals]);

  const { data: totalAmountTaxes, refetch: refetchTotalAmountTaxes } = useQuery(
    `${TOTAL_AMAOUNT_KEY}_${tokenAddress}_${account}`,
    (): Promise<any> =>
      buildQuery(calculateTotalAmountTaxesQuery, [transactionData.wallets, amounts]),
    {
      enabled: !!account && !!tokenAddress && !!transactionData.wallets.length,
      onError: (err: any) => {
        dispatch(updateConnectionError({ connectionType, error: 'User rejected transaction' }));
        console.log(err, `${TOTAL_AMAOUNT_KEY}_${tokenAddress}_${account}`);
      },
    },
  );

  const throttleTotalAmountQuery = useDebounceFunction(refetchTotalAmountTaxes, 500);

  useEffect(() => {
    if (transactionData && transactionData.wallets.length) {
      throttleTotalAmountQuery();
    } else {
      refetchTotalAmountTaxes();
    }
  }, [transactionData]);

  let totalSumm = '0';
  if (totalAmountTaxes && totalAmountTaxes.length) {
    totalSumm = getHumanValue(
      getNonHumanValueSumm(totalAmountTaxes).toString(),
      isNativeToken ? nativeTokenDecimals : tokenDecimals,
    ).toString();
  }

  const { mutateAsync: multiSendDiffEth } = useMutation(
    `${MULTISEND_DIFF_ETH}`,
    ({
      employeesWallets,
      employeesParsedAmounts,
      value,
      gasLimit,
    }: {
      employeesWallets: string[];
      employeesParsedAmounts: string[];
      value: string;
      gasLimit?: string;
    }): Promise<any> =>
      buildQuery(
        multiSendDiffEthQuery,
        [employeesWallets, employeesParsedAmounts],
        gasLimit || chainId === SupportedChainId.OASIS_SAPPHIRE ? null : multiSendDiffEthEstimate,
        gasLimit
          ? {
              value,
              gasLimit,
            }
          : {
              value,
            },
      ),
    {
      onError: (err) => console.log(err, `${MULTISEND_DIFF_ETH}`),
    },
  );

  const { mutateAsync: multiSendDiffToken } = useMutation(
    `${MULTISEND_DIFF_TOKEN}_${tokenAddress}`,
    ({
      employeesWallets,
      employeesParsedAmounts,
      gasLimit,
    }: {
      employeesWallets: string[];
      employeesParsedAmounts: string[];
      gasLimit?: string;
    }): Promise<any> =>
      buildQuery(
        multiSendDiffTokenQuery,
        [employeesWallets, employeesParsedAmounts, tokenAddress],
        gasLimit || chainId === SupportedChainId.OASIS_SAPPHIRE ? null : multiSendDiffTokenEstimate,
        gasLimit && { gasLimit },
      ),
    {
      onError: (err) => console.log(err, `${MULTISEND_DIFF_TOKEN}_${tokenAddress}`),
    },
  );

  const approveHandler = async () => {
    dispatch(updateLoaderState({ isLoading: true, text: 'Token approval' }));

    if (!account) {
      alert('wallet not connected');
      dispatch(updateLoaderState({ isLoading: false, text: '' }));
      return;
    }

    if (+tokenBalance.toString() === 0) {
      dispatch(updateLoaderState({ isLoading: false, text: '' }));
      dispatch(updateConnectionError({ connectionType, error: 'Insufficient funds' }));
      return;
    }

    try {
      dispatch(updateLoaderState({ isLoading: true, text: 'Token approval' }));

      if (chainId === SupportedChainId.OASIS_SAPPHIRE) {
        await approveSigned();
      } else {
        await approve();
      }

      refetchAllowance();
      dispatch(updateLoaderState({ isLoading: false, text: '' }));
      setSelectedRow([]);
    } catch (error) {
      console.log(`Token ${tokenAddress} approve error: `, error);
      dispatch(updateLoaderState({ isLoading: false, text: '' }));
      setSelectedRow([]);
    }
  };

  const sendTransfer = async () => {
    console.log('TRANSS', transactionData);
    if (!account) {
      alert('wallet not connected');
      return;
    }

    let receipt;

    dispatch(updateLoaderState({ isLoading: true, text: 'Transaction in progress' }));

    if (isNativeToken) {
      const employeesParsedAmounts = transactionData.amount.map((amount: number) =>
        getNonHumanValue(amount, nativeTokenDecimals).toString(),
      );

      const value = calculateCommissionFee(getNonHumanValueSumm(employeesParsedAmounts)).toString();

      if (provider) {
        const balance = (await provider.getBalance(account)).toString();

        if (+balance === 0 || +value > +balance) {
          dispatch(updateLoaderState({ isLoading: false, text: '' }));
          dispatch(updateConnectionError({ connectionType, error: 'Insufficient funds' }));
          return;
        }
      }

      console.log('data trans', transactionData.wallets, employeesParsedAmounts, value);

      const tx = await multiSendDiffEth({
        employeesWallets: transactionData.wallets,
        employeesParsedAmounts,
        value,
      });

      if (tx?.wait) {
        receipt = await tx.wait();
        if (receipt) {
          dispatch(updateLoaderState({ isLoading: false, text: '' }));
          setSelectedRow([]);
          setTransactionSuccessMessage('Transaction success');
        }

        if (provider) {
          const _ = (await provider.getBalance(account)).toString();
          successTransactionDate();
        }
      } else {
        dispatch(updateLoaderState({ isLoading: false, text: '' }));
        setSelectedRow([]);
        dispatch(updateConnectionError({ connectionType, error: tx.message }));
      }
    } else {
      const unsupportedAmounts = [];

      for (let i = 0; i < transactionData.amount.length; i++) {
        const amount = transactionData.amount[i];
        const wallet = transactionData.wallets[i];
        const isUnsupported = calculateDecimalsPlaces(String(amount), tokenDecimals);
        if (isUnsupported) {
          unsupportedAmounts.push({ wallet });
        }
      }

      if (unsupportedAmounts.length) {
        setUnsupportedAmounts(unsupportedAmounts);
        dispatch(updateLoaderState({ isLoading: false, text: '' }));
        return;
      }

      const employeesParsedAmounts = transactionData.amount.map((amount: number) =>
        getNonHumanValue(amount, tokenDecimals).toString(),
      );

      const amountsSumm = getNonHumanValueSumm(employeesParsedAmounts).toString();

      if (+tokenBalance.toString() === 0 || +amountsSumm > +tokenBalance.toString()) {
        dispatch(updateLoaderState({ isLoading: false, text: '' }));
        dispatch(updateConnectionError({ connectionType, error: 'Insufficient funds' }));
        return;
      }

      let tx = await multiSendDiffToken({
        employeesWallets: transactionData.wallets,
        employeesParsedAmounts,
      });

      if (tx?.wait) {
        receipt = await tx.wait();

        if (receipt) {
          dispatch(updateLoaderState({ isLoading: false, text: '' }));
          setSelectedRow([]);
          setTransactionSuccessMessage('Transaction success');
        }

        if (provider) {
          const _ = (await provider.getBalance(account)).toString();
          successTransactionDate();
        }
      } else {
        dispatch(updateLoaderState({ isLoading: false, text: '' }));
        setSelectedRow([]);
        dispatch(updateConnectionError({ connectionType, error: tx.message }));
      }
    }
  };

  const errorParsing = () => {
    const errors = [];
    if (error) {
      for (let key in error) {
        if (error[key]) {
          errors.push({ connectionType: key, value: error[key] });
        }
      }
      return errors;
    }
  };

  const errors = errorParsing();

  const handleCloseAlert = (connectionType: ConnectionType) => {
    if (!connector) return;
    dispatch(updateConnectionError({ connectionType, error: undefined }));
  };

  const handleSuccessAlert = () => {
    setTransactionSuccessMessage('');
  };

  const setTokenAddressHandler = (address: string) => {
    if (address === 'native') {
      setIsNativeToken(true);
      setIsNativeTokenSelected(true);
      setTokenAddress('');
    } else {
      setIsNativeTokenSelected(false);
      setTokenAddress(address);
      setIsNativeToken(false);
    }
  };

  useEffect(() => {
    if (!addressType && isAddress(tokenAddress)) {
      if (!isExist && !tokenNameLoading && !tokenSymbolLoading && !tokenDecimalsLoading) {
        setTokenAddress('');
        setCustomAddress('');
        dispatch(updateConnectionError({ connectionType, error: 'Not supported address' }));
      }
    }
  }, [
    isExist,
    addressType,
    tokenAddress,
    tokenNameLoading,
    tokenSymbolLoading,
    tokenDecimalsLoading,
  ]);

  const handleCustomAddress = async () => {
    if (isAddress(customAddress)) {
      setIsNativeTokenSelected(false);
      setTokenAddress(customAddress);
      setIsNativeToken(false);
    } else {
      dispatch(updateConnectionError({ connectionType, error: 'Not valid address' }));
    }
  };

  const checkedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('event?.target.checked', event?.target.checked);

    if (!event?.target.checked) {
      setIsNativeToken(false);
      setIsNativeTokenSelected(false);
    } else {
      if (tokens && tokens.length) {
        const token = tokens.find(({ address }) => 'native' === address);
        if (token && token.symbol) {
          setTokenSymbol(token?.symbol);
        }
      }
      setIsNativeToken(true);
      setIsNativeTokenSelected(true);
    }

    setTokenAddress('');
    setAddressType(event?.target.checked);
  };

  const unsupportedTransfers =
    unsupportedAmounts?.length > 0 && tableData?.length > 0
      ? unsupportedAmounts
          .map((item2: any) => tableData.find((item1: any) => item2.wallet === item1.wallet))
          .map((item: any) => item.id)
      : [];

  const getTokenSymbol = useMemo(() => {
    if (!addressType && !isNativeToken) {
      return tokenSymbolData ? tokenSymbolData : '';
    } else {
      return tokenSymbol;
    }
  }, [addressType, isNativeToken, tokenSymbolData, tokenSymbol]);

  const sortedNetworks = NETWORK_SELECTOR_CHAINS.map((chainId) => ({
    name: getChainNameById(chainId),
    chainId,
  }))
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .filter(({ name }) => name.includes(networkInputValue));

  const currentNetworkObj = sortedNetworks.find((item) => item.chainId === chainId);

  return (
    <Grid container mt={5}>
      {loader.isLoading && (
        <Stack sx={{ width: '100%' }} mb={3}>
          <AlertComponent icon={false} severity="info">
            <Stack direction="row" alignItems="center" gap={2}>
              <CircularProgress size="17px" />
              <Typography>{loader.text}</Typography>
            </Stack>
          </AlertComponent>
        </Stack>
      )}
      {errors &&
        errors?.length > 0 &&
        errors.map(({ connectionType, value }, index) => {
          return (
            <Stack key={index} mb={3} sx={{ width: '100%' }}>
              <AlertComponent
                onClose={() => handleCloseAlert(connectionType as ConnectionType)}
                severity="error"
              >
                {ucFirst(value)}
              </AlertComponent>
            </Stack>
          );
        })}
      {unsupportedTransfers && unsupportedTransfers?.length > 0 && (
        <Stack mb={3} sx={{ width: '100%' }}>
          <Alert onClose={() => setUnsupportedAmounts([])} severity="error">
            <>
              <Typography>This token doesn’t support this decimal.</Typography>
              <Typography>
                Please correct the amount in transfers with such id:{' '}
                {unsupportedTransfers.join(', ')}
              </Typography>
            </>
          </Alert>
        </Stack>
      )}
      {transactionSuccessMessage && (
        <Stack mb={3} sx={{ width: '100%' }}>
          <AlertComponent onClose={handleSuccessAlert} severity="success">
            {transactionSuccessMessage}
          </AlertComponent>
        </Stack>
      )}
      <Stack
        sx={{
          width: '100%',
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: '1fr 1fr 1fr ',
            md: '1fr 1fr 1fr 1fr 1fr 1fr',
          },
          gridTemplateRows: '1fr',
          gap: 2,
          gridTemplateAreas: {
            xs: addressType
              ? `"switch upload"
               "network make"
               "coins ."
               "total total"`
              : `"switch upload"
              "network make"
              "address load"
              "total total"`,
            sm: addressType
              ? `"upload network make"
                 "switch coins ."
                 "total total total"`
              : `"upload network make"
              "switch address load"
              "total total total"`,
            md: addressType
              ? `"upload switch network coins make . ."
              "total total total total total total total"`
              : `"upload switch network address address load make"
              "total total total total total total total"`,
          },
        }}
      >
        <Stack gridArea={'upload'}>
          <Button
            fullWidth
            onClick={handleUploadModal}
            variant="contained"
            disabled={loader.isLoading}
          >
            Upload
          </Button>
        </Stack>
        <Stack gridArea={'switch'}>
          <FormControlLabel
            sx={{ fontSize: { xs: '10px', md: '10px' } }}
            labelPlacement="top"
            control={
              <Switch
                size="small"
                checked={addressType}
                onChange={(event) => {
                  checkedHandler(event);
                  setUnsupportedAmounts([]);
                }}
              />
            }
            label={addressType ? 'Token list' : 'Custom token'}
          />
        </Stack>
        <Stack gridArea={'network'}>
          <FormControl fullWidth size="small">
            {!chainId ? (
              <Tooltip title="Please connect your wallet" placement="top">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  disableClearable
                  size="small"
                  disabled
                  options={sortedNetworks}
                  value={chainId && currentNetworkObj}
                  getOptionLabel={({ name }: any) => formatNetworks(name)}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.chainId === value.chainId
                  }
                  onChange={(e, value: any) => {
                    setNetwork(value?.chainId);
                    setUnsupportedAmounts([]);
                  }}
                  renderInput={(params) => <TextField {...params} label="Networks" />}
                />
              </Tooltip>
            ) : (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                disableClearable
                size="small"
                options={sortedNetworks}
                value={chainId && currentNetworkObj}
                getOptionLabel={({ name }: any) => formatNetworks(name)}
                isOptionEqualToValue={(option: any, value: any) => option.chainId === value.chainId}
                onChange={(e, value: any) => {
                  setNetwork(value?.chainId);
                  setUnsupportedAmounts([]);
                }}
                renderInput={(params) => <TextField {...params} label="Networks" />}
              />
            )}
          </FormControl>
        </Stack>
        {addressType ? (
          <>
            <Stack gridArea={'coins'}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label" style={{ color: 'rgba(0, 0, 0, 0.38)' }}>
                  Coins
                </InputLabel>

                {!chainId ? (
                  <Tooltip title="Please connect your wallet" placement="top">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Coins"
                      placeholder="Coins"
                      value={tokenAddress}
                      disabled={!isSupportedChain(chainId)}
                      onChange={(event) => {
                        setTokenAddress(event.target.value);
                        findCoinSymbol(event.target.value);
                      }}
                    >
                      {tokens?.map((token, i) => (
                        <MenuItem key={`token-${i}`} value={token.address}>
                          {token.symbol}
                        </MenuItem>
                      ))}
                    </Select>
                  </Tooltip>
                ) : (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Coins"
                    placeholder="Coins"
                    value={tokenAddress ? tokenAddress : 'native'}
                    disabled={!isSupportedChain(chainId) || !tokens || loader.isLoading}
                    onChange={(event) => {
                      setTokenAddressHandler(event.target.value);
                      findCoinSymbol(event.target.value);
                      setUnsupportedAmounts([]);
                    }}
                  >
                    {tokens?.map((token, i) => (
                      <MenuItem key={`token-${i}`} value={token.address}>
                        {token.symbol}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </Stack>
            <Stack gridArea={'make'}>
              <Button
                fullWidth
                variant="contained"
                disabled={
                  !(
                    (isSupportedChain(chainId) && tokenAddress) ||
                    (isSupportedChain(chainId) && isNativeTokenSelected)
                  ) ||
                  loader.isLoading ||
                  someIsEdit ||
                  ((isAllowed || isNativeToken) && !transactionData.wallets.length)
                    ? true
                    : false
                }
                onClick={isAllowed || isNativeToken ? sendTransfer : approveHandler}
              >
                {isAllowed || isNativeToken ? 'Make a transfer' : 'Approve token'}
              </Button>
            </Stack>
            {addressType && (
              <div style={{ width: '220px' }}>
                <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} textAlign="right">
                  Total amount with fee:{' '}
                  {transactionData.amount.length > 0
                    ? +totalAmountWithFee + ' ' + getTokenSymbol
                    : totalAmount + ' ' + getTokenSymbol}
                </Typography>
              </div>
            )}
          </>
        ) : (
          <>
            <Stack gridArea={'address'}>
              <FormControl fullWidth size="small">
                <TextField
                  label="Address"
                  size="small"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                />
              </FormControl>
            </Stack>
            <Stack gridArea={'load'}>
              <Button
                disabled={loader.isLoading || someIsEdit}
                fullWidth
                onClick={handleCustomAddress}
                variant="contained"
              >
                Load
              </Button>
            </Stack>

            <Stack gridArea={'make'}>
              <Button
                fullWidth
                variant="contained"
                disabled={
                  !(isSupportedChain(chainId) && tokenAddress) ||
                  loader.isLoading ||
                  someIsEdit ||
                  (isAllowed && !transactionData.wallets.length)
                    ? true
                    : false
                }
                onClick={isAllowed ? sendTransfer : approveHandler}
              >
                {isAllowed ? 'Make a transfer' : 'Approve token'}
              </Button>
            </Stack>
          </>
        )}
        {!addressType && (
          <Stack gridArea={'total'}>
            <Typography sx={{ fontSize: { xs: '14px', sm: '16px' } }} textAlign="right">
              Total amount with fee: {totalSumm + getTokenSymbol}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Grid>
  );
};
