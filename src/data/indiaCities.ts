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
  // Coordinates tuned for INDIA_PATH in viewBox 0 0 1500 1500
  { id: "delhi", name: "Delhi", x: 730, y: 355, description: "North India hub" },
  { id: "jaipur", name: "Jaipur", x: 640, y: 440, description: "Rajasthan" },
  { id: "ahmedabad", name: "Ahmedabad", x: 520, y: 630, description: "Gujarat" },
  { id: "mumbai", name: "Mumbai", x: 470, y: 760, description: "West coast" },
  { id: "pune", name: "Pune", x: 510, y: 820, description: "Maharashtra" },
  { id: "hyderabad", name: "Hyderabad", x: 680, y: 920, description: "Deccan plateau" },
  { id: "bengaluru", name: "Bangalore", x: 650, y: 1045, description: "Karnataka" },
  { id: "chennai", name: "Chennai", x: 745, y: 1185, description: "Tamil Nadu" },
  { id: "kolkata", name: "Kolkata", x: 1000, y: 845, description: "East India" },
];
