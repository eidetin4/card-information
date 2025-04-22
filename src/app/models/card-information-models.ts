export interface GetCardInformation {
  currency: string;
  cardDetails: number;
  expiryDate: string;
  CVV: string;
  issuer: string;
  active: boolean;
  id: number;
}

export interface AddCardInformation {
  currency: string;
  cardDetails: number;
  expiryDate: string;
  CVV: string;
  issuer: string;
}
