export function formatCurrency(
  num: number,
  currency = 'ZAR',
  internationalFormat = true,
  locale = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  });

  const formattedAmount = formatter.format(num);

  if (!internationalFormat) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
    }).format(num);
  }

  return formattedAmount;
}

export function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  const nbsp = String.fromCharCode(160);
  if (match) {
    return match[1] + nbsp + match[2] + nbsp + match[3];
  }
  return null;
}
