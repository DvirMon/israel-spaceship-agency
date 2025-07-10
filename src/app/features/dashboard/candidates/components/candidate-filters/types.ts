export type FilterState = {
  searchTerm: string;
  statusFilter: string;
  cityFilter: string;
  ageFilter: string;
  dateFilter: string;
  sortBy: string;
};

export type ActiveFilter = {
  key: keyof FilterState;
  label: string;
  icon: string;
};
