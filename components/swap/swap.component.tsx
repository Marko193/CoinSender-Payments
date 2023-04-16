import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './swap.module.scss';
import { Autocomplete, Button, FormControl, Stack, TextField, Tooltip } from '@mui/material';
import SouthIcon from '@mui/icons-material/South';
import { SUSHI_PAIRS_QUERY_GQL, SUSHI_TOKENS_QUERY_GQL } from '@/subgraph/index';
import {
  FEE_PERCENTAGE_KEY,
  SUSHI_PAIRS_KEY,
  SUSHI_TOKENS_KEY,
  SWAP_ETH_TO_TOKEN_KEY,
  SWAP_TOKEN_TO_ETH_KEY,
  SWAP_TOKEN_TO_TOKEN_KEY,
} from '@/constants/queryKeys';
import { useReactQuerySushiGQL } from '@/hooks/useReactQueryGQL';
import { useSushiV2FactoryContract, useSwapContract } from '@/hooks/useContract';
import {
  buildQuery,
  getChainNameById,
  getCommissionFee,
  getHumanValue,
  getNonHumanValue,
  removeArrayDuplicates,
  subBigNumber,
} from '@/utils/index';
import moment from 'moment';
import { useWeb3React } from '@web3-react/core';
import { SerializedToken } from '@/types/tokens';
import { useMutation, useQuery } from 'react-query';
import { isSupportedChain, SupportedChainId } from '@/constants/chains';
import useTokenData from '@/hooks/useTokenData';
import { SWAP_CONTRACTS, WRAPPED_NATIVE_CURRENCY } from '@/constants/addresses';
import { useDebounceFunction } from '@/hooks/useDebounce';
import { ZERO_ADDRESS } from '@/constants/tokens';
import { TokenInput } from '../tokenInput/token-component';
import useSelectChain from '@/hooks/useSelectChain';
import useSyncChain from '@/hooks/useSyncChain';
import { formatNetworks } from '@/helpers/stringUtils';

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

