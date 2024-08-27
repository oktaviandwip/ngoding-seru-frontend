import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserProfile = {
  Id: string;
  Email: string;
  Password: string;
  Phone_number: string;
  Role: string;
  Image: string;
  Address: string;
  Full_name: string;
  Birthday: string;
  Gender: string;
  Highest_score: string;
  Created_at: string;
  Updated_at: string | null;
};

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
    },
  },
});

export const { getProfile } = userSlice.actions;
export default userSlice.reducer;
