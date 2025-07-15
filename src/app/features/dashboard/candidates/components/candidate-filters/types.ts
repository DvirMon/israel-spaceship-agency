export type FilterState = {
  searchTerm: string;
  statusFilter: string;
  cityFilter: string;
  ageFilter: string;
  dateFilter: string;
};

export type ActiveFilter = {
  key: keyof FilterState;
  label: string;
  icon: string;
};
