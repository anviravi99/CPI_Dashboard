export interface CPIDataPoint {
  Sector: string;
  Year: number;
  Month: string;
  MonthNum: number;
  Date: string;
  "General index": number;
  "Food and beverages": number;
  "Pan, tobacco and intoxicants": number;
  "Clothing and footwear": number;
  "Housing"?: number;
  "Fuel and light": number;
  "Miscellaneous": number;
  // Detailed food
  "Cereals and products": number;
  "Meat and fish": number;
  "Egg": number;
  "Milk and products": number;
  "Oils and fats": number;
  "Fruits": number;
  "Vegetables": number;
  "Pulses and products": number;
  "Sugar and Confectionery": number;
  "Spices": number;
  "Non-alcoholic beverages": number;
  "Prepared meals, snacks, sweets etc.": number;
  // Other details
  "Clothing": number;
  "Footwear": number;
  "Household goods and services": number;
  "Health": number;
  "Transport and communication": number;
  "Recreation and amusement": number;
  "Education": number;
  "Personal care and effects": number;
  [key: string]: any; // Index signature for flexible access in aggregation functions
}

export enum SectorType {
  RURAL = "Rural",
  URBAN = "Urban",
  COMBINED = "Rural+Urban"
}

export interface KPIMetric {
  label: string;
  value: string;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
  period: string;
}