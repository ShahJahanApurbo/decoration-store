// WhatsApp Configuration
export const whatsappConfig = {
  // Replace with your actual WhatsApp business number
  // Format: country code + number (without + or spaces)
  // Example: "1234567890" for +1 (234) 567-890
  phoneNumber: "1234567890",
  
  // Default messages for different scenarios
  defaultMessages: {
    general: "Hi! I'm interested in your decoration products. Could you please help me with more information?",
    product: "Hi! I'm interested in purchasing this item. Could you please provide more details and help me with the order?",
    support: "Hi! I need help with my order/inquiry. Could you please assist me?",
    catalog: "Hi! Could you please share your complete product catalog with prices?"
  },

  // Business hours for display
  businessHours: {
    monday: "9:00 AM - 8:00 PM",
    tuesday: "9:00 AM - 8:00 PM", 
    wednesday: "9:00 AM - 8:00 PM",
    thursday: "9:00 AM - 8:00 PM",
    friday: "9:00 AM - 8:00 PM",
    saturday: "10:00 AM - 6:00 PM",
    sunday: "12:00 PM - 5:00 PM"
  }
};

// Helper function to format phone number for display
export function formatPhoneNumber(phoneNumber: string): string {
  // This is a basic formatter - adjust based on your country's format
  // Example: converts "1234567890" to "+1 (234) 567-890"
  if (phoneNumber.length === 10) {
    return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
  }
  return `+${phoneNumber}`;
}

// Helper function to generate WhatsApp URL
export function generateWhatsAppURL(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
