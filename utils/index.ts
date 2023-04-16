import BigNumber from 'bignumber.js';
import { AddressMap } from '@/constants/addresses';
import { CHAIN_IDS_TO_NAMES, DEFAULT_CHAIN_ID, SupportedChainId } from '@/constants/chains';
import { getAddress } from '@ethersproject/address';
import { Contract, ContractFunction } from '@ethersproject/contracts';
import type { JsonRpcSigner, JsonRpcProvider, Web3Provider } from '@ethersproject/providers';

import { BigNumber as BigNumberETH } from '@ethersproject/bignumber';
import { TokensMap } from '@/constants/tokens';
import { parseUnits } from '@ethersproject/units';
import { NumberLiteralType } from 'typescript';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

const parseMetamaskError = (err: Error | any) => {
  const parsedErrorObject = JSON.parse(JSON.stringify(err));
  return {
    code: parsedErrorObject.code,
    message: err.reason,
  };
};

export const DEFAULT_DECIMAL: number = 18;

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// account is not optional
export const getSigner = (provider: JsonRpcProvider, account: string): JsonRpcSigner =>
  provider.getSigner();

export const getSignerSapphire = (provider: JsonRpcProvider, account?: string): JsonRpcSigner =>
  sapphire.wrap(provider.getSigner());
// export const getSigner = (provider: Web3Provider, account: string): JsonRpcSigner =>
//   provider.getSigner(account).connectUnchecked();

// account is optional
export const getProviderOrSigner = (
  provider: JsonRpcProvider,
  account?: string,
): JsonRpcProvider | JsonRpcSigner => (account ? getSigner(provider, account) : provider);

// account is optional
export const getContract = (
  address: string,
  ABI: any,
  provider: JsonRpcProvider | undefined,
  account?: string,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, provider && (getProviderOrSigner(provider, account) as any));
};

export const getContractSapphire = (
  address: string,
  ABI: any,
  provider: JsonRpcProvider | undefined,
  account?: string,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, provider && (sapphire.wrap(provider) as any));
};

export const getContractSapphireSigned = (
  address: string,
  ABI: any,
  provider: JsonRpcProvider | undefined,
  account?: string,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, provider && (getSignerSapphire(provider, account) as any));
};

export const getSignContract = (
  address: string,
  ABI: any,
  provider: JsonRpcProvider | undefined,
  account?: string,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, provider && account && (getSigner(provider, account) as any));
};

export const getSignContractSapphire = (
  address: string,
  ABI: any,
  provider: JsonRpcProvider | undefined,
  account?: string,
): Contract => {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    provider && account && (getSignerSapphire(provider, account) as any),
  );
};

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const getAddressByChainId = (address: AddressMap, chainId: number | undefined) =>
  chainId && address[chainId] ? address[chainId] : address[DEFAULT_CHAIN_ID];

export const geTokensByChainId = (tokens: TokensMap, chainId: number | undefined) =>
  chainId && tokens[chainId] ? tokens[chainId] : tokens[DEFAULT_CHAIN_ID];

export const getChainNameById = (chainId: SupportedChainId): string => CHAIN_IDS_TO_NAMES[chainId];

// add 25%
export const calculateGasMargin = (value: BigNumberETH): BigNumberETH =>
  value.mul(BigNumberETH.from(10000).add(BigNumberETH.from(2500))).div(BigNumberETH.from(10000));

// add 0.1%
export const calculateCommissionFee = (value: BigNumberETH, percent: number = 10): BigNumberETH =>
  value.mul(BigNumberETH.from(10000).add(BigNumberETH.from(percent))).div(BigNumberETH.from(10000));

export const getCommissionFee = (value: BigNumberETH, percent: number = 10): BigNumberETH =>
  value.mul(BigNumberETH.from(percent)).div(BigNumberETH.from(10000));

export const subBigNumber = (value: BigNumberETH, value2: BigNumberETH): BigNumberETH =>
  value.sub(value2);

export const buildQuery = async <T>(
  method: ContractFunction,
  args: any[] = [],
  estimateGas?: ContractFunction | null,
  options: any = {},
): Promise<T | any> => {
  let tx;
  try {
    if (estimateGas) {
      const gasLimit = await estimateGas(...args, options);
      tx = await method(...args, {
        gasLimit: calculateGasMargin(gasLimit as BigNumberETH),
        ...options,
      });
    } else {
      tx = await method(...args, options);
    }
    if (tx?.wait) {
      await tx.wait();
    }
  } catch (err: any) {
    console.log('buildQuery Error', err);

    return parseMetamaskError(err);
  }

  return tx;
};

// export function convertScientificToNormal(num: number): string {
//   const expStr = num.toExponential();
//   const [mantissa, exponent] = expStr.split('e');
//   const coef = Math.abs(parseFloat(mantissa));
//   const exp = parseInt(exponent);
//   const sign = num < 0 ? '-' : '';
//   let numStr = '';

//   if (exp >= 0) {
//     numStr = coef.toFixed(exp + 1).replace('.', '');
//   } else {
//     numStr = '0.' + '0'.repeat(Math.abs(exp) - 1) + coef.toString().replace('.', '');
//   }

//   return sign + numStr;
// }

export function getExponentValue(decimals: number): BigNumber {
  return new BigNumber(10).pow(decimals);
}

export function getHumanValue(value: string, decimals: number = DEFAULT_DECIMAL): BigNumber {
  return new BigNumber(value).div(getExponentValue(decimals));
}

export function getNonHumanValue(value: number | string, decimals: number): BigNumberETH {
  if (typeof value !== 'string') {
    value = value.toString();
  }
  return parseUnits(value.toString(), decimals);
}

export function getNonHumanValueSumm(amounts: string[]): BigNumberETH {
  return amounts.reduce((acc: BigNumberETH, amount: string) => {
    return BigNumberETH.from(acc).add(BigNumberETH.from(amount));
  }, BigNumberETH.from(0));
}

export const calculateDecimalsPlaces = (value: string, decimals: number): boolean => {
  let decimalPart = value.split('.')[1];
  let decimalPlaces = decimalPart ? decimalPart.length : 0;
  return decimalPlaces > decimals;
};

export const removeArrayDuplicates = (arr: any[], prop: string) => {
  const uniqueArr = [];
  const ids: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    const currentObj = arr[i];
    if (!ids.includes(currentObj[prop])) {
      uniqueArr.push(currentObj);
      ids.push(currentObj[prop]);
    }
  }

  return uniqueArr;
};

export const getUniqueTokens = (pairs: any[]) => {
  const tokensSet = new Set();

  pairs.forEach((pair) => {
    tokensSet.add(pair.token0);
    tokensSet.add(pair.token1);
  });

  const tokensArray = removeArrayDuplicates(Array.from(tokensSet), 'id');

  const newArr = removeArrayDuplicates(tokensArray, 'symbol').filter(
    (item) => +item.decimals >= 6 && checkForNumbersAndSpecialSymbolsString(item.symbol),
  );

  return newArr;
};

function checkForNumbersAndSpecialSymbolsString(string: string): boolean {
  for (let i = 0; i < string.length; i++) {
    if (!isNaN(Number(string[i])) || !/^[a-zA-Z]+$/.test(string[i])) {
      return false;
    }
  }
  return true;
}
