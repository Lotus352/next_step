import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type LocationType from "@/types/location-type";
import { DEFAULT_LOCATION_SIZE, DEFAULT_PAGE } from "@/constants";

/* ---------- State ---------- */
interface PageResp {
  content: LocationType[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface LocationsState extends PageResp {
  countries: string[];
  cities: string[];
  states: string[];
  selected: LocationType | null;
  status: "idle" | "loading" | "failed";
}

const initialState: LocationsState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  countries: [],
  cities: [],
  states: [],
  selected: null,
  status: "idle",
};

/* ---------- Thunks ---------- */
export const fetchLocations = createAsyncThunk<
    PageResp,
    { page?: number; size?: number }
>("locations/fetch", async ({ page = DEFAULT_PAGE, size = DEFAULT_LOCATION_SIZE } = {}) => {
  const { data } = await axiosClient.get("/api/locations", { params: { page, size } });
  return {
    content: data.content,
    totalPages: data.totalPages,
    page: data.number,
    totalElements: data.totalElements,
  };
});

export const fetchCountries = createAsyncThunk<string[]>(
    "locations/fetchCountries",
    async () => {
      const { data } = await axiosClient.get("/api/locations/countries");
      return data;
    },
);

export const fetchCities = createAsyncThunk<
    string[],
    string | void
>("locations/fetchCities", async (country = "all") => {
  const { data } = await axiosClient.get("/api/locations/cities", { params: { country } });
  return data;
});

export const fetchStates = createAsyncThunk<
    string[],
    string | void
>("locations/fetchStates", async (country = "all") => {
  const { data } = await axiosClient.get("/api/locations/states", { params: { country } });
  return data;
});

export const fetchLocationById = createAsyncThunk<LocationType, number>(
    "locations/fetchById",
    async (id) => {
      const { data } = await axiosClient.get(`/api/locations/${id}`);
      return data;
    },
);

export const addLocation = createAsyncThunk<LocationType, Partial<LocationType>>(
    "locations/add",
    async (body) => {
      const { data } = await axiosClient.post("/api/locations", body);
      return data;
    },
);

export const updateLocation = createAsyncThunk<LocationType, { id: number; body: Partial<LocationType> }>(
    "locations/update",
    async ({ id, body }) => {
      const { data } = await axiosClient.put(`/api/locations/${id}`, body);
      return data;
    },
);

export const deleteLocation = createAsyncThunk<number, number>(
    "locations/delete",
    async (id) => {
      await axiosClient.delete(`/api/locations/${id}`);
      return id;
    },
);

/* ---------- Slice ---------- */
const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (b) => {
    b
        /* list */
        .addCase(fetchLocations.pending, (s) => { s.status = "loading"; })
        .addCase(fetchLocations.fulfilled, (s, a) => {
          Object.assign(s, a.payload, { status: "idle" });
        })
        .addCase(fetchLocations.rejected, (s) => { s.status = "failed"; })

        /* countries */
        .addCase(fetchCountries.fulfilled, (s, a) => { s.countries = a.payload; })

        /* cities */
        .addCase(fetchCities.fulfilled, (s, a) => { s.cities = a.payload; })

        /* detail */
        .addCase(fetchLocationById.fulfilled, (s, a) => { s.selected = a.payload; })

        /* states */
        .addCase(fetchStates.fulfilled, (s, a) => { s.states = a.payload; })

        /* add */
        .addCase(addLocation.fulfilled, (s, a) => {
          s.content.unshift(a.payload);
          s.totalElements += 1;
        })

        /* update */
        .addCase(updateLocation.fulfilled, (s, a) => {
          if (s.selected && String(s.selected.locationId) === String(a.payload.locationId)) {
            s.selected = a.payload;
          }
        })

        /* delete */
        .addCase(deleteLocation.fulfilled, (s, a) => {
          s.content = s.content.filter((x) => String(x.locationId) !== String(a.payload));
          if (s.selected && String(s.selected.locationId) === String(a.payload)) {
            s.selected = null;
          }
        });
  },
});

export const { clear } = locationsSlice.actions;
export default locationsSlice.reducer;
