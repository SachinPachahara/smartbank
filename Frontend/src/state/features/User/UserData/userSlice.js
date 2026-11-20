import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userServices from "./userServices";

const initialState = {
  info: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  sessionExpired: false,
};

//Get User
export const getUser = createAsyncThunk(
  "user/getUser",
  async (userData, thunkAPI) => {
    try {
      return await userServices.getUser(userData);
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Update User
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, thunkAPI) => {
    try {
      return await userServices.updateUser(userData);
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Create Account Request
export const accountRequest = createAsyncThunk(
  "user/accountRequest",
  async (userData, thunkAPI) => {
    try {
      return await userServices.accountRequest(userData);
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Notification Update
export const notificationUpdate = createAsyncThunk(
  "user/notificationUpdate",
  async (payload, thunkAPI) => {
    try {
      return await userServices.notificationUpdate(payload);
    } catch (error) {
      const message = error.response.data;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//User Logout
export const userLogout = createAsyncThunk("user/logout", async () => {
  userServices.userLogout();
});

export const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    resetUserStatus: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.info = action.payload;
        state.sessionExpired = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.info = null;
        // Profile fetch failed -> invalid token / dead session
        state.sessionExpired = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
        state.sessionExpired = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Your Profile Has Been Updated Successfully!";
        state.info = action.payload;
        state.sessionExpired = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.sessionExpired = false;
      })
      .addCase(accountRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
        state.sessionExpired = false;
      })
      .addCase(accountRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.info = action.payload;
        state.sessionExpired = false;
      })
      .addCase(accountRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        // In-page form error (e.g. wrong password), NOT a session expiration
        state.sessionExpired = false;
      })
      .addCase(notificationUpdate.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
        state.sessionExpired = false;
      })
      .addCase(notificationUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.info = action.payload;
        state.sessionExpired = false;
      })
      .addCase(notificationUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.sessionExpired = false;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.info = null;
        state.sessionExpired = false;
      });
  },
});

export const { resetUserStatus } = userSlice.actions;

export default userSlice.reducer;
