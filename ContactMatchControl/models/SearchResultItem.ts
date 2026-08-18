export interface SearchResultItem {
  objecttypecode: string;
  objectid?: string;

  // allow dynamic fields safely (instead of any)
  [key: string]: unknown;
}

