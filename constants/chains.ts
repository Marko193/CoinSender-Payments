/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAINNET = 1,

  ARBITRUM_ONE = 42161,
  // ARBITRUM_RINKEBY = 421611,

  OPTIMISM = 10,
  // OPTIMISM_GOERLI = 420,

  POLYGON = 137,
  // POLYGON_MUMBAI = 80001,

  CELO = 42220,
  // CELO_ALFAJORES = 44787,

  BSC = 56,
  // BSC_TEST = 97,

  AVALANCHE = 43114,

  GODWOKEN = 71402,

  FANTOM = 250,

  GNOSIS = 100,

  MOONBEAM = 1284,

  OASIS_EMERALD = 42262,
  OASIS_SAPPHIRE = 23294,

  AURORA = 1313161554,

  FUSE = 122,
}

export const DEFAULT_CHAIN_ID = 56;

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'ethereum',
  [SupportedChainId.POLYGON]: 'polygon',
  // [SupportedChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
  [SupportedChainId.CELO]: 'celo',
  // [SupportedChainId.CELO_ALFAJORES]: 'celo_alfajores',
  [SupportedChainId.ARBITRUM_ONE]: 'arbitrum',
  // [SupportedChainId.ARBITRUM_RINKEBY]: 'arbitrum_rinkeby',
  [SupportedChainId.OPTIMISM]: 'optimism',
  // [SupportedChainId.OPTIMISM_GOERLI]: 'optimism_goerli',
  [SupportedChainId.BSC]: 'binance',
  // [SupportedChainId.BSC_TEST]: 'binance_test',
  [SupportedChainId.AVALANCHE]: 'avalanche',
  [SupportedChainId.GODWOKEN]: 'godwoken',
  [SupportedChainId.FANTOM]: 'fantom',
  [SupportedChainId.GNOSIS]: 'gnosis',
  [SupportedChainId.MOONBEAM]: 'moonbeam',
  [SupportedChainId.OASIS_EMERALD]: 'oasis_emerald',
  [SupportedChainId.OASIS_SAPPHIRE]: 'oasis_sapphire',
  [SupportedChainId.AURORA]: 'aurora',
  [SupportedChainId.FUSE]: 'fuse',
};

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number',
) as SupportedChainId[];

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId];
}
