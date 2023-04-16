export interface SerializedToken {
  decimals: string;
  id: string;
  name: string;
  symbol: string;
  volume?: string;
  volumeUSD?: string;
}

export interface SerializedPair {
  id: string;
  name: string;
  token0: SerializedToken;
  tokenPrice0: string;
  token1: SerializedToken;
  tokenPrice1: string;
  volumeToken0: string;
  volumeToken1: string;
  volumeUSD: string;
}
