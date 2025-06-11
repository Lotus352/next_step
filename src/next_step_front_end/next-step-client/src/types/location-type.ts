export default interface LocationType {
    locationId : string;
    countryName: string;
    state: string | null;
    city: string;
    street: string | null;
    houseNumber: string | null;
}
