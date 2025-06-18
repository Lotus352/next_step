export default interface LocationType {
    locationId : number;
    countryName: string;
    state: string | null;
    city: string;
    street: string | null;
    houseNumber: string | null;
}

export interface LocationRequest {
    countryName: string;
    state: string | null;
    city: string;
    street: string | null;
    houseNumber: string | null;
}
