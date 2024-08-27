import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserStat = {
  Total_score: string;
  Highest_score: string;
  Rank: string;
  Count: string;
}

interface UserState {
  stat: UserStat | null;
}

const initialState: UserState = {
  stat: null,
};

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {
    getStat(state, action: PayloadAction<UserStat | null>) {
      state.stat = action.payload;
    },
  },
});

export const { getStat } = statSlice.actions;
export default statSlice.reducer;
