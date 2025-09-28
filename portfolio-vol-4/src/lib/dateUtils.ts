// Utility function to parse date strings with Norwegian month names
export const parseNorwegianDate = (dateStr: string): Date => {
  const monthTranslations: { [key: string]: string } = {
    'januar': 'January',
    'februar': 'February', 
    'mars': 'March',
    'april': 'April',
    'mai': 'May',
    'juni': 'June',
    'juli': 'July',
    'august': 'August',
    'september': 'September',
    'oktober': 'October',
    'november': 'November',
    'desember': 'December'
  };
  
  let normalizedDate = dateStr.toLowerCase();
  
  // Replace Norwegian month names with English ones
  Object.entries(monthTranslations).forEach(([norwegian, english]) => {
    normalizedDate = normalizedDate.replace(norwegian, english.toLowerCase());
  });
  
  // Remove dots and extra spaces, then parse
  const cleanDate = normalizedDate.replace(/\./g, '').trim();
  
  // Try parsing the normalized date
  const parsedDate = new Date(cleanDate);
  
  // If parsing fails, return a very old date so it sorts last
  return isNaN(parsedDate.getTime()) ? new Date('1900-01-01') : parsedDate;
};

// Helper function to format date for display
export const formatDisplayDate = (dateStr: string): string => {
  const date = parseNorwegianDate(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};