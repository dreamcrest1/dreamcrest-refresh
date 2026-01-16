export type IndiaCity = {
  id: string;
  name: string;
  x: number; // 0..1500 SVG coordinate
  y: number; // 0..1500 SVG coordinate
  description?: string;
};

// Top metro set (can be expanded later).
// Coordinates are tuned for the shared INDIA_PATH viewBox: 0 0 1500 1500
export const indiaTopMetros: IndiaCity[] = [
  { id: "delhi", name: "Delhi", x: 700, y: 350, description: "North India hub" },
  { id: "jaipur", name: "Jaipur", x: 610, y: 460, description: "Rajasthan" },
  { id: "ahmedabad", name: "Ahmedabad", x: 550, y: 600, description: "Gujarat" },
  { id: "mumbai", name: "Mumbai", x: 450, y: 700, description: "West coast" },
  { id: "pune", name: "Pune", x: 500, y: 760, description: "Maharashtra" },
  { id: "hyderabad", name: "Hyderabad", x: 650, y: 860, description: "Deccan plateau" },
  { id: "bengaluru", name: "Bangalore", x: 600, y: 950, description: "Karnataka" },
  { id: "chennai", name: "Chennai", x: 700, y: 1100, description: "Tamil Nadu" },
  { id: "kolkata", name: "Kolkata", x: 950, y: 850, description: "East India" },
];
