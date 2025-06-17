import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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

    statuses: {
        fetching: "idle" | "loading" | "failed" | "succeeded";
        fetchingById: "idle" | "loading" | "failed" | "succeeded";
        fetchingCountries: "idle" | "loading" | "failed" | "succeeded";
        fetchingCities: "idle" | "loading" | "failed" | "succeeded";
        fetchingStates: "idle" | "loading" | "failed" | "succeeded";
        adding: "idle" | "loading" | "failed" | "succeeded";
        updating: "idle" | "loading" | "failed" | "succeeded";
        deleting: "idle" | "loading" | "failed" | "succeeded";
    };

    error: string | null;
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

    statuses: {
        fetching: "idle",
        fetchingById: "idle",
        fetchingCountries: "idle",
        fetchingCities: "idle",
        fetchingStates: "idle",
        adding: "idle",
        updating: "idle",
        deleting: "idle",
    },

    error: null,
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

export const fetchLocationById = createAsyncThunk<LocationType, number>(
    "locations/fetchById",
    async (id) => {
        const { data } = await axiosClient.get(`/api/locations/${id}`);
        return data;
    },
);

export const fetchCountries = createAsyncThunk<string[]>(
    "locations/fetchCountries",
    async () => {
        const { data } = await axiosClient.get("/api/locations/countries");
        return data;
    },
);

export const fetchCities = createAsyncThunk<
    string[],
    { country?: string }
>("locations/fetchCities", async ({ country = "all" } = {}) => {
    const { data } = await axiosClient.get("/api/locations/cities", { params: { country } });
    return data;
});

export const fetchStates = createAsyncThunk<
    string[],
    { country?: string }
>("locations/fetchStates", async ({ country = "all" } = {}) => {
    const { data } = await axiosClient.get("/api/locations/states", { params: { country } });
    return data;
});

export const addLocation = createAsyncThunk<
    LocationType,
    Partial<LocationType>
>("locations/add", async (body) => {
    const { data } = await axiosClient.post("/api/locations", body);
    return data;
});

export const updateLocation = createAsyncThunk<
    LocationType,
    { id: number; body: Partial<LocationType> }
>("locations/update", async ({ id, body }) => {
    const { data } = await axiosClient.put(`/api/locations/${id}`, body);
    return data;
});

export const deleteLocation = createAsyncThunk<
    void,
    { id: number }
>("locations/delete", async ({ id }) => {
    await axiosClient.delete(`/api/locations/${id}`);
});

/* ---------- Slice ---------- */
const locationsSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
        clearLocations: () => initialState,
        clearLocationSelected: (s) => {
            s.selected = initialState.selected;
        },
        clearLocationError: (s) => {
            s.error = initialState.error;
        },
        clearCountries: (s) => {
            s.countries = [];
        },
        clearCities: (s) => {
            s.cities = [];
        },
        clearStates: (s) => {
            s.states = [];
        },
        setLocationSelected: (s, a: PayloadAction<LocationType | null>) => {
            s.selected = a.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            /* Fetch Locations */
            .addCase(fetchLocations.pending, (s) => {
                s.statuses.fetching = "loading";
            })
            .addCase(fetchLocations.fulfilled, (s, a) => {
                s.statuses.fetching = "succeeded";
                s.content = a.payload.content;
                s.totalPages = a.payload.totalPages;
                s.page = a.payload.page;
                s.totalElements = a.payload.totalElements;
            })
            .addCase(fetchLocations.rejected, (s) => {
                s.statuses.fetching = "failed";
                s.error = "Failed to fetch locations";
            })

            /* Fetch Location By Id */
            .addCase(fetchLocationById.pending, (s) => {
                s.statuses.fetchingById = "loading";
            })
            .addCase(fetchLocationById.fulfilled, (s, a) => {
                s.statuses.fetchingById = "succeeded";
                s.selected = a.payload;
            })
            .addCase(fetchLocationById.rejected, (s) => {
                s.statuses.fetchingById = "failed";
                s.error = "Failed to fetch location by id";
            })

            /* Fetch Countries */
            .addCase(fetchCountries.pending, (s) => {
                s.statuses.fetchingCountries = "loading";
            })
            .addCase(fetchCountries.fulfilled, (s, a) => {
                s.statuses.fetchingCountries = "succeeded";
                s.countries = a.payload;
            })
            .addCase(fetchCountries.rejected, (s) => {
                s.statuses.fetchingCountries = "failed";
                s.error = "Failed to fetch countries";
            })

            /* Fetch Cities */
            .addCase(fetchCities.pending, (s) => {
                s.statuses.fetchingCities = "loading";
            })
            .addCase(fetchCities.fulfilled, (s, a) => {
                s.statuses.fetchingCities = "succeeded";
                s.cities = a.payload;
            })
            .addCase(fetchCities.rejected, (s) => {
                s.statuses.fetchingCities = "failed";
                s.error = "Failed to fetch cities";
            })

            /* Fetch States */
            .addCase(fetchStates.pending, (s) => {
                s.statuses.fetchingStates = "loading";
            })
            .addCase(fetchStates.fulfilled, (s, a) => {
                s.statuses.fetchingStates = "succeeded";
                s.states = a.payload;
            })
            .addCase(fetchStates.rejected, (s) => {
                s.statuses.fetchingStates = "failed";
                s.error = "Failed to fetch states";
            })

            /* Add Location */
            .addCase(addLocation.pending, (s) => {
                s.statuses.adding = "loading";
            })
            .addCase(addLocation.fulfilled, (s, a) => {
                s.statuses.adding = "succeeded";
                s.content.unshift(a.payload);
                s.totalElements += 1;
            })
            .addCase(addLocation.rejected, (s) => {
                s.statuses.adding = "failed";
                s.error = "Failed to add location";
            })

            /* Update Location */
            .addCase(updateLocation.pending, (s) => {
                s.statuses.updating = "loading";
            })
            .addCase(updateLocation.fulfilled, (s, a) => {
                s.statuses.updating = "succeeded";

                // Update the location in content array if it exists
                const locationIndex = s.content.findIndex(location => location.locationId === a.payload.locationId);
                if (locationIndex !== -1) {
                    s.content[locationIndex] = a.payload;
                }

                // Update selected location if it's the same
                if (s.selected && s.selected.locationId === a.payload.locationId) {
                    s.selected = a.payload;
                }
            })
            .addCase(updateLocation.rejected, (s) => {
                s.statuses.updating = "failed";
                s.error = "Failed to update location";
            })

            /* Delete Location */
            .addCase(deleteLocation.pending, (s) => {
                s.statuses.deleting = "loading";
            })
            .addCase(deleteLocation.fulfilled, (s, a) => {
                s.statuses.deleting = "succeeded";
                const locationId = a.meta.arg.id;

                // Remove location from content array
                s.content = s.content.filter(location => location.locationId !== locationId);
                s.totalElements = Math.max(0, s.totalElements - 1);

                // Clear selected location if it's the deleted one
                if (s.selected && s.selected.locationId === locationId) {
                    s.selected = null;
                }
            })
            .addCase(deleteLocation.rejected, (s) => {
                s.statuses.deleting = "failed";
                s.error = "Failed to delete location";
            });
    },
});

export const {
    clearLocations,
    clearLocationSelected,
    clearLocationError,
    clearCountries,
    clearCities,
    clearStates,
    setLocationSelected,
} = locationsSlice.actions;

export default locationsSlice.reducer;