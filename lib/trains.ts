export interface Train {
  number: string;
  name: string;
}

// Dummy train data for demonstration
const trains: Train[] = [
  { number: "12951", name: "Mumbai Rajdhani Express" },
  { number: "12952", name: "Mumbai Rajdhani Express" },
  { number: "12009", name: "Shatabdi Express" },
  { number: "12010", name: "Shatabdi Express" },
  { number: "12259", name: "Sealdah Duronto Express" },
  { number: "12260", name: "Sealdah Duronto Express" },
  { number: "12801", name: "Purushottam Express" },
  { number: "12802", name: "Purushottam Express" },
  { number: "12903", name: "Golden Temple Mail" },
  { number: "12904", name: "Golden Temple Mail" },
  { number: "12627", name: "Karnataka Express" },
  { number: "12628", name: "Karnataka Express" },
  { number: "12301", name: "Howrah Rajdhani Express" },
  { number: "12302", name: "Howrah Rajdhani Express" }
];

export function searchTrains(query: string): Train[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  return trains.filter(
    (train) =>
      train.name.toLowerCase().includes(lowerQuery) ||
      train.number.includes(lowerQuery)
  );
}
