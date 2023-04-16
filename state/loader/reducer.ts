import { createSlice } from '@reduxjs/toolkit';

export interface LoaderState {
  isLoading: boolean;
  text?: string;
}

export const initialState: LoaderState = {
  isLoading: false,
  text: '',
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    updateLoaderState(state, { payload: { isLoading, text } }) {
      state.isLoading = isLoading;
      state.text = text;
    },
  },
});

export const { updateLoaderState } = loaderSlice.actions;
export default loaderSlice.reducer;
