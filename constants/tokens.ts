import { SupportedChainId } from './chains';

export const DEFAULT_ERC20_DECIMALS = 18;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface TokensMap {
  [chainId: number]: {
    address: string;
    name: string;
    decimals?: number;
    symbol?: string;
    logoURI?: string;
    chainId?: number;
  }[];
}

export const TOKENS: TokensMap = {
  [SupportedChainId.BSC]: [
    {
      address: 'native',
      symbol: 'BNB',
      name: 'bnb',
      decimals: 18,
    },
    {
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      chainId: 56,
      name: 'Ethereum Token',
      symbol: 'ETH',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      chainId: 56,
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x55d398326f99059fF775485246999027B3197955/logo.png',
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      chainId: 56,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png',
    },
    {
      address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      chainId: 56,
      name: 'Dai Token',
      symbol: 'DAI',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3/logo.png',
    },
    {
      address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      chainId: 56,
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0xBf5140A22578168FD562DCcF235E5D43A02ce9B1/logo.png',
    },
    {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      chainId: 56,
      name: 'BUSD Token',
      symbol: 'BUSD',
      decimals: 18,
      logoURI:
        'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png',
    },
    {
      address: '0xfb6115445Bff7b52FeB98650C87f44907E58f802',
      name: 'Binance-Peg Aave Token',
      symbol: 'AAVE',
      decimals: 18,
    },
    {
      address: '0xf307910A4c7bbc79691fD374889b36d8531B08e3',
      name: 'Ankr',
      symbol: 'ANKR',
      decimals: 18,
    },
    {
      address: '0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0',
      name: 'Binance-Peg Axie Infinity Shard Token',
      symbol: 'AXS',
      decimals: 18,
    },
    {
      address: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95',
      name: 'ApeSwapFinance Banana',
      symbol: 'BANANA',
      decimals: 18,
    },
    {
      address: '0x8da443f84fea710266c8eb6bc34b71702d033ef2',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  [SupportedChainId.MAINNET]: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'eth',
      decimals: 18,
    },
    {
      address: '0x4355fC160f74328f9b383dF2EC589bB3dFd82Ba0',
      name: 'Optimus',
      symbol: 'OPT',
      decimals: 18,
    },
    {
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      name: ' Aave Token',
      symbol: 'AAVE',
      decimals: 18,
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
    },
    {
      address: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
      name: 'Aave interest bearing DAI',
      symbol: 'aDAI',
      decimals: 18,
    },
    {
      address: '0xBcca60bB61934080951369a648Fb03DF4F96263C',
      name: 'Aave interest bearing USDC',
      symbol: 'aUSDC',
      decimals: 6,
    },
    {
      address: '0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  [SupportedChainId.POLYGON]: [
    {
      address: 'native',
      symbol: 'MATIC',
      name: 'Matic',
      decimals: 18,
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      name: '(PoS) Tether USD',
      decimals: 6,
    },
    {
      address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      symbol: 'DAI',
      name: '(PoS) Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      symbol: 'AAVE',
      name: 'Aave (PoS)',
      decimals: 18,
    },
    {
      address: '0x329434Fe066AC71D5FB93489F955A6959658097b',
      symbol: 'aDAI',
      name: 'Aave interest bearing DAI (PoS)',
      decimals: 18,
    },
    {
      address: '0xe87Ba1bd11EE6e0D3c7dd6932E6A038e38627F65',
      symbol: 'aUSDC',
      name: 'aUSDC',
      decimals: 18,
    },
    {
      address: '0x2727Ab1c2D22170ABc9b595177B2D5C6E1Ab7B7B',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  [SupportedChainId.OPTIMISM]: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    },
    {
      address: '0x76FB31fb4af56892A25e32cFC43De717950c9278',
      symbol: 'AAVE',
      name: 'Aave Token',
      decimals: 18,
    },
    {
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
    {
      address: '0xEc6adef5E1006bb305bB1975333e8fc4071295bf',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  [SupportedChainId.ARBITRUM_ONE]: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    {
      address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x8F4581D173FFD2c439824465366a67c509A813ac',
      symbol: 'AETH',
      name: 'Atlantis EThereum',
      decimals: 18,
    },
    {
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      symbol: 'USDC',
      name: 'USD Coin (Arb1)',
      decimals: 6,
    },
    {
      address: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
      symbol: 'aArbUSDC',
      name: 'Aave Arbitrum USDC',
      decimals: 6,
    },
    {
      address: '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE',
      symbol: 'aArbDAI',
      name: 'Aave Arbitrum DAI',
      decimals: 18,
    },
    {
      address: '0xa0b862F60edEf4452F25B4160F177db44DeB6Cf1',
      symbol: 'GNO',
      name: 'Gnosis Token',
      decimals: 18,
    },
    {
      address: '0x9623063377AD1B27544C965cCd7342f7EA7e88C7',
      symbol: 'GRT',
      name: 'Graph Token',
      decimals: 18,
    },
    {
      address: '0xe4DDDfe67E7164b0FE14E218d80dC4C08eDC01cB',
      symbol: 'KNC',
      name: 'Kyber Network Crystal v2',
      decimals: 18,
    },
    {
      address: '0x319f865b287fCC10b30d8cE6144e8b6D1b476999',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  [SupportedChainId.CELO]: [
    {
      address: 'native',
      symbol: 'CELO',
      name: 'CELO',
      decimals: 18,
    },
    {
      address: '0xe8537a3d056da446677b9e9d6c5db704eaab4787',
      symbol: 'cREAL',
      name: 'Celo Brazilian Real',
      decimals: 18,
    },
    {
      address: '0x765de816845861e75a25fca122bb6898b8b1282a',
      symbol: 'cUSD',
      name: 'Celo Dollar',
      decimals: 18,
    },
    {
      address: '0x29dfce9c22003a4999930382fd00f9fd6133acd1',
      symbol: 'SUSHI',
      name: 'SushiToken',
      decimals: 18,
    },
    {
      address: '0x122013fd7df1c6f636a5bb8f03108e876548b455',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    },
  ],
  // [SupportedChainId.BSC_TEST]: [
  //   {
  //     address: 'native',
  //     symbol: 'BNB',
  //     name: 'BNB',
  //     decimals: 18,
  //   },
  //   {
  //     address: '0x64544969ed7EBf5f083679233325356EbE738930',
  //     symbol: 'USDC',
  //     name: 'USDC Token',
  //     decimals: 18,
  //   },
  //   {
  //     address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  //     symbol: 'USDT',
  //     name: 'USDT Token',
  //     decimals: 18,
  //   },
  //   {
  //     address: '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867',
  //     symbol: 'DAI',
  //     name: 'DAI Token',
  //     decimals: 18,
  //   },
  // ],
  [SupportedChainId.AVALANCHE]: [
    {
      address: 'native',
      symbol: 'AVAX',
      name: 'Avax',
      decimals: 18,
    },
    {
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      symbol: 'USDT',
      name: 'TetherToken',
      decimals: 6,
    },
    {
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      symbol: 'DAIe',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x63a72806098Bd3D9520cC43356dD78afe5D386D9',
      symbol: 'AAVEe',
      name: 'Aave Token',
      decimals: 18,
    },
    {
      address: '0xEc6adef5E1006bb305bB1975333e8fc4071295bf',
      name: 'Cartesi Token',
      symbol: 'CTSI',
      decimals: 18,
    },
  ],
  [SupportedChainId.GODWOKEN]: [
    {
      address: 'native',
      symbol: 'CKB',
      name: 'CKB',
      decimals: 18,
    },
  ],
  [SupportedChainId.AURORA]: [
    {
      address: 'native',
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
  ],
  [SupportedChainId.FANTOM]: [
    {
      address: 'native',
      symbol: 'FTM',
      name: 'FTM',
      decimals: 18,
    },
    {
      address: '0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B',
      symbol: 'AAVE',
      name: 'Aave',
      decimals: 18,
    },
    {
      address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x657A1861c15A3deD9AF0B6799a195a249ebdCbc6',
      symbol: 'CREAM',
      name: 'Cream',
      decimals: 18,
    },
    {
      address: '0xe1146b9AC456fCbB60644c36Fd3F868A9072fc6E',
      symbol: 'FBTC',
      name: 'fBTC',
      decimals: 18,
    },
    {
      address: '0x658b0c7613e890EE50B8C4BC6A3f41ef411208aD',
      symbol: 'FETH',
      name: 'fETH',
      decimals: 18,
    },
    {
      address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
  ],
  [SupportedChainId.GNOSIS]: [
    {
      address: 'native',
      symbol: 'xDai',
      name: 'xDai',
      decimals: 18,
    },
    {
      address: '0xdd96B45877d0E8361a4DDb732da741e97f3191Ff',
      symbol: 'BUSD',
      name: 'BUSD Token on xDai',
      decimals: 18,
    },
    {
      address: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
      symbol: 'USDC',
      name: ' USD//C on xDai',
      decimals: 6,
    },
    {
      address: '0x256eb8a51f382650B2A1e946b8811953640ee47D',
      symbol: 'DATA',
      name: 'Streamr',
      decimals: 18,
    },
    {
      address: '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
      symbol: 'GNO',
      name: 'Gnosis Token on xDai',
      decimals: 18,
    },
    {
      address: '0xFAdc59D012Ba3c110B08A15B7755A5cb7Cbe77D7',
      symbol: 'GRT',
      name: 'Graph Token on xDai',
      decimals: 18,
    },
    {
      address: '0x9fB1d52596c44603198fB0aee434fac3a679f702',
      symbol: 'jEUR',
      name: 'Jarvis Synthetic Euro',
      decimals: 18,
    },
  ],
  [SupportedChainId.MOONBEAM]: [
    {
      address: 'native',
      symbol: 'GLMR',
      name: 'GLMR',
      decimals: 18,
    },
    {
      address: '0xc234A67a4F840E61adE794be47de455361b52413',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
    {
      address: '0x0E358838ce72d5e61E0018a2ffaC4bEC5F4c88d2',
      symbol: 'STELLA',
      name: 'StellaSwap',
      decimals: 18,
    },
    {
      address: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    {
      address: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
    },
  ],
  [SupportedChainId.OASIS_EMERALD]: [
    {
      address: 'native',
      symbol: 'ROSE',
      name: 'Oasis Network',
      decimals: 18,
    },
  ],
  [SupportedChainId.OASIS_SAPPHIRE]: [
    {
      address: 'native',
      symbol: 'ROSE',
      name: 'Oasis Sapphire Network',
      decimals: 18,
    },
  ],
  [SupportedChainId.FUSE]: [
    {
      address: 'native',
      symbol: 'FUSE',
      name: 'FUSE',
      decimals: 18,
    },
    {
      address: '0x6a5f6a8121592becd6747a38d67451b310f7f156',
      symbol: 'BUSD',
      name: 'Binance USD on Fuse',
      decimals: 18,
    },
    {
      address: '0x249be57637d8b013ad64785404b24aebae9b098b',
      symbol: 'fUSD',
      name: 'Fuse Dollar',
      decimals: 18,
    },
    {
      address: '0x38bc6110cd10bf396e67d54adb9aa8de8426c8bf',
      symbol: 'GDD',
      name: 'GoodDollar',
      decimals: 18,
    },
  ],
};

// Prevent crash after change network without tokens TODO: Remove when we add all tokens
export const filterEmptyToken = (obj: TokensMap) => {
  return Object.entries(obj)
    .filter(([_, value]) => value.length)
    .map(([key, value]) => ({ [key]: value }));
};
