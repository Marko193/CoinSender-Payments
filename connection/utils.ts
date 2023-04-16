import { Connector } from '@web3-react/types';
import {
  coinbaseWalletConnection,
  ConnectionType,
  injectedConnection,
  networkConnection,
  walletConnectConnection,
} from 'connection';

export function getIsInjected(): boolean {
  return Boolean(window.ethereum);
}

export function getHasMetaMaskExtensionInstalled(): boolean {
  if (typeof window !== 'undefined' && 'ethereum' in window) {
    return (window as any).ethereum?.isMetaMask ?? false;
  } else return false;
}

export function getHasCoinbaseExtensionInstalled(): boolean {
  if (typeof window !== 'undefined' && 'ethereum' in window) {
    return (window as any).ethereum?.isCoinbaseWallet ?? false;
  } else return false;
}

export function getIsMetaMask(connectionType: ConnectionType): boolean {
  return connectionType === ConnectionType.INJECTED && getHasMetaMaskExtensionInstalled();
}

export const CONNECTIONS = [
  injectedConnection,
  coinbaseWalletConnection,
  walletConnectConnection,
  networkConnection,
];
export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find((connection) => connection.connector === c);
    if (!connection) {
      throw Error('unsupported connector');
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection;
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection;
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection;
      case ConnectionType.NETWORK:
        return networkConnection;
    }
  }
}

export function getConnectionName(
  connectionType: ConnectionType,
  hasMetaMaskExtension: boolean = getHasMetaMaskExtensionInstalled(),
) {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return hasMetaMaskExtension ? 'MetaMask' : 'Browser Wallet';
    case ConnectionType.COINBASE_WALLET:
      return 'Coinbase Wallet';
    case ConnectionType.WALLET_CONNECT:
      return 'WalletConnect';
    case ConnectionType.NETWORK:
      return 'Network';
  }
}
