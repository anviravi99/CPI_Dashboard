import { CPIDataPoint } from '../types';

export const parseCSV = (csvText: string): CPIDataPoint[] => {
  const lines = csvText.trim().split('\n');
  
  // Regex to handle splitting by comma while ignoring commas inside quotes
  const csvSplitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  // Parse headers using the regex to safely handle "Prepared meals, snacks, sweets etc."
  const headers = lines[0].split(csvSplitRegex).map(h => h.trim().replace(/^"|"$/g, ''));
  
  const data: CPIDataPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    if (!currentLine) continue;

    const values = currentLine.split(csvSplitRegex);

    // Ensure row has same number of columns as header to prevent misalignment
    if (values.length !== headers.length) {
      continue;
    }

    const entry: any = {};
    
    headers.forEach((header, index) => {
      let value = values[index] ? values[index].trim() : '';
      // Remove quotes from values
      value = value.replace(/^"|"$/g, '');
      
      if (header === 'Sector' || header === 'Month' || header === 'Date') {
        entry[header] = value;
      } else {
        // Parse numbers
        const num = parseFloat(value);
        entry[header] = isNaN(num) ? 0 : num;
      }
    });

    data.push(entry as CPIDataPoint);
  }

  return data;
};