import { useMultiSendContract } from '@/hooks/useContract';
import {
  buildQuery,
  getNonHumanValue,
  getHumanValue,
  geTokensByChainId,
  getChainNameById,
} from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import styles from './transfer.module.scss';
import { useMutation } from 'react-query';
import { TOKENS, TokensMap } from '@/constants/tokens';
import { SupportedChainId } from '@/constants/chains';
import useSelectChain from '@/hooks/useSelectChain';
import useSyncChain from '@/hooks/useSyncChain';
import { MULTISEND_DIFF_TOKEN } from '@/constants/queryKeys';
import useTokenData from '@/hooks/useTokenData';

const wallets = [
  // '0x7e1c30ED14ae2DF4Ec5Ea32d96B13E175359a084', // <= мой кошель бинанс тест сети
  '0x91Bbc2A6C3C7006e26Cd1CF6e27B0FeBA94377cE',
  // '0x91Bbc2A6C3C7006e26Cd1CF6e27B0FeBA94377cE',
  // '0x519af7175AccA8976DF567dA46b4aFb0C5201303',
];
const amounts = ['0.1'];
// const amounts = ['0.1', '0.1'];

const NETWORK_SELECTOR_CHAINS = [
  SupportedChainId.BSC,
  // SupportedChainId.BSC_TEST,
  // SupportedChainId.MAINNET,
  // SupportedChainId.POLYGON,
  // SupportedChainId.POLYGON_MUMBAI,
  // SupportedChainId.OPTIMISM,
  // SupportedChainId.ARBITRUM_ONE,
  // SupportedChainId.CELO,
];

const Transfer = () => {
  const { account, chainId, provider } = useWeb3React();

  const selectChain = useSelectChain();

  useSyncChain();

  const [tokens, setTokens] = useState<TokensMap[SupportedChainId] | null>(null);

  const [tokenAddress, setTokenAddress] = useState<string>('');

  const setNetwork = async (targetChainId: SupportedChainId) => {
    await selectChain(targetChainId);
  };

  // const { approve, isAllowed, refetchAllowance, tokenDecimals } = useTokenData(tokenAddress);

  // const {
  //   multiSendDiffToken: multiSendDiffTokenQuery,
  //   estimateGas: { multiSendDiffToken: multiSendDiffTokenEstimate },
  // } = useMultiSendContract();

  // const { mutateAsync: multiSendDiffToken } = useMutation(
  //   `${MULTISEND_DIFF_DIFF_TOKEN}_${tokenAddress}`,
  //   ({
  //     employeesWallets,
  //     employeesParsedAmounts,
  //   }: {
  //     employeesWallets: string[];
  //     employeesParsedAmounts: string[];
  //   }): Promise<any> =>
  //     buildQuery(
  //       multiSendDiffTokenQuery,
  //       [employeesWallets, employeesParsedAmounts, tokenAddress],
  //       multiSendDiffTokenEstimate,
  //     ),
  //   {
  //     onError: (err) => console.log(err, `${MULTISEND_DIFF_DIFF_TOKEN}_${tokenAddress}`),
  //   },
  // );

  // const sendTransfer = async () => {
  //   if (!account) {
  //     alert('wallet not connected');
  //     return;
  //   }

  //   if (!isAllowed) {
  //     await approve();
  //     refetchAllowance();
  //   }

  //   const employeesWallets = wallets.map((wallet) => wallet);

  //   const employeesParsedAmounts = amounts.map((amount) =>
  //     getNonHumanValue(amount, tokenDecimals).toString(),
  //   );

  //   const tx = await multiSendDiffToken({ employeesWallets, employeesParsedAmounts });

  //   const receipt = await tx.wait();

  //   console.log('receipt', receipt);

  //   if (provider) {
  //     const balance = (await provider.getBalance(account)).toString();
  //     console.log('balance', getHumanValue(balance, tokenDecimals).toString());
  //   }
  // };

  useEffect(() => {
    if (chainId) {
      setTokens(geTokensByChainId(TOKENS, chainId));
    }
  }, [chainId]);

  useEffect(() => {
    if (tokens && tokens.length) {
      setTokenAddress(tokens[0].address);
    }
  }, [tokens]);

  return (
    <div className={styles.container}>
      <div className={styles.transfer}>
        {account ? (
          <select onChange={(event) => setNetwork(+event.target.value)} name="tokens">
            {NETWORK_SELECTOR_CHAINS?.map((chain, i) => (
              <option key={chain} value={chain}>
                {getChainNameById(chain)}
              </option>
            ))}
          </select>
        ) : null}
        {account && tokens && tokens.length ? (
          <select onChange={(event) => setTokenAddress(event.target.value)} name="tokens">
            {tokens?.map((token, i) => (
              <option key={i} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        ) : null}
        {/* {account && tokens && tokens.length ? (
          <button onClick={sendTransfer}>{isAllowed ? 'Make a transfer' : 'Approve'}</button>
        ) : null} */}
      </div>
    </div>
  );
};

export default Transfer;
