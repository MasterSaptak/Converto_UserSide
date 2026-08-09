export interface Train {
  number: string;
  name: string;
}

import trainData from './trains-data.json';

const trains: Train[] = trainData;

export function searchTrains(query: string): Train[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  return trains.filter(
    (train) =>
      train.name.toLowerCase().includes(lowerQuery) ||
      train.number.includes(lowerQuery)
  );
}
