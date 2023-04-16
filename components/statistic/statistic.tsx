import { useEffect, useState } from 'react';
import axios from 'axios';
import { defaultAbiCoder } from '@ethersproject/abi';
import { hexDataSlice } from '@ethersproject/bytes';
import { geTokensByChainId, getChainNameById, getHumanValue } from '@/utils';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NetworkInfo, updateStatisticInfo } from '@/state/statistic/reducer';
import { TOKENS } from '@/constants/tokens';
import { MULTI_SEND_CONTRACTS } from '@/constants/addresses';
import { SupportedChainId } from '@/constants/chains';
import { formatNetworks } from '@/helpers/stringUtils';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';

const METHOD_ID = '0x9749c04a';

export const StatisticComponent = () => {
  const [toggle, setToggle] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dispatch = useDispatch();

  const filterButtons = [
    { name: 'This Day', period: 'day', isSelected: false },
    { name: 'This Week', period: 'week', isSelected: false },
    { name: 'This Month', period: 'month', isSelected: false },
    { name: 'This Year', period: 'year', isSelected: false },
  ];

  const [state, setState] = useState<any>();
  const [buttonsState, setButtonsState] = useState(filterButtons);

  const [state1, setState1] = useState<any>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);

  dayjs.extend(isBetween);
  dayjs.extend(isToday);

  const statisticInfo = useSelector(({ statistic }: any) => statistic.netwtorksStatistic);

  const getNetworkTransactions = async (url: string, chainId: number) => {
    const amounts: string[] = [];
    const { data } = await axios.get(url);

    if (data.status === '1') {
      const sortedTransactions = data.result.filter(({ methodId }: any) => methodId === METHOD_ID);

      sortedTransactions.forEach((item: any) => {
        amounts.push(
          defaultAbiCoder
            .decode(['address[]', 'uint256[]'], hexDataSlice(item.input, 4))[1]
            .toString(),
        );
      });

      const newArr = amounts.flatMap((item) => {
        if (item.includes(',')) {
          return item.split(',');
        } else {
          return item;
        }
      });

      let totalSum = newArr.reduce((acc, val) => Number(acc) + Number(val), 0);

      dispatch(
        updateStatisticInfo({
          networkInfo: {
            network: getChainNameById(chainId),
            currency: geTokensByChainId(TOKENS, chainId)[0].symbol,
            numberOfTransactions: sortedTransactions.length,
            totalAmount: getHumanValue(Number(totalSum).toString()).toString(),
            transactions: sortedTransactions,
          },
        }),
      );
    }
  };

  useEffect(() => {
    getNetworkTransactions(
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.POLYGON]
      }&startblock=0&endblock=99999999&sort=desc`,
      SupportedChainId.POLYGON,
    );
    getNetworkTransactions(
      `https://api.bscscan.com/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.BSC]
      }&startblock=0&endblock=99999999&page=1&sort=asc`,
      SupportedChainId.BSC,
    );
    getNetworkTransactions(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.MAINNET]
      }&startblock=0&endblock=99999999&page=1&sort=asc`,
      SupportedChainId.MAINNET,
    );
    getNetworkTransactions(
      `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.OPTIMISM]
      }&startblock=0&endblock=99999999&page=1&sort=asc`,
      SupportedChainId.OPTIMISM,
    );
    getNetworkTransactions(
      `https://api.celoscan.io/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.CELO]
      }&startblock=0&endblock=99999999&page=1&sort=asc`,
      SupportedChainId.CELO,
    );
    getNetworkTransactions(
      `https://api.ftmscan.com/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.FANTOM]
      }&startblock=0&endblock=99999999&page=1&sort=asc`,
      SupportedChainId.FANTOM,
    );
    getNetworkTransactions(
      `https://api.gnosisscan.io/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.GNOSIS]
      }&startblock=0&endblock=99999999&page=1&sort=asc`,
      SupportedChainId.GNOSIS,
    );
    getNetworkTransactions(
      `https://api-moonbeam.moonscan.io/api?module=account&action=txlist&address=${
        MULTI_SEND_CONTRACTS[SupportedChainId.MOONBEAM]
      }&startblock=0&endblock=99999999&page=1&sort=asc`,
      SupportedChainId.MOONBEAM,
    );
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'network',
      headerName: 'Network',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) => `${formatNetworks(params.row.network)}`,
    },
    {
      field: 'totalAmount',
      headerName: 'Transaction amount',
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.totalAmount} ${params.row.currency}`,
    },
    {
      field: 'numberOfTransactions',
      headerName: 'Number of transactions',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
    },
  ];

  const sortDate = (period: string, selected: any = []) => {
    const newArray = statisticInfo.map((element: NetworkInfo) => {
      const amounts: string[] = [];
      let zxc: any = [];

      switch (period) {
        case 'day':
          zxc = element.transactions.filter((transaction) => {
            dayjs.unix(transaction.timeStamp).isToday();
            setState({ startData: dayjs().startOf(period), endData: dayjs().endOf(period) });
          });
          break;
        case 'week':
        case 'month':
        case 'year':
          zxc = element.transactions.filter((transaction) =>
            dayjs
              .unix(transaction.timeStamp)
              .isBetween(dayjs().startOf(period), dayjs().endOf(period)),
          );
          setState({ startData: dayjs().startOf(period), endData: dayjs().endOf(period) });
          break;
        case 'custom':
          zxc = element.transactions.filter((transaction) =>
            dayjs
              .unix(transaction.timeStamp)
              .isBetween(dayjs(selected[0].startDate), dayjs(selected[0].endDate)),
          );
          setState({
            startData: dayjs(selected[0].startDate),
            endData: dayjs(selected[0].endDate),
          });
          break;

        default:
          break;
      }

      zxc.forEach((item: any) => {
        amounts.push(
          defaultAbiCoder
            .decode(['address[]', 'uint256[]'], hexDataSlice(item.input, 4))[1]
            .toString(),
        );
      });

      const newArr = amounts.flatMap((item) => {
        if (item.includes(',')) {
          return item.split(',');
        } else {
          return item;
        }
      });

      let totalSum = newArr.reduce((acc, val) => Number(acc) + Number(val), 0);

      dispatch(
        updateStatisticInfo({
          networkInfo: {
            network: element.network,
            currency: element.currency,
            totalAmount: getHumanValue(Number(totalSum).toString()).toString(),
            numberOfTransactions: zxc.length,
            transactions: element.transactions,
          },
        }),
      );
    });
  };

  return (
    <Grid mt={5}>
      {/* <Stack>
        <Button onClick={() => setToggle((prev) => !prev)}>Toggle</Button>
      </Stack> */}
      <Grid container spacing={3} mt={1}>
        {toggle ? (
          <Grid item xs={9}>
            <Stack height="70vh" width="100%">
              <DataGrid
                rows={statisticInfo.map((item: NetworkInfo, index: number) => ({
                  ...item,
                  id: index,
                }))}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[100]}
              />
            </Stack>
          </Grid>
        ) : (
          <Grid item xs={9}>
            <Stack height="70vh" width="100%">
              Графики))00
            </Stack>
          </Grid>
        )}
        <Grid item xs={3} sx={{ '.rdrDefinedRangesWrapper': { display: 'none' } }}>
          <Typography mb={1}>
            Filtered by date: <br /> {dayjs(state?.startData).format('DD/MM/YYYY')} -{' '}
            {dayjs(state?.endData).format('DD/MM/YYYY')}
          </Typography>

          <Stack gap={1} position="relative">
            {buttonsState.map(({ name, period, isSelected }) => (
              <Button
                sx={{ background: isSelected ? 'rgb(0, 172, 172)' : '#007994' }}
                key={period}
                onClick={() => {
                  const item = buttonsState.filter((item) => item.name !== name);
                  sortDate(period);
                  setButtonsState(() =>
                    buttonsState.map((item) =>
                      item.period === period
                        ? { ...item, isSelected: true }
                        : { ...item, isSelected: false },
                    ),
                  );
                }}
              >
                {name}
              </Button>
            ))}
            <Button
              onClick={() => {
                setIsCalendarOpen((prev) => !prev);
                setButtonsState(() => buttonsState.map((item) => ({ ...item, isSelected: false })));
              }}
            >
              Custom Period
            </Button>
            {isCalendarOpen && (
              <DateRangePicker
                onChange={(item) => {
                  setState1([item.selection]);
                  sortDate('custom', [item.selection]);
                  if (item.selection.startDate !== item.selection.endDate) {
                    setIsCalendarOpen(false);
                    setState1([
                      {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection',
                      },
                    ]);
                  }
                }}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={state1}
                direction="horizontal"
                staticRanges={[]}
                inputRanges={[]}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};
