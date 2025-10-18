import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { buildWhatsAppURL } from '@/utils/encodeWhatsapp';

interface BuyNowButtonProps {
  productName: string;
  selectedSize?: string;
  selectedColor?: string;
  disabled?: boolean;
}

export function BuyNowButton({ 
  productName, 
  selectedSize, 
  selectedColor,
  disabled 
}: BuyNowButtonProps) {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');

  useEffect(() => {
    // Fetch WhatsApp number from settings
    supabase
      .from('settings')
      .select('value')
      .eq('id', 'whatsapp_number')
      .single()
      .then(({ data }) => {
        if (data?.value && typeof data.value === 'object' && 'number' in data.value) {
          setWhatsappNumber(data.value.number as string);
        }
      });
  }, []);

  const handleBuyNow = () => {
    if (!whatsappNumber) return;

    const productURL = window.location.href;
    const url = buildWhatsAppURL(whatsappNumber, {
      productName,
      size: selectedSize,
      color: selectedColor,
      productURL,
    });

    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleBuyNow}
      disabled={disabled || !whatsappNumber}
      size="lg"
      className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Buy Now via WhatsApp
    </Button>
  );
}
