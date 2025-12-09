import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//° Sección donde creamos las acciones asincronas
// Creamos una accion asincrona y la exportamos para hacer la peticion a la API
export const exampleSliceFunction = createAsyncThunk(
  "example/fetchExample",
  async ({arg1, arg2}, thunkAPI) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/${arg1}/${arg2}`);
      return response.json();
    } catch (error) {
  return thunkAPI.rejectWithValue(error.message);
    }
  }
)

// Creamos el slice
const exampleSlice = createSlice({
  // Nombre del slice
  name: "example",
  // Estado inicial
  initialState: {
    data: [],
    error: null,
  },
  // Reducers sincronos para manejar los estados
  reducers: {
    addData: (state, action) => {
     state.data = action.payload;
    }
  },
  // Reducers asincronos para manejar los estados
  extraReducers: (builder) => {
    builder
      // Cuando la peticion esta en proceso
      .addCase(exampleSliceFunction.pending, (state) => {
        state.error = null;
        state.data = [];
      })
      // Cuando la peticion se completa
      .addCase(exampleSliceFunction.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      // Cuando la peticion falla
      .addCase(exampleSliceFunction.rejected, (state, action) => {
        state.error = action.payload || 'Unknown error';
      })
  }
})

// Exportamos las acciones sincronas
export const { addData } = exampleSlice.actions;

// Las acciones asincronas ya se exportan por defecto en la parte superior del documento

// Exportamos el reducer para usarlo en el store
export default exampleSlice.reducer;