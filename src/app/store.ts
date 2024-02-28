import { configureStore } from '@reduxjs/toolkit';
import configSlice from './stores/configSlice';
import stakingSlice from './stores/stakingSlice';

export default configureStore({
  reducer: {
    config: configSlice,
    staking: stakingSlice,
  }
});