import { format, parseISO } from 'date-fns';

// export const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     return format(parseISO(dateString), 'PPpp');
//   } catch{
//     return dateString;
//   }
// };

export const formatDate = (dateString) => {
  if (!dateString) return "NA";
  try {
    let normalized = dateString;
    if (!/[zZ]|[+-]\d\d:?\d\d$/.test(dateString)) {
      normalized = dateString + "Z";
    }

    const d = new Date(normalized);
    const formatted = d.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // Ensure am/pm is uppercase
    return formatted.replace(" am", " AM").replace(" pm", " PM");
  } catch (e) {
    console.error("formatDate error:", e, "value:", dateString);
    return dateString;
  }
};


export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toFixed(2)}`;
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
