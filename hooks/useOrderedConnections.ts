import { ConnectionType } from 'connection';
import { getConnection } from 'connection/utils';
import { useMemo } from 'react';
import { useAppSelector } from 'state/hooks';

const SELECTABLE_WALLETS = [
  ConnectionType.INJECTED,
  ConnectionType.COINBASE_WALLET,
  ConnectionType.WALLET_CONNECT,
];

export default function useOrderedConnections() {
  const selectedWallet = useAppSelector(({ user }) => user.selectedWallet);
  return useMemo(() => {
    const orderedConnectionTypes: ConnectionType[] = [];

    if (selectedWallet) {
      orderedConnectionTypes.push(selectedWallet);
    }
    orderedConnectionTypes.push(
      ...SELECTABLE_WALLETS.filter((wallet) => wallet !== selectedWallet),
    );

    orderedConnectionTypes.push(ConnectionType.NETWORK);

    return orderedConnectionTypes.map(getConnection);
  }, [selectedWallet]);
}
