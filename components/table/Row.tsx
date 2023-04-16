import { LoaderState } from '@/state/loader/reducer';
import { TableRow, TableCell, Checkbox, IconButton, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';
import { useState } from 'react';
import { isAddress } from '@/utils';

interface RowProps {
  loaderState: LoaderState;
  handleClick: (event: React.MouseEvent<unknown>, row: any, rowId: number) => void;
  isItemSelected: boolean;
  labelId: string;
  row: any;
  handleEditRow: (id: number) => void;
  handleCancelEditRow: (id: number) => void;
  handleSaveEditRow: any;
  data: any;
}

export const Row = ({
  loaderState,
  handleClick,
  isItemSelected,
  labelId,
  row,
  handleEditRow,
  handleCancelEditRow,
  handleSaveEditRow,
  data,
}: RowProps) => {
  const [inputValues, setInputValues] = useState({
    data: {
      id: row.id,
      name: row.name,
      wallet: row.wallet,
      amount: row.amount,
    },
    errors: {
      name: '',
      wallet: '',
      amount: '',
    },
  });

  const amountRegex =
    /^([9]|[1-9][0-9]{0,18}|0[.]{1}[0-9]{1,18}|[1-9][0-9]{0,18}[.]{1}[0-9]{1,18})$/;

  const isValid =
    !inputValues.errors.amount &&
    !inputValues.errors.name &&
    !inputValues.errors.wallet &&
    Boolean(inputValues.data.name && inputValues.data.wallet && inputValues.data.amount);

  const someItemIsEditing: boolean = data && data?.some(({ isEdit }: any) => isEdit);

  const handleSelectRow = (event: any) =>
    !loaderState.isLoading && !someItemIsEditing && handleClick(event, row, row.id as number);

  const handleChangeName = ({ target: { value } }: any) => {
    if (!value) {
      setInputValues({
        errors: { ...inputValues.errors, name: 'Is required' },
        data: { ...inputValues.data, name: value },
      });
    }
    if (value.length > 20) {
      setInputValues({
        errors: { ...inputValues.errors, name: 'Too large!' },
        data: { ...inputValues.data, name: value },
      });
      return;
    }
    if (value) {
      setInputValues({
        errors: { ...inputValues.errors, name: '' },
        data: { ...inputValues.data, name: value },
      });
      return;
    }
  };

  const handleChangeWallet = ({ target: { value } }: any) => {
    const wallet = data.find(({ wallet, id }: any) => id !== row.id && wallet === value);
    if (!value) {
      setInputValues({
        errors: { ...inputValues.errors, wallet: 'Is requried' },
        data: { ...inputValues.data, wallet: value },
      });
      return;
    }

    if (isAddress(value) && !wallet) {
      setInputValues({
        errors: { ...inputValues.errors, wallet: '' },
        data: { ...inputValues.data, wallet: value },
      });
      return;
    }

    if (Boolean(isAddress(value) && wallet)) {
      setInputValues({
        errors: { ...inputValues.errors, wallet: 'Wallet already exists!' },
        data: { ...inputValues.data, wallet: value },
      });
      return;
    }

    if (!isAddress(value)) {
      setInputValues({
        errors: { ...inputValues.errors, wallet: 'Is invalid' },
        data: { ...inputValues.data, wallet: value },
      });
      return;
    }
  };

  const handleChangeAmount = ({ target: { value } }: any) => {
    if (value && value.match(amountRegex)) {
      setInputValues({
        errors: { ...inputValues.errors, amount: '' },
        data: { ...inputValues.data, amount: value },
      });
    }
    if (value && !value.match(amountRegex)) {
      setInputValues({
        errors: { ...inputValues.errors, amount: 'Is invalid' },
        data: { ...inputValues.data, amount: value },
      });
    }
    if (!value) {
      setInputValues({
        errors: { ...inputValues.errors, amount: 'Is required' },
        data: { ...inputValues.data, amount: value },
      });
    }
  };

  return (
    <>
      {row.isEdit ? (
        <TableRow
          hover
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.id}
          selected={isItemSelected}
          sx={{ height: '90px' }}
        >
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={isItemSelected}
              disabled={true}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </TableCell>
          <TableCell onClick={handleSelectRow} component="th" id={labelId} scope="row">
            {row.id}
          </TableCell>
          <TableCell component="th" id={labelId} scope="row">
            <TextField
              size="small"
              sx={{ position: 'relative' }}
              defaultValue={inputValues.data.name}
              onChange={handleChangeName}
              onBlur={handleChangeName}
              error={Boolean(inputValues.errors.name)}
              helperText={inputValues.errors.name}
            />
          </TableCell>
          <TableCell align="left">
            <TextField
              size="small"
              fullWidth
              defaultValue={inputValues.data.wallet}
              onChange={handleChangeWallet}
              onBlur={handleChangeWallet}
              error={Boolean(inputValues.errors.wallet)}
              helperText={inputValues.errors.wallet}
            />
          </TableCell>
          <TableCell align="left">
            <TextField
              size="small"
              defaultValue={inputValues.data.amount}
              onChange={handleChangeAmount}
              onBlur={handleChangeAmount}
              error={Boolean(inputValues.errors.amount)}
              helperText={inputValues.errors.amount}
            />
          </TableCell>
          <TableCell align="left">
            {row.date ? moment(row.date).format('MMMM Do YYYY, h:mm:ss a') : 'No transaction yet'}
          </TableCell>
          <TableCell align="left">
            <IconButton
              size="small"
              disabled={!isValid}
              onClick={() => handleSaveEditRow(inputValues.data)}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setInputValues({
                  data: {
                    id: row.id,
                    name: row.name,
                    wallet: row.wallet,
                    amount: row.amount,
                  },
                  errors: {
                    name: '',
                    wallet: '',
                    amount: '',
                  },
                });
                handleCancelEditRow(row.id);
              }}
            >
              <ClearIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow
          hover
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.id}
          selected={isItemSelected}
        >
          <TableCell onClick={handleSelectRow} padding="checkbox">
            <Checkbox
              color="primary"
              checked={isItemSelected}
              disabled={loaderState.isLoading || someItemIsEditing}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </TableCell>
          <TableCell onClick={handleSelectRow} component="th" id={labelId} scope="row">
            {row.id}
          </TableCell>
          <TableCell onClick={handleSelectRow} component="th" id={labelId} scope="row">
            {row.name}
          </TableCell>
          <TableCell onClick={handleSelectRow} align="left">
            {row.wallet}
          </TableCell>
          <TableCell onClick={handleSelectRow} align="left">
            {row.amount}
          </TableCell>
          <TableCell onClick={handleSelectRow} align="left">
            {row.date ? moment(row.date).format('MMMM Do YYYY, h:mm:ss a') : 'No transaction yet'}
          </TableCell>
          <TableCell align="left">
            <IconButton
              onClick={() => {
                setInputValues({
                  data: {
                    id: row.id,
                    name: row.name,
                    wallet: row.wallet,
                    amount: row.amount,
                  },
                  errors: {
                    name: '',
                    wallet: '',
                    amount: '',
                  },
                });
                handleEditRow(row.id);
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