export default function SwapTokensComponent() {
  const [firstTokenValue, setFirstTokenValue] = useState<number | string>('');
  const [secondTokenValue, setSecondTokenValue] = useState<number | string>('');
  const [balance, setBalance] = useState<string>('0');
  const [allTokens, setAllTokens] = useState<SerializedToken[]>([]);
  const [token1, setToken1] = useState<any | null>(null);
  const [token2, setToken2] = useState<any | null>(null);
  const [tokenAddr1, setTokenAddr1] = useState<string>('');
  const [tokenAddr2, setTokenAddr2] = useState<string>('');
  const [pairs, setPairs] = useState<any[]>([]);
  const [isSecondActive, setIsSecondActive] = useState<boolean>(false);

  const { chainId, account, provider } = useWeb3React();
  const selectChain = useSelectChain();
  useSyncChain();

  const setNetwork = async (targetChainId: SupportedChainId) => {
    await selectChain(targetChainId);
  };

  const {
    approve: approveToken1,
    approveSigned: approveSignedToken1,
    isAllowed: isAllowedToken1,
    refetchAllowance: refetchAllowanceToken1,
    tokenDecimals: tokenDecimalsToken1,
    tokenBalance: tokenBalanceToken1,
    tokenNameLoading,
    tokenSymbolLoading,
    tokenDecimalsLoading,
    tokenSymbol: tokenSymbolDataToken1,
  } = useTokenData(token1 && token1.id ? token1.id : '', SWAP_CONTRACTS);

  const {
    approve: approveToken2,
    approveSigned: approveSignedToken2,
    isAllowed: isAllowedToken2,
    refetchAllowance: refetchAllowanceToken2,
    tokenDecimals: tokenDecimalsToken2,
    tokenBalance: tokenBalanceToken2,
    tokenNameLoading: tokenNameLoadingToken2,
    tokenSymbolLoading: tokenSymbolLoadingToken2,
    tokenDecimalsLoading: tokenDecimalsLoadingToken2,
    tokenSymbol: tokenSymbolDataToken2,
  } = useTokenData(token2 && token2.id ? token2.id : '', SWAP_CONTRACTS);

  const {
    swapETHForTokens: swapETHForTokensQuery,
    swapTokenToToken: swapTokenToTokenQuery,
    swapTokensForETH: swapTokensForETHQuery,
    owner: ownerQuery,
    getAmountsOut: getAmountsOutQuery,
    getAmountsIn: getAmountsInQuery,
    feePercentage: feePercentageQuery,
    estimateGas: {
      swapETHForTokens: swapETHForTokensEstimate,
      swapTokenToToken: swapTokenToTokenEstimate,
      swapTokensForETH: swapTokensForETHEstimate,
    },
  } = useSwapContract();

  const { getPair: getPairQuery } = useSushiV2FactoryContract();

  const isNativeToken1 = useMemo(() => {
    if (token1 && !token1.id.length) return true;
    else return false;
  }, [token1]);

  const isNativeToken2 = useMemo(() => {
    if (token2 && !token2.id.length) return true;
    else return false;
  }, [token2]);

  useEffect(() => {
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
  }, [chainId, account, provider]);

  const { data: feePercentage, refetch: refetchFeePercentage } = useQuery(
    `${FEE_PERCENTAGE_KEY}`,
    (): Promise<any> => buildQuery(feePercentageQuery, []),
    {
      enabled: true,
      onError: (err: any) => {
        console.log(err, `${FEE_PERCENTAGE_KEY}`);
      },
    },
  );

  const { mutateAsync: swapETHToToken } = useMutation(
    `${SWAP_ETH_TO_TOKEN_KEY}`,
    ({
      _amountOutMin,
      _path,
      _to,
      _deadline,
      value,
    }: {
      _amountOutMin: string;
      _path: string[];
      _to: string;
      _deadline: string;
      value: string;
    }): Promise<any> =>
      buildQuery(
        swapETHForTokensQuery,
        [_amountOutMin, _path, _to, _deadline],
        chainId === SupportedChainId.OASIS_SAPPHIRE ? null : swapETHForTokensEstimate,
        { value },
      ),
    {
      onError: (err) => console.log(err, `${SWAP_ETH_TO_TOKEN_KEY}`),
    },
  );

  const { mutateAsync: swapTokenToETH } = useMutation(
    `${SWAP_TOKEN_TO_ETH_KEY}`,
    ({
      _amountIn,
      _amountOutMin,
      _path,
      _to,
      _deadline,
    }: {
      _amountIn: string;
      _amountOutMin: string;
      _path: string[];
      _to: string;
      _deadline: string;
    }): Promise<any> =>
      buildQuery(
        swapTokensForETHQuery,
        [_amountIn, _amountOutMin, _path, _to, _deadline],
        chainId === SupportedChainId.OASIS_SAPPHIRE ? null : swapTokensForETHEstimate,
      ),
    {
      onError: (err) => console.log(err, `${SWAP_TOKEN_TO_ETH_KEY}`),
    },
  );

  const { mutateAsync: swapTokenToToken } = useMutation(
    `${SWAP_TOKEN_TO_TOKEN_KEY}`,
    ({
      _amountIn,
      _amountOutMin,
      _path,
      _to,
      _deadline,
    }: {
      _amountIn: string;
      _amountOutMin: string;
      _path: string[];
      _to: string;
      _deadline: string;
    }): Promise<any> =>
      buildQuery(
        swapTokenToTokenQuery,
        [_amountIn, _amountOutMin, _path, _to, _deadline],
        chainId === SupportedChainId.OASIS_SAPPHIRE ? null : swapTokenToTokenEstimate,
      ),
    {
      onError: (err) => console.log(err, `${SWAP_TOKEN_TO_TOKEN_KEY}`),
    },
  );

  const { data: sushiPairs, isLoading: sushiPairsLoading } = useReactQuerySushiGQL(
    SUSHI_PAIRS_QUERY_GQL,
    SUSHI_PAIRS_KEY,
  );

  const { data: sushiTokens, isLoading: sushiTokensLoading } = useReactQuerySushiGQL(
    SUSHI_TOKENS_QUERY_GQL,
    SUSHI_TOKENS_KEY,
  );

  if (
    sushiTokens &&
    //@ts-ignore
    Array.isArray(sushiTokens.tokens) &&
    //@ts-ignore
    sushiTokens.tokens.length &&
    token1 === null &&
    token2 === null
  ) {
    //@ts-ignore
    const isNativeExist = sushiTokens.tokens.some((item) => item.id === '');
    if (!isNativeExist) {
      //@ts-ignore
      sushiTokens.tokens.unshift({
        decimals: '18',
        id: '',
        name: 'MATIC',
        symbol: 'MATIC',
      });
    }
    //@ts-ignore
    const newTokensArr = removeArrayDuplicates(sushiTokens.tokens, 'symbol').filter(
      (item) => item.symbol !== 'WMATIC',
    );

    setAllTokens(newTokensArr);
    setToken1(newTokensArr[0]);
    setTokenAddr1(newTokensArr[0].id);
    setToken2(newTokensArr[1]);
    setTokenAddr2(newTokensArr[1].id);
  }

  if (
    sushiPairs &&
    //@ts-ignore
    Array.isArray(sushiPairs.pairs) &&
    //@ts-ignore
    sushiPairs.pairs.length &&
    token1 === null &&
    token2 === null
  ) {
    //@ts-ignore
    setPairs(sushiPairs.pairs);
  }

  const token1Address = useMemo(() => {
    return isNativeToken1 && chainId ? WRAPPED_NATIVE_CURRENCY[chainId] : tokenAddr1;
  }, [isNativeToken1, chainId, token1, tokenAddr1]);
  const token2Address = useMemo(() => {
    return isNativeToken2 && chainId ? WRAPPED_NATIVE_CURRENCY[chainId] : tokenAddr2;
  }, [isNativeToken1, chainId, token1, tokenAddr2]);

  const getSwapPath = async (addr1: string, addr2: string) => {
    if (chainId) {
      const isExist = await getPairQuery(addr1, addr2);

      if (isExist !== ZERO_ADDRESS) return [addr1, addr2];
      else {
        if (
          addr1 !== WRAPPED_NATIVE_CURRENCY[chainId] &&
          addr2 !== WRAPPED_NATIVE_CURRENCY[chainId]
        ) {
          const isExistEth = await getPairQuery(WRAPPED_NATIVE_CURRENCY[chainId], addr2);
          if (isExistEth !== ZERO_ADDRESS) {
            return [addr1, WRAPPED_NATIVE_CURRENCY[chainId], addr2];
          }
        } else {
          const notEth = [addr1, addr2].find(
            (item: string) => item !== WRAPPED_NATIVE_CURRENCY[chainId],
          );

          const existingPair = pairs.find(
            (item: any) => item.token0.id === notEth || item.token1.id === notEth,
          );

          const addressInPair =
            existingPair && existingPair.token0.id !== WRAPPED_NATIVE_CURRENCY[chainId]
              ? existingPair.token0.id
              : existingPair && existingPair.token1.id !== WRAPPED_NATIVE_CURRENCY[chainId]
              ? existingPair.token1.id
              : '';

          const isCustomPathExistEth = await getPairQuery(
            WRAPPED_NATIVE_CURRENCY[chainId],
            addressInPair,
          );

          const isCustomPathExist = await getPairQuery(addressInPair, notEth);

          if (isCustomPathExistEth !== ZERO_ADDRESS && isCustomPathExist !== ZERO_ADDRESS) {
            return [WRAPPED_NATIVE_CURRENCY[chainId], addressInPair, notEth];
          } else {
            return null;
          }
        }
      }
    } else return null;
  };

  const approveHandler = async () => {
    if (!account) {
      alert('wallet not connected');
      return;
    }

    if (+tokenBalanceToken1.toString() === 0) {
      alert('Insufficient funds');
      return;
    }

    try {
      if (chainId === SupportedChainId.OASIS_SAPPHIRE) {
        await approveSignedToken1();
      } else {
        await approveToken1();
      }

      refetchAllowanceToken1();
    } catch (error) {
      console.log(`Token approve error: `, error);
    }
  };

  const swapTokens = async () => {
    try {
      await refetchFeePercentage();

      const _deadline = String(moment().add(10, 'minutes').valueOf());

      let tx;

      if (account && chainId) {
        if (
          (!isNativeToken1 && +tokenBalanceToken1.toString() < +firstTokenValue) ||
          (!isNativeToken1 && +tokenBalanceToken1.toString() === 0)
        ) {
          alert('Insufficient funds');
          return;
        }

        if (
          (isNativeToken1 && +getHumanValue(balance.toString(), 18).toString() === 0) ||
          (isNativeToken1 && +getHumanValue(balance.toString(), 18).toString() < +firstTokenValue)
        ) {
          alert('Insufficient funds');
          return;
        }

        if (isNativeToken1 && token2) {
          const _path = [WRAPPED_NATIVE_CURRENCY[chainId], token2.id];

          const _amountOutMin = getNonHumanValue(secondTokenValue, tokenDecimalsToken2).toString();

          const value = getNonHumanValue(String(firstTokenValue), 18).toString();

          tx = await swapETHToToken({ _amountOutMin, _path, _to: account, _deadline, value });
        } else if (isNativeToken2 && token1) {
          const _path = [token1.id, WRAPPED_NATIVE_CURRENCY[chainId]];

          const _amountIn = getNonHumanValue(firstTokenValue, tokenDecimalsToken1).toString();

          const _amountOutMin = getNonHumanValue(secondTokenValue, 18).toString();

          tx = await swapTokenToETH({ _amountIn, _amountOutMin, _path, _to: account, _deadline });
        } else {
          if (token1 && token2) {
            const _path = [token1.id, token2.id];
            const _amountIn = getNonHumanValue(firstTokenValue, tokenDecimalsToken1).toString();

            const _amountOutMin = getNonHumanValue(
              secondTokenValue,
              tokenDecimalsToken2,
            ).toString();

            tx = await swapTokenToToken({
              _amountIn,
              _amountOutMin,
              _path,
              _to: account,
              _deadline,
            });
          }
        }

        if (tx?.wait) {
          let receipt = await tx.wait();
        }
      }
    } catch (error) {
      console.log('swapTokens error: ', error);
    }
  };

  const handleFirstTokenNumber = useCallback((e: any) => {
    const regex = /^([0-9]+([.][0-9]*)?|[.][0-9]+$)/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      setFirstTokenValue(e.target.value);
    }
  }, []);

  const handleSecondTokenNumber = useCallback((e: any) => {
    const regex = /^([0-9]+([.][0-9]*)?|[.][0-9]+$)/;
    if (e.target.value === '' || regex.test(e.target.value)) {
      setSecondTokenValue(e.target.value);
    }
  }, []);

  const fetchAmountsInQuery = useCallback(
    async (amount: string) => {
      if (token1 && token2 && amount && chainId) {
        const fee = getCommissionFee(
          getNonHumanValue(amount, isNativeToken2 ? 18 : tokenDecimalsToken2),
          100,
        );

        const subFee = subBigNumber(
          getNonHumanValue(amount, isNativeToken2 ? 18 : tokenDecimalsToken2),
          fee,
        );

        const path = await getSwapPath(token1Address, token2Address);
        if (path) {
          const amounts = await getAmountsInQuery(subFee, path);

          setFirstTokenValue(
            getHumanValue(
              amounts[0].toString().replace(',', '.'),
              isNativeToken1 ? 18 : tokenDecimalsToken1,
            ).toString(),
          );
        } else {
          alert('There are no exist sush pair');
          setSecondTokenValue('');
        }
      } else if (!amount || (amount && amount === '0')) {
        setFirstTokenValue('');
      } else {
        setFirstTokenValue('');
      }
    },
    [
      token1,
      token2,
      firstTokenValue,
      secondTokenValue,
      isNativeToken1,
      isNativeToken2,
      chainId,
      token1Address,
      token2Address,
      tokenDecimalsToken1,
      tokenDecimalsToken2,
    ],
  );

  const fetchAmountsOutQuery = useCallback(
    async (amount: string) => {
      if (token1 && token2 && amount && chainId) {
        const fee = getCommissionFee(
          getNonHumanValue(amount, isNativeToken1 ? 18 : tokenDecimalsToken1),
          100,
        );

        const subFee = subBigNumber(
          getNonHumanValue(amount, isNativeToken1 ? 18 : tokenDecimalsToken1),
          fee,
        );

        const path = await getSwapPath(token1Address, token2Address);

        if (path) {
          const amounts = await getAmountsOutQuery(subFee, path);

          setSecondTokenValue(
            getHumanValue(
              amounts[1].toString().replace(',', '.'),
              isNativeToken2 ? 18 : tokenDecimalsToken2,
            ).toString(),
          );
        } else {
          alert('There are no exist sush pair');
          setSecondTokenValue('');
        }
      } else if (!amount || (amount && amount === '0')) {
        setSecondTokenValue('');
      } else {
        setSecondTokenValue('');
      }
    },
    [
      token1,
      token2,
      firstTokenValue,
      isNativeToken1,
      isNativeToken2,
      chainId,
      token1Address,
      token2Address,
      tokenDecimalsToken1,
      tokenDecimalsToken2,
    ],
  );

  useEffect(() => {
    const fetchAmountOut = async () => {
      if (token1 && token2 && firstTokenValue && chainId && token1Address && token2Address) {
        const fee = getCommissionFee(
          getNonHumanValue(firstTokenValue, isNativeToken1 ? 18 : tokenDecimalsToken1),
          100,
        );

        const subFee = subBigNumber(
          getNonHumanValue(firstTokenValue, isNativeToken1 ? 18 : tokenDecimalsToken1),
          fee,
        );

        const path = await getSwapPath(token1Address, token2Address);

        if (path) {
          const amounts = await getAmountsOutQuery(subFee, path);

          setSecondTokenValue(
            getHumanValue(
              amounts[1].toString().replace(',', '.'),
              isNativeToken2 ? 18 : tokenDecimalsToken2,
            ).toString(),
          );
        } else {
          alert('There are no exist sush pair');
          setSecondTokenValue('');
        }
      }
    };

    if (!!token1 && !!token2 && !!firstTokenValue && +firstTokenValue && !isSecondActive) {
      fetchAmountOut();
    } else if (
      !firstTokenValue ||
      (firstTokenValue && firstTokenValue === '0' && !isSecondActive)
    ) {
      setSecondTokenValue('');
    }
  }, [
    token1,
    token2,
    firstTokenValue,
    isNativeToken1,
    isNativeToken2,
    chainId,
    token1Address,
    token2Address,
    tokenDecimalsToken1,
    tokenDecimalsToken2,
    isSecondActive,
  ]);

  const sortedNetworks = NETWORK_SELECTOR_CHAINS.map((chainId) => ({
    name: getChainNameById(chainId),
    chainId,
  })).sort((a, b) => (a.name > b.name ? 1 : -1));

  const currentNetworkObj = sortedNetworks.find((item) => item.chainId === chainId);

  return (
    <>
      <div className={styles.main_wrapper}>
        <div className={styles.content_wrapper}>
          <div className={styles.content}>
            <Stack sx={{ width: '100%' }} mb={3}>
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
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.chainId === value.chainId
                    }
                    onChange={(e, value: any) => {
                      setNetwork(value?.chainId);
                    }}
                    renderInput={(params) => <TextField {...params} label="Networks" />}
                  />
                )}
              </FormControl>
            </Stack>
            <div className={styles.swap_blocks_layout}>
              <TokenInput
                token1={token1}
                value={token1}
                token2={token2}
                allTokens={allTokens}
                balance={balance}
                tokenBalance={tokenBalanceToken1}
                isNative={isNativeToken1}
                tokenDecimals={tokenDecimalsToken1}
                tokenValue={firstTokenValue}
                fetchAmounts={fetchAmountsOutQuery}
                handleFirstTokenNumber={handleFirstTokenNumber}
                setToken2={setToken2}
                setToken1={setToken1}
                setTokenAddr2={setTokenAddr2}
                setTokenAddr1={setTokenAddr1}
                first
                setActiveInput={setIsSecondActive}
              />

              <div
                onClick={() => {
                  setToken1(token2);
                  setToken2(token1);
                  setTokenAddr1(token2.id);
                  setTokenAddr2(token1.id);
                }}
                className={styles.arrow_wrapper}
              >
                <SouthIcon sx={{ width: '25px', height: '20px', color: '#007994' }} />
              </div>
              <TokenInput
                token1={token1}
                token2={token2}
                value={token2}
                allTokens={allTokens}
                isNative={isNativeToken2}
                balance={balance}
                tokenDecimals={tokenDecimalsToken2}
                tokenBalance={tokenBalanceToken2}
                tokenValue={secondTokenValue}
                fetchAmounts={fetchAmountsInQuery}
                handleFirstTokenNumber={handleSecondTokenNumber}
                setToken2={setToken2}
                setToken1={setToken1}
                setTokenAddr2={setTokenAddr2}
                setTokenAddr1={setTokenAddr1}
                setActiveInput={setIsSecondActive}
              />
            </div>
            {!account ? (
              <Button
                className={styles.connect_button}
                onClick={isAllowedToken1 ? swapTokens : approveHandler}
              >
                Connect wallet
              </Button>
            ) : token1 && token1.symbol ? (
              <Button
                className={styles.connect_button}
                onClick={isAllowedToken1 || isNativeToken1 ? swapTokens : approveHandler}
              >
                {isAllowedToken1 || isNativeToken1
                  ? `Swap ${token1.symbol}`
                  : `Approve ${token1.symbol}`}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
