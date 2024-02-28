import { createSlice } from '@reduxjs/toolkit';

interface StakingState {
  collections: Array<any>;
  unstakedTokens: Array<any>;
  allTokens: Array<any>;
  stakings: Array<any>;
  collectionTokens: any;
  collectionIndex: number;
  owner: string;
  unstakeFee: string;
}

const initialState: StakingState = {
  collections: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  unstakedTokens: [],
  allTokens: [],
  stakings: [],
  collectionTokens: [],
  collectionIndex: 0,
  owner: "",
  unstakeFee: "",
}

export const stakingSlice = createSlice({
  name: 'staking',
  initialState,
  reducers: {
    setCollections: (state, action) => {
      if (action.payload) {
        state.collections = action.payload as Array<any>;
      }
    },
    setAllTokens: (state, action) => {
      if (action.payload) {
        state.allTokens = action.payload as Array<any>;
      }
    },
    setUnstakedTokens: (state, action) => {
      if (action.payload) {
        state.unstakedTokens = action.payload as Array<any>;
      }
    },
    setStakings: (state, action) => {
      if (action.payload) {
        state.stakings = action.payload as Array<any>;
      }
    },
    setCollectionToken: (state, action) => {
      if (action.payload) {
        const { collectionIndex, token_id } = action.payload;
        if (!state.collectionTokens[collectionIndex]) state.collectionTokens[collectionIndex] = {};
        state.collectionTokens[collectionIndex][token_id] = action.payload.token;
      }
    },
    setCollectionIndex: (state, action) => {
      state.collectionIndex = action.payload;
    },
    setOwner: (state, action) => {
      state.owner = action.payload;
    },
    setUnstakeFee: (state, action) => {
      state.unstakeFee = action.payload;
    },
  }
})

export const {
  setCollections,
  setUnstakedTokens,
  setStakings,
  setAllTokens,
  setCollectionToken,
  setCollectionIndex,
  setOwner,
  setUnstakeFee,
} = stakingSlice.actions;

export default stakingSlice.reducer;