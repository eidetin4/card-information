export interface GetCardDetails {
  currency: string;
  cardDetails: number;
  expiryDate: string;
  CVV: string;
  issuer: string;
  active: boolean;
  id: number;
}

export interface AddCardDetails {
  currency: string;
  cardDetails: number;
  expiryDate: string;
  CVV: string;
  issuer: string;
}
