export function getCityLabel(city: string): string {
  const labels: { [key: string]: string } = {
    "tel-aviv": "Tel Aviv",
    jerusalem: "Jerusalem",
    haifa: "Haifa",
    "beer-sheva": "Beer Sheva",
    eilat: "Eilat",
    netanya: "Netanya",
  };
  return labels[city] || city;
}

export function getDateLabel(date: string): string {
  const labels: { [key: string]: string } = {
    "last-week": "Last Week",
    "last-month": "Last Month",
    "last-3-months": "Last 3 Months",
    older: "Older than 3 months",
  };
  return labels[date] || date;
}

export function getSortLabel(sort: string): string {
  const labels: { [key: string]: string } = {
    name: "Name (A-Z)",
    "name-desc": "Name (Z-A)",
    date: "Date (Newest)",
    "date-desc": "Date (Oldest)",
    age: "Age (Youngest)",
    "age-desc": "Age (Oldest)",
  };
  return labels[sort] || sort;
}
