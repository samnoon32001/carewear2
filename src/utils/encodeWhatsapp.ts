interface WhatsAppMessageParams {
  productName: string;
  size?: string;
  color?: string;
  productURL: string;
}

export function buildWhatsAppURL(
  phoneNumber: string,
  params: WhatsAppMessageParams
): string {
  const message = `I would like to buy this product: ${params.productName}
Size: ${params.size || 'Not selected'}
Color: ${params.color || 'Not selected'}
Product Link: ${params.productURL}`;

  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
