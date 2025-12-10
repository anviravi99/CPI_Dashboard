import { CPIDataPoint, SectorType } from '../types';

export const filterData = (data: CPIDataPoint[], sector: SectorType) => {
  return data.filter(d => d.Sector === sector);
};

export const getKPIMetrics = (data: CPIDataPoint[]) => {
  if (data.length === 0) return { avgCPI: "0", inflation: "0%", highestCatName: "-", highestCatValue: "0" };

  // 1. Average CPI (General Index)
  const totalCPI = data.reduce((sum, d) => sum + d["General index"], 0);
  const avgCPI = (totalCPI / data.length).toFixed(1);

  // 2. Inflation (End - Start) / Start
  // Sort by date just in case
  const sorted = [...data].sort((a, b) => {
    if (a.Year !== b.Year) return a.Year - b.Year;
    return a.MonthNum - b.MonthNum;
  });
  const start = sorted[0]["General index"];
  const end = sorted[sorted.length - 1]["General index"];
  const inflation = (((end - start) / start) * 100).toFixed(1) + "%";

  // 3. Highest Category Average
  const categories = [
    "Cereals and products", "Meat and fish", "Egg", "Milk and products", "Oils and fats", 
    "Fruits", "Vegetables", "Pulses and products", "Sugar and Confectionery", "Spices",
    "Fuel and light", "Housing", "Clothing", "Footwear"
  ];
  
  let maxVal = 0;
  let maxName = "";

  categories.forEach(cat => {
    const sum = data.reduce((s, d) => s + (d[cat] || 0), 0);
    const avg = sum / data.length;
    if (avg > maxVal) {
      maxVal = avg;
      maxName = cat;
    }
  });

  return {
    avgCPI,
    inflation,
    highestCatName: maxName,
    highestCatValue: maxVal.toFixed(1)
  };
};

export const getYearlyAverages = (data: CPIDataPoint[]) => {
  const years = Array.from(new Set(data.map(d => d.Year))).sort();
  return years.map(year => {
    const yearData = data.filter(d => d.Year === year);
    const sum = yearData.reduce((s, d) => s + d["General index"], 0);
    return {
      year,
      value: parseFloat((sum / yearData.length).toFixed(1))
    };
  });
};

export const getCommodityAverages = (data: CPIDataPoint[]) => {
  const targetCommodities = [
    "Vegetables",
    "Pulses and products",
    "Oils and fats",
    "Meat and fish",
    "Spices",
    "Fuel and light",
    "Housing",
    "Clothing"
  ];

  const results = targetCommodities.map(name => {
    const sum = data.reduce((s, d) => s + (d[name] || 0), 0);
    return {
      name: name === "Pulses and products" ? "Pulses" : name, // Shorten name
      value: parseFloat((sum / data.length).toFixed(1))
    };
  });

  // Sort descending
  return results.sort((a, b) => b.value - a.value);
};