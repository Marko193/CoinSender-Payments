import { isAddress } from '@/utils';

export const makeShortenWalletAddress = (address = '') =>
  address.slice(0, 9) + '...' + address.slice(-4);

const amountRegex = /^([9]|[1-9][0-9]{0,18}|0[.]{1}[0-9]{1,18}|[1-9][0-9]{0,18}[.]{1}[0-9]{1,18})$/;

export const validateWallets = async (array = [], setError: any) => {
  let wallets = new Set();
  let errors: any = {
    duplicateWallet: [],
    invalidWallet: [],
    invalidAmount: [],
  };

  array.forEach((item: any) => {
    if (!isAddress(item.wallet)) {
      errors.invalidWallet.push(item.wallet);
    }
    if (wallets.has(item.wallet) && item.wallet !== '') {
      errors.duplicateWallet.push(item.wallet);
    } else {
      wallets.add(item.wallet);
    }
    if (!amountRegex.test(item.amount) || item.amount === '' || item.amount === null) {
      errors.invalidAmount.push(item.amount == '0' ? item.amount : 'empty field');
    }
  });

  if (
    errors.duplicateWallet.length > 0 ||
    errors.invalidWallet.length > 0 ||
    errors.invalidAmount.length > 0
  ) {
    let errorMessage =
      errors.duplicateWallet.length || errors.invalidWallet.length || errors.invalidAmount.length
        ? 'Invalid data found: '
        : '';
    if (errors.invalidWallet.length > 0) {
      errorMessage += '\n— Field «Wallet» must contain a valid wallet. ';
    }
    if (errors.duplicateWallet.length > 0) {
      const uniqueWallets = new Set(errors.duplicateWallet);
      errorMessage +=
        '\n— duplicate wallet address(es) were found: (' + [...uniqueWallets].join(', ') + ')';
    }
    if (errors.invalidAmount.length > 0) {
      errorMessage += `\n— Field «Amount» must contain a number, a valid delimiter is a dot (0.01), but your value(${errors.invalidAmount.join(
        ', ',
      )}):`;
    }
    errorMessage += '\nPlease double check and make sure they are correct.';
    setError(errorMessage);
    return false;
  }

  return true;
};

export const formatNetworks = (str: string): string => {
  const words = str.split('_').map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });
  return words.join(' ');
};

export const ucFirst = (str: string) => {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
};
