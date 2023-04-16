import { SupportedChainId } from './chains';

const INFURA_KEY = 'cb79f6871ebe4e1c827ab1019e048094';

/**
 * Fallback JSON-RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export const FALLBACK_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [
    // "Safe" URLs
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],
  [SupportedChainId.POLYGON]: [
    // "Safe" URLs
    'https://polygon-rpc.com/',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet-full-rpc.bwarelabs.com',
  ],
  // [SupportedChainId.POLYGON_MUMBAI]: [
  //   // "Safe" URLs
  //   'https://matic-mumbai.chainstacklabs.com',
  //   'https://rpc-mumbai.maticvigil.com',
  //   'https://matic-testnet-archive-rpc.bwarelabs.com',
  // ],
  [SupportedChainId.ARBITRUM_ONE]: [
    // "Safe" URLs
    'https://arb1.arbitrum.io/rpc',
    // "Fallback" URLs
    'https://arbitrum.public-rpc.com',
  ],
  // [SupportedChainId.ARBITRUM_RINKEBY]: [
  //   // "Safe" URLs
  //   'https://rinkeby.arbitrum.io/rpc',
  // ],
  [SupportedChainId.OPTIMISM]: [
    // "Safe" URLs
    'https://mainnet.optimism.io/',
    // "Fallback" URLs
    'https://rpc.ankr.com/optimism',
  ],
  // [SupportedChainId.OPTIMISM_GOERLI]: [
  //   // "Safe" URLs
  //   'https://goerli.optimism.io',
  // ],
  [SupportedChainId.CELO]: [
    // "Safe" URLs
    `https://forno.celo.org`,
  ],
  // [SupportedChainId.CELO_ALFAJORES]: [
  //   // "Safe" URLs
  //   `https://alfajores-forno.celo-testnet.org`,
  // ],
  [SupportedChainId.BSC]: [
    // "Safe" URLs
    `https://bsc-dataseed1.defibit.io`,
    `https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3`,
    `https://rpc-bsc.bnb48.club`,
    `https://bsc-dataseed4.binance.org`,
    `https://bsc-dataseed1.binance.org/`,
  ],
  // [SupportedChainId.BSC_TEST]: [
  //   // "Safe" URLs
  //   `https://data-seed-prebsc-1-s3.binance.org:8545/`,
  //   `https://data-seed-prebsc-2-s3.binance.org:8545`,
  //   `https://bsc-testnet.public.blastapi.io`,
  //   `https://endpoints.omniatech.io/v1/bsc/testnet/public`,
  //   `https://data-seed-prebsc-2-s1.binance.org:8545`,
  // ],
  [SupportedChainId.AVALANCHE]: [
    // "Safe" URLs
    `https://avalanche-evm.publicnode.com`,
    `https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc`,
    `https://avalanche.blockpi.network/v1/rpc/public`,
    `https://endpoints.omniatech.io/v1/avax/mainnet/public`,
    `https://api.avax.network/ext/bc/C/rpc`,
  ],
  [SupportedChainId.GODWOKEN]: [
    // "Safe" URLs
    `https://v1.mainnet.godwoken.io/rpc`,
  ],
  [SupportedChainId.FANTOM]: [
    // "Safe" URLs
    `https://endpoints.omniatech.io/v1/fantom/mainnet/public`,
    `https://rpc.fantom.network`,
    `https://rpc2.fantom.network`,
    `https://fantom-mainnet.public.blastapi.io`,
    `https://1rpc.io/ftm`,
  ],
  [SupportedChainId.GNOSIS]: [
    // "Safe" URLs
    `https://gnosis-mainnet.public.blastapi.io`,
    `https://rpc.gnosischain.com`,
    `https://xdai-rpc.gateway.pokt.network`,
    `https://gnosis.blockpi.network/v1/rpc/public`,
    `https://rpc.ankr.com/gnosis`,
  ],
  [SupportedChainId.MOONBEAM]: [
    // "Safe" URLs
    `https://rpc.api.moonbeam.network`,
    `https://moonbeam.public.blastapi.io`,
    `https://rpc.ankr.com/moonbeam`,
  ],
  [SupportedChainId.OASIS_EMERALD]: [
    // "Safe" URLs
    `https://emerald.oasis.dev`,
  ],
  [SupportedChainId.OASIS_SAPPHIRE]: [
    // "Safe" URLs
    `https://sapphire.oasis.io`,
  ],
  [SupportedChainId.AURORA]: [
    // "Safe" URLs
    `https://mainnet.aurora.dev`,
    `https://endpoints.omniatech.io/v1/aurora/mainnet/public`,
  ],
  [SupportedChainId.FUSE]: [
    // "Safe" URLs
    `https://fuse-mainnet.chainstacklabs.com`,
    `https://rpc.fuse.io`,
    `https://fuse-rpc.gateway.pokt.network`,
  ],
};

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [
    `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.OPTIMISM]: [
    `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.OPTIMISM],
  ],
  // [SupportedChainId.OPTIMISM_GOERLI]: [...FALLBACK_URLS[SupportedChainId.OPTIMISM_GOERLI]],
  [SupportedChainId.ARBITRUM_ONE]: [
    `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.ARBITRUM_ONE],
  ],
  // [SupportedChainId.ARBITRUM_RINKEBY]: [...FALLBACK_URLS[SupportedChainId.ARBITRUM_RINKEBY]],
  [SupportedChainId.POLYGON]: [
    `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.POLYGON],
  ],
  // [SupportedChainId.POLYGON_MUMBAI]: [...FALLBACK_URLS[SupportedChainId.POLYGON_MUMBAI]],
  [SupportedChainId.CELO]: [
    `https://celo-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.CELO],
  ],
  // [SupportedChainId.CELO_ALFAJORES]: FALLBACK_URLS[SupportedChainId.CELO_ALFAJORES],
  [SupportedChainId.BSC]: [
    `https://palpable-fragrant-sun.bsc.discover.quiknode.pro/b4d621ed1a1c73e2dc8d28721cc3b15e5a44b02d/`,
    ...FALLBACK_URLS[SupportedChainId.BSC],
  ],
  // [SupportedChainId.BSC_TEST]: FALLBACK_URLS[SupportedChainId.BSC_TEST],
  [SupportedChainId.AVALANCHE]: [
    `https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.AVALANCHE],
  ],
  [SupportedChainId.GODWOKEN]: [...FALLBACK_URLS[SupportedChainId.GODWOKEN]],
  [SupportedChainId.FANTOM]: [...FALLBACK_URLS[SupportedChainId.FANTOM]],
  [SupportedChainId.GNOSIS]: [...FALLBACK_URLS[SupportedChainId.GNOSIS]],
  [SupportedChainId.MOONBEAM]: [...FALLBACK_URLS[SupportedChainId.MOONBEAM]],
  [SupportedChainId.OASIS_EMERALD]: [...FALLBACK_URLS[SupportedChainId.OASIS_EMERALD]],
  [SupportedChainId.OASIS_SAPPHIRE]: [...FALLBACK_URLS[SupportedChainId.OASIS_SAPPHIRE]],
  [SupportedChainId.AURORA]: [...FALLBACK_URLS[SupportedChainId.AURORA]],
  [SupportedChainId.FUSE]: FALLBACK_URLS[SupportedChainId.FUSE],
};
