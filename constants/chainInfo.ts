import { SupportedChainId } from './chains';
import { ARBITRUM_LIST, BSC_LIST, CELO_LIST, OPTIMISM_LIST } from './lists';

export const AVERAGE_L1_BLOCK_TIME = 12000;

export enum NetworkType {
  L1,
  L2,
}
interface BaseChainInfo {
  readonly networkType: NetworkType;
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs?: string;
  readonly bridge?: string;
  readonly explorer: string;
  readonly infoLink?: string;
  readonly logoUrl?: string;
  readonly circleLogoUrl?: string;
  readonly label: string;
  readonly helpCenterUrl?: string;
  readonly nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  readonly color?: string;
  readonly backgroundColor?: string;
}

interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1;
  readonly defaultListUrl?: string;
}

export interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2;
  readonly bridge: string;
  readonly statusPage?: string;
  readonly defaultListUrl: string;
}

type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo };

const CHAIN_INFO: ChainInfoMap = {
  [SupportedChainId.MAINNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.OPTIMISM]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: 25000,
    bridge: 'https://app.optimism.io/bridge',
    defaultListUrl: OPTIMISM_LIST,
    docs: 'https://optimism.io/',
    explorer: 'https://optimistic.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/optimism/',
    label: 'Optimism',
    // Optimism perfers same icon for both
    statusPage: 'https://optimism.io/status',
    helpCenterUrl:
      'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  // [SupportedChainId.OPTIMISM_GOERLI]: {
  //   networkType: NetworkType.L2,
  //   blockWaitMsBeforeWarning: 25000,
  //   bridge: 'https://app.optimism.io/bridge',
  //   defaultListUrl: OPTIMISM_LIST,
  //   docs: 'https://optimism.io/',
  //   explorer: 'https://goerli-optimism.etherscan.io/',
  //   infoLink: 'https://info.uniswap.org/#/optimism/',
  //   label: 'Optimism Görli',
  //   statusPage: 'https://optimism.io/status',
  //   helpCenterUrl:
  //     'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
  //   nativeCurrency: { name: 'Optimism Goerli Ether', symbol: 'görOpETH', decimals: 18 },
  // },
  [SupportedChainId.ARBITRUM_ONE]: {
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://bridge.arbitrum.io/',
    docs: 'https://offchainlabs.com/',
    explorer: 'https://arbiscan.io/',
    infoLink: 'https://info.uniswap.org/#/arbitrum',
    label: 'Arbitrum',
    defaultListUrl: ARBITRUM_LIST,
    helpCenterUrl: 'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  // [SupportedChainId.ARBITRUM_RINKEBY]: {
  //   networkType: NetworkType.L2,
  //   blockWaitMsBeforeWarning: 10000,
  //   bridge: 'https://bridge.arbitrum.io/',
  //   docs: 'https://offchainlabs.com/',
  //   explorer: 'https://rinkeby-explorer.arbitrum.io/',
  //   infoLink: 'https://info.uniswap.org/#/arbitrum/',
  //   label: 'Arbitrum Rinkeby',
  //   defaultListUrl: ARBITRUM_LIST,
  //   helpCenterUrl: 'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum',
  //   nativeCurrency: { name: 'Rinkeby Arbitrum Ether', symbol: 'rinkArbETH', decimals: 18 },
  // },
  [SupportedChainId.POLYGON]: {
    networkType: NetworkType.L1,
    bridge: 'https://wallet.polygon.technology/login',
    docs: 'https://polygon.io/',
    explorer: 'https://polygonscan.com/',
    infoLink: 'https://info.uniswap.org/#/polygon/',
    label: 'Polygon',
    nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 },
  },
  // [SupportedChainId.POLYGON_MUMBAI]: {
  //   networkType: NetworkType.L1,
  //   blockWaitMsBeforeWarning: 10000,
  //   bridge: 'https://wallet.polygon.technology/bridge',
  //   docs: 'https://polygon.io/',
  //   explorer: 'https://mumbai.polygonscan.com/',
  //   infoLink: 'https://info.uniswap.org/#/polygon/',
  //   label: 'Polygon Mumbai',
  //   nativeCurrency: { name: 'Polygon Mumbai Matic', symbol: 'mMATIC', decimals: 18 },
  // },
  [SupportedChainId.CELO]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    docs: 'https://docs.celo.org/',
    explorer: 'https://celoscan.io/',
    infoLink: 'https://info.uniswap.org/#/celo',
    label: 'Celo',
    nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
    defaultListUrl: CELO_LIST,
  },
  // [SupportedChainId.CELO_ALFAJORES]: {
  //   networkType: NetworkType.L1,
  //   blockWaitMsBeforeWarning: 10000,
  //   bridge: 'https://www.portalbridge.com/#/transfer',
  //   docs: 'https://docs.celo.org/',
  //   explorer: 'https://alfajores-blockscout.celo-testnet.org/',
  //   infoLink: 'https://info.uniswap.org/#/celo',
  //   label: 'Celo Alfajores',
  //   nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
  //   defaultListUrl: CELO_LIST,
  // },
  [SupportedChainId.BSC]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://bscscan.com/',
    label: 'Binance',
    nativeCurrency: { name: 'Bnb', symbol: 'BNB', decimals: 18 },
    defaultListUrl: BSC_LIST,
  },
  // [SupportedChainId.BSC_TEST]: {
  //   networkType: NetworkType.L1,
  //   blockWaitMsBeforeWarning: 10000,
  //   bridge: 'https://www.portalbridge.com/#/transfer',
  //   explorer: 'https://testnet.bscscan.com/',
  //   label: 'Binance',
  //   nativeCurrency: { name: 'Bnb', symbol: 'BNB', decimals: 18 },
  //   defaultListUrl: BSC_LIST,
  // },
  [SupportedChainId.AVALANCHE]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://snowtrace.io/',
    label: 'Avalanche',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  },
  [SupportedChainId.GODWOKEN]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://gw-mainnet-explorer.nervosdao.community/',
    label: 'Godwoken',
    nativeCurrency: { name: 'CBK', symbol: 'CKB', decimals: 18 },
  },
  [SupportedChainId.FANTOM]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://ftmscan.com/',
    label: 'Fantom',
    nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
  },
  [SupportedChainId.FUSE]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://explorer.fuse.io/',
    label: 'Fuse',
    nativeCurrency: { name: 'Fuse', symbol: 'Fuse', decimals: 18 },
  },
  [SupportedChainId.GNOSIS]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://gnosisscan.io/',
    label: 'Gnosis',
    nativeCurrency: { name: 'xDai', symbol: 'xDai', decimals: 18 },
  },
  [SupportedChainId.OASIS_EMERALD]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://explorer.emerald.oasis.dev/',
    label: 'Oasis emerals',
    nativeCurrency: { name: 'ROSE', symbol: 'ROSE', decimals: 18 },
  },
  [SupportedChainId.OASIS_SAPPHIRE]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://explorer.sapphire.oasis.io',
    label: 'Oasis sapphire',
    nativeCurrency: { name: 'ROSE', symbol: 'ROSE', decimals: 18 },
  },
  [SupportedChainId.MOONBEAM]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://moonscan.io/',
    label: 'Moonbeam',
    nativeCurrency: { name: 'GLMR', symbol: 'GLMR', decimals: 18 },
  },
  [SupportedChainId.AURORA]: {
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: 10000,
    bridge: 'https://www.portalbridge.com/#/transfer',
    explorer: 'https://aurorascan.dev',
    label: 'Aurora',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
};

export function getChainInfo(chainId: SupportedChainId): L1ChainInfo | L2ChainInfo;
export function getChainInfo(
  chainId: SupportedChainId | number | undefined,
): L1ChainInfo | L2ChainInfo | undefined;

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns chaininfo | undefined
 * SupportedChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(chainId: any): any {
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined;
  }
  return undefined;
}

const MAINNET_INFO = CHAIN_INFO[SupportedChainId.BSC];
export function getChainInfoOrDefault(chainId: number | undefined) {
  return getChainInfo(chainId) ?? MAINNET_INFO;
}
