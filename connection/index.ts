import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import { SupportedChainId } from 'constants/chains';

// import UNISWAP_LOGO_URL from '../assets/svg/logo.svg';
import { RPC_URLS } from '../constants/networks';
import { RPC_PROVIDERS } from '../constants/providers';

export enum ConnectionType {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  NETWORK = 'NETWORK',
  // UNPREDICTABLE_GAS_LIMIT = 'UNPREDICTABLE_GAS_LIMIT',
}

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

type MetaMaskError = Error & { code: number };

let metaMaskErrorHandler: (error: MetaMaskError) => void | undefined;
export function setMetMaskErrorHandler(errorHandler: typeof metaMaskErrorHandler) {
  metaMaskErrorHandler = errorHandler;
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

function onMetaMaskError(error: Error) {
  onError(error);
  metaMaskErrorHandler?.(error as MetaMaskError);
}

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  (actions) => new Network({ actions, urlMap: RPC_PROVIDERS, defaultChainId: 1 }),
);
export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
};

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError: onMetaMaskError }),
);
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
};

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>(
  (actions) => {
    const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
      (map, [chainId, urls]) => ({
        ...map,
        [chainId]: urls[0],
      }),
      {},
    );
    return new WalletConnect({
      actions,
      options: {
        rpc: RPC_URLS_WITHOUT_FALLBACKS,
        qrcode: true,
      },
      onError,
    });
  },
);
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
};

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: RPC_URLS[SupportedChainId.BSC][0],
        appName: 'Coinsender',
        appLogoUrl: '',
        reloadOnDisconnect: false,
      },
      onError,
    }),
);
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
};
