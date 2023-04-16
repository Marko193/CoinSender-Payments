import { createSlice } from '@reduxjs/toolkit';

export interface NetworkInfo {
  network?: string;
  currency?: string;
  totalAmount: string;
  numberOfTransactions: number;
  transactions: any[];
}

export interface NetworksStatistic {
  netwtorksStatistic: NetworkInfo[];
}

export const initialState: NetworksStatistic = {
  netwtorksStatistic: [],
};

const statisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {
    updateStatisticInfo(state, { payload: { networkInfo } }) {
      const notDublicatedNetwork = state.netwtorksStatistic.filter(
        (item) => item.network !== networkInfo.network,
      );

      state.netwtorksStatistic = [...notDublicatedNetwork, networkInfo];
    },
  },
});

export const { updateStatisticInfo } = statisticSlice.actions;
export default statisticSlice.reducer;
