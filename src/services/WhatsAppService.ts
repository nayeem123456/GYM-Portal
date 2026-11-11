export class WhatsAppService {
  /**
   * Generates a direct WhatsApp link with prefilled, personalized text.
   */
  public static createWhatsAppUrl(phone: string, text: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(text);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }

  /**
   * Replaces template variables like {{name}}, {{amount}}, {{gym_name}}, etc.
   */
  public static formatMessage(
    template: string,
    variables: {
      name?: string;
      amount?: string | number;
      gym_name?: string;
      package_name?: string;
      expiry_date?: string;
      reg_code?: string;
      batch_name?: string;
      [key: string]: string | number | undefined;
    }
  ): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, String(value || ''));
    }
    return result;
  }
}
