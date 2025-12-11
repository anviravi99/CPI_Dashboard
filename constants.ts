// Function to generate realistic CPI data from 2013 to 2023
const generateData = () => {
  const sectors = ['Rural', 'Urban', 'Rural+Urban'];
  const years = Array.from({ length: 11 }, (_, i) => 2013 + i); // 2013 - 2023
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  let csv = `Sector,Year,Month,MonthNum,Date,Cereals and products,Meat and fish,Egg,Milk and products,Oils and fats,Fruits,Vegetables,Pulses and products,Sugar and Confectionery,Spices,Non-alcoholic beverages,"Prepared meals, snacks, sweets etc.",Food and beverages,"Pan, tobacco and intoxicants",Clothing,Footwear,Clothing and footwear,Housing,Fuel and light,Household goods and services,Health,Transport and communication,Recreation and amusement,Education,Personal care and effects,Miscellaneous,General index`;

  // Base configuration for commodities
  const baseCommodities = {
    "Cereals and products": 107,
    "Meat and fish": 106,
    "Egg": 108,
    "Milk and products": 105,
    "Oils and fats": 106,
    "Fruits": 104,
    "Vegetables": 102,
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
    "Housing": 100,
    "Fuel and light": 105,
    "Household goods and services": 104,
    "Health": 103,
    "Transport and communication": 103,
    "Recreation and amusement": 103,
    "Education": 104,
    "Personal care and effects": 104,
    "Miscellaneous": 105
  };

  // Initialize independent state for each sector to ensure they drift differently
  // Deep copy for independent tracking
  const sectorState: Record<string, Record<string, number>> = {
    'Rural': JSON.parse(JSON.stringify(baseCommodities)),
    'Urban': JSON.parse(JSON.stringify(baseCommodities)),
    'Rural+Urban': JSON.parse(JSON.stringify(baseCommodities))
  };

  // Apply initial differentiation so the charts look different immediately
  // Rural: Lower Housing (often 0 in real CPI but we keep low for viz), Cheaper services, Higher Food weight (simulated by volatility)
  for (const key in sectorState['Rural']) {
    if(key === 'Housing') sectorState['Rural'][key] = 40; // Rural housing starts much lower
    if(key === 'Clothing') sectorState['Rural'][key] *= 0.95;
    if(key === 'Miscellaneous') sectorState['Rural'][key] *= 0.92;
  }

  // Urban: Higher Housing, Higher Services
  for (const key in sectorState['Urban']) {
    if(key === 'Housing') sectorState['Urban'][key] = 110;
    if(key === 'Transport and communication') sectorState['Urban'][key] *= 1.05;
  }

  years.forEach(year => {
    months.forEach((month, monthIndex) => {
      const monthNum = monthIndex + 1;
      const dateStr = `01-${monthNum.toString().padStart(2, '0')}-${year}`;

      sectors.forEach(sector => {
        const currentCommods = sectorState[sector];
        
        // General inflation trend (randomized slightly per sector/month)
        const trend = 0.35 + (Math.random() * 0.1); 
        const volatility = Math.random() * 2 - 1;

        const rowData: string[] = [];
        rowData.push(sector, year.toString(), month, monthNum.toString(), dateStr);

        let weightedSum = 0;
        let count = 0;

        for (const key in currentCommods) {
           let change = trend;
           
           // Sector specific modifier to ensure divergence over time
           if (sector === 'Rural') {
             if (['Vegetables', 'Fruits', 'Cereals and products'].includes(key)) {
                change += 0.15; // Food inflation often higher/more volatile in rural
             }
             if (key === 'Housing') change = 0.1; // Very slow growth for rural housing
           } 
           else if (sector === 'Urban') {
             if (key === 'Housing') change += 0.2; // Urban housing grows faster
             if (key === 'Education' || key === 'Health') change += 0.1; // Services grow faster in Urban
           }

           // Volatility for specific items
           if (['Vegetables', 'Fruits', 'Egg'].includes(key)) {
             change += volatility * 3;
           }

           // Apply update
           currentCommods[key] += change;
           
           // Add noise
           const noise = (Math.random() * 0.5) - 0.25;
           const finalVal = Math.max(0, (currentCommods[key] + noise)).toFixed(1);
           
           rowData.push(finalVal);
           
           weightedSum += parseFloat(finalVal);
           count++;
        }
        
        // Calculate General Index
        const generalIndex = (weightedSum / count).toFixed(1);
        rowData.push(generalIndex);
        
        csv += '\n' + rowData.join(',');
      });
    });
  });

  return csv;
};

export const RAW_CSV_DATA = generateData();