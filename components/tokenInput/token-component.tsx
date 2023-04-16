import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './token.module.scss';
import { Autocomplete, Button, FormControl, Stack, TextField } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getHumanValue } from '@/utils/index';

interface ITokenInput {
  token1: any;
  token2: any;
  value: any;
  allTokens: any[];
  balance: string;
  tokenBalance: string;
  isNative: boolean;
  tokenValue: string | number;
  tokenDecimals: number | undefined;
  fetchAmounts: (arg: any) => void;
  handleFirstTokenNumber: (arg: any) => void;
  setToken2: (arg: any) => void;
  setToken1: (arg: any) => void;
  setTokenAddr2: (arg: any) => void;
  setTokenAddr1: (arg: any) => void;
  setActiveInput: (arg: any) => void;
  first?: boolean;
}

export function TokenInput({
  token1,
  token2,
  value,
  allTokens,
  balance,
  tokenBalance,
  isNative,
  tokenValue,
  tokenDecimals,
  fetchAmounts,
  handleFirstTokenNumber,
  setToken2,
  setToken1,
  setTokenAddr2,
  setTokenAddr1,
  setActiveInput,
  first = false,
}: ITokenInput) {
  const currentBalance =
    tokenBalance && !isNative
      ? (+getHumanValue(tokenBalance.toString(), tokenDecimals).toString()).toFixed(3)
      : isNative
      ? (+getHumanValue(balance.toString(), 18).toString()).toFixed(3)
      : '0';

  return (
    <>
      <div className={styles.swap_block}>
        <div className={styles.swap_block_content}>
          <div className={styles.swap_block_row}>
            <TextField
              variant="standard"
              className={styles.tokens_number}
              sx={{
                input: {
                  height: '36px',
                  fontSize: '36px',
                },
              }}
              InputProps={{ disableUnderline: true }}
              onChange={(e: any) => {
                if (!!token1 && !!token2 && !!tokenValue) {
                }
                if (!first) {
                  setActiveInput(true);
                } else {
                  setActiveInput(false);
                }
                fetchAmounts(e.target.value);
                handleFirstTokenNumber(e);
              }}
              value={tokenValue}
              placeholder="0"
            />
            <Stack mb={1} sx={{ width: '30%' }}>
              <FormControl fullWidth size="small">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  disableClearable
                  size="small"
                  options={allTokens}
                  value={value}
                  getOptionLabel={({ symbol }: any) => symbol}
                  isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                  onChange={(e, value: any) => {
                    if (first) {
                      if (token2 && value.id == token2.id) {
                        setToken2(token1);
                        setToken1(value);
                        setTokenAddr2(token1.id);
                        setTokenAddr1(value.id);
                      } else {
                        setToken1(value);
                        setTokenAddr1(value.id);
                      }
                    } else {
                      if (token1 && value.id == token1.id) {
                        setToken2(token1);
                        setToken1(value);
                        setTokenAddr2(token1.id);
                        setTokenAddr1(value.id);
                      } else {
                        setToken2(value);
                        setTokenAddr2(value.id);
                      }
                    }
                  }}
                  renderInput={(params) => <TextField key={params.id} {...params} />}
                />
              </FormControl>
            </Stack>
          </div>
          <div className={styles.swap_block_row}>
            <div className={styles.tokens_amount}>{/* <span>$0</span> */}</div>
            <div className={styles.wallet_block}>
              <AccountBalanceWalletIcon />
              {currentBalance}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
