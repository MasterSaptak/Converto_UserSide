declare module 'indian-railway-station-codes' {
  interface Station {
    name: string;
    code: string;
  }

  export function getStationByCode(code: string): Station | undefined;
  export function getStationByName(name: string): Station | undefined;
  export function searchByCode(query: string): Station[];
  export function searchByName(query: string): Station[];
  export function searchStations(query: string): Station[];
  export const stations: Station[];
}
