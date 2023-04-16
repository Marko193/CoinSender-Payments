import { Connector } from '@web3-react/types';
import { networkConnection, walletConnectConnection } from 'connection';
import { getChainInfo } from 'constants/chainInfo';
import { isSupportedChain, SupportedChainId } from 'constants/chains';
import { FALLBACK_URLS, RPC_URLS } from 'constants/networks';

function getRpcUrl(chainId: SupportedChainId): string {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.BSC:
    case SupportedChainId.POLYGON:
    case SupportedChainId.CELO:
    case SupportedChainId.OPTIMISM:
    // case SupportedChainId.AVALANCHE:
    case SupportedChainId.GODWOKEN:
    case SupportedChainId.FANTOM:
    case SupportedChainId.GNOSIS:
    case SupportedChainId.MOONBEAM:
    case SupportedChainId.OASIS_EMERALD:
    case SupportedChainId.OASIS_SAPPHIRE:
      return RPC_URLS[chainId][0];

    default:
      return FALLBACK_URLS[chainId][0];
  }
}

export const switchChain = async (connector: Connector, chainId: SupportedChainId) => {
  if (!isSupportedChain(chainId)) {
    throw new Error(`Network not supported`);
  } else if (
    connector === walletConnectConnection.connector ||
    connector === networkConnection.connector
  ) {
    await connector.activate(chainId);
  } else {
    try {
      await connector.activate(chainId);
    } catch (error) {
      if ((error as any)?.code === 4902) {
        const info = getChainInfo(chainId);
        const addChainParameter = {
          chainId,
          chainName: info.label,
          rpcUrls: [getRpcUrl(chainId)],
          nativeCurrency: info.nativeCurrency,
          blockExplorerUrls: [info.explorer],
        };

        await connector.activate(addChainParameter);
      }
    }
  }
};
