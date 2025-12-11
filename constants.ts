// Function to generate realistic CPI data from 2013 to 2023
const generateData = () => {
  const sectors = ['Rural', 'Urban', 'Rural+Urban'];
  const years = Array.from({ length: 11 }, (_, i) => 2013 + i); // 2013 - 2023
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  let csv = `Sector,Year,Month,MonthNum,Date,Cereals and products,Meat and fish,Egg,Milk and products,Oils and fats,Fruits,Vegetables,Pulses and products,Sugar and Confectionery,Spices,Non-alcoholic beverages,"Prepared meals, snacks, sweets etc.",Food and beverages,"Pan, tobacco and intoxicants",Clothing,Footwear,Clothing and footwear,Housing,Fuel and light,Household goods and services,Health,Transport and communication,Recreation and amusement,Education,Personal care and effects,Miscellaneous,General index`;

  // Base values (approximate 2013 start)
  let baseCPI = 105.0;
  
  // Commodity baselines
  let commodities: Record<string, number> = {
    "Cereals and products": 107,
    "Meat and fish": 106,
    "Egg": 108,
    "Milk and products": 105,
    "Oils and fats": 106,
    "Fruits": 104,
    "Vegetables": 102, // Volatile
    "Pulses and products": 106,
    "Sugar and Confectionery": 106,
    "Spices": 103,
    "Non-alcoholic beverages": 105,
    "Prepared meals, snacks, sweets etc.": 106,
    "Food and beverages": 105,
    "Pan, tobacco and intoxicants": 105,
    "Clothing": 106,
    "Footwear": 105,
    "Clothing and footwear": 106,
    "Housing": 100, // Urban only usually, but we simulate
    "Fuel and light": 105,
    "Household goods and services": 104,
    "Health": 103,
    "Transport and communication": 103,
    "Recreation and amusement": 103,
    "Education": 104,
    "Personal care and effects": 104,
    "Miscellaneous": 105
  };

  years.forEach(year => {
    months.forEach((month, monthIndex) => {
      const monthNum = monthIndex + 1;
      // Pad date for consistency 01-01-2013
      const dateStr = `01-${monthNum.toString().padStart(2, '0')}-${year}`;

      sectors.forEach(sector => {
        // Add some random variation and steady inflation trend per month
        // Inflation trend ~0.4% per month on average
        
        // Random fluctuation factors
        const volatility = Math.random() * 2 - 0.8; // -0.8 to 1.2
        const trend = 0.35; // Base monthly inflation
        
        // Update Commodities
        const rowData: string[] = [];
        
        // Push standard columns
        rowData.push(sector);
        rowData.push(year.toString());
        rowData.push(month);
        rowData.push(monthNum.toString());
        rowData.push(dateStr);

        // Generate Commodity Values
        let weightedSum = 0;
        let count = 0;

        for (const key in commodities) {
          // Vegetables are more volatile
          let specificVolatility = volatility;
          if (key === 'Vegetables' || key === 'Fruits') specificVolatility *= 3;
          
          // Apply change
          let change = trend + specificVolatility;
          
          // Urban housing is higher, Rural doesn't exist often in raw data but we fill for chart safety
          if (key === 'Housing' && sector === 'Rural') {
             // Keep distinct
             commodities[key] += change * 0.8;
          } else {
             commodities[key] += change;
          }

          // Add slight noise per sector
          let sectorNoise = sector === 'Urban' ? 0.2 : -0.1;
          let finalVal = (commodities[key] + sectorNoise).toFixed(1);
          
          rowData.push(finalVal);
          
          // Simple approximation for General Index calculation
          weightedSum += parseFloat(finalVal);
          count++;
        }

        // Calculate General Index (Simplified Average for display purposes)
        // In reality, weights differ, but this tracks the visual trend correctly
        const generalIndex = (weightedSum / count).toFixed(1);
        rowData.push(generalIndex);

        csv += '\n' + rowData.join(',');
      });
    });
  });

  return csv;
};

export const RAW_CSV_DATA = generateData();
