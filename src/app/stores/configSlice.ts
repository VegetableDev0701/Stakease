import { createSlice } from '@reduxjs/toolkit';

interface Config {
  name: string;
  avatar: string;
}

const initialState: Config = {
  name: "StakEaseWasTaken",
  avatar: "https://i.imgur.com/4RJ0DDv.png"
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
      localStorage.setItem("name", state.name);
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
      localStorage.setItem("avatar", state.avatar);
    },
  }
})

export const { setName, setAvatar } = configSlice.actions;

export default configSlice.reducer;