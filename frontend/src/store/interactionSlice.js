import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchInteractions, createInteraction } from "../api/client";

export const loadInteractions = createAsyncThunk(
  "interaction/loadInteractions",
  async () => {
    const data = await fetchInteractions();
    return data;
  }
);

export const saveInteraction = createAsyncThunk(
  "interaction/saveInteraction",
  async (formData) => {
    const data = await createInteraction(formData);
    return data;
  }
);

const interactionSlice = createSlice({
  name: "interaction",
  initialState: {
    form: {},
    interactions: [],
    loading: false,
    error: null
  },
  reducers: {
    updateField: (state, action) => {
      state.form[action.payload.name] = action.payload.value;
    },
    resetForm: (state) => {
      state.form = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInteractions.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.interactions = action.payload;
      })
      .addCase(loadInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { updateField, resetForm } = interactionSlice.actions;
export default interactionSlice.reducer;
