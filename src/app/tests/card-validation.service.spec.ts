import {CardValidationService} from '../services/card-validation.service';
import {FormControl, FormGroup} from '@angular/forms';

describe('CardValidationService', () => {
  let service: CardValidationService;

  beforeEach(() => {
    service = new CardValidationService();
  })

  describe('cardNumberValidator', () => {
    it('should return null for valid VISA card number', () => {
      const control = new FormControl('4111111111111111');
      expect(service.cardNumberValidator()(control)).toBeNull();
    });

    it('should return null for valid AMEX card number', () => {
      const control = new FormControl('378282246310005');
      expect(service.cardNumberValidator()(control)).toBeNull();
    });

    it('should return null for valid MASTERCARD card number', () => {
      const control = new FormControl('5555555555554444');
      expect(service.cardNumberValidator()(control)).toBeNull();
    });

    it('should return error for non-digit input', () => {
      const control = new FormControl('4111-1111-1111-1111');
      expect(service.cardNumberValidator()(control)).toEqual({ invalidCardNumber: 'Kortnummer kan kun inneholde tall' });
    });

    it('should return error for invalid card number length', () => {
      const control = new FormControl('41111111111111');
      expect(service.cardNumberValidator()(control)).toEqual({ invalidCardNumber: 'Kortnummer må ha 16 siffer' });
    });

    it('should return error for AMEX with incorrect length', () => {
      const control = new FormControl('341111111111111'); // 15 digits, but AMEX requires 15
      expect(service.cardNumberValidator()(control)).toBeNull();
      
      const controlTooLong = new FormControl('3411111111111111'); // 16 digits, AMEX requires 15
      expect(service.cardNumberValidator()(controlTooLong)).toEqual({ invalidCardNumber: 'AMEX-kort må ha 15 siffer' });
      
      const controlTooShort = new FormControl('37111111111111'); // 14 digits, AMEX requires 15
      expect(service.cardNumberValidator()(controlTooShort)).toEqual({ invalidCardNumber: 'AMEX-kort må ha 15 siffer' });
    });

    it('should return error for invalid card number checksum', () => {
      const control = new FormControl('4111111111111110');
      expect(service.cardNumberValidator()(control)).toEqual({ invalidCardNumber: 'Ugyldig kortnummer' });
    });

    it('should return null for empty input', () => {
      const control = new FormControl('');
      expect(service.cardNumberValidator()(control)).toBeNull();
    });
  });

  describe('expiryDateValidator', () => {
    it('should return null for valid expiry date', () => {
      const futureYear = (new Date().getFullYear() + 1).toString().slice(-2);
      const control = new FormControl(`12/${futureYear}`);
      expect(service.expiryDateValidator()(control)).toBeNull();
    });

    it('should return error for past expiry date', () => {
      const control = new FormControl('01/20');
      expect(service.expiryDateValidator()(control)).toEqual({ expiredCard: 'Kortet er utgått' });
    });

    it('should return error for invalid format', () => {
      const control = new FormControl('2025-12');
      expect(service.expiryDateValidator()(control)).toEqual({ invalidExpiryDate: 'Ugyldig format. Formatet må være MM/YY' });
    });

    it('should return null for empty input', () => {
      const control = new FormControl('');
      expect(service.expiryDateValidator()(control)).toBeNull();
    });
  });

  describe('cvvValidator', () => {
    it('should return null for valid 3-digit CVV (VISA)', () => {
      const group = new FormGroup({
        issuer: new FormControl('VISA'),
        CVV: new FormControl('123')
      });
      const control = group.get('CVV')!;
      expect(service.cvvValidator()(control)).toBeNull();
    });

    it('should return null for valid 4-digit CVV (AMEX)', () => {
      const group = new FormGroup({
        issuer: new FormControl('AMEX'),
        CVV: new FormControl('1234')
      });
      const control = group.get('CVV')!;
      expect(service.cvvValidator()(control)).toBeNull();
    });

    it('should return error for wrong length (AMEX)', () => {
      const group = new FormGroup({
        issuer: new FormControl('AMEX'),
        CVV: new FormControl('123')
      });
      const control = group.get('CVV')!;
      expect(service.cvvValidator()(control)).toEqual({ invalidCVV: 'AMEX CVV må ha 4 siffer' });
    });

    it ('should return error for wrong length (VISA)', () => {
      const group = new FormGroup({
        issuer: new FormControl('VISA'),
        CVV: new FormControl('1234')
      });
      const control = group.get('CVV')!;
      expect(service.cvvValidator()(control)).toEqual({ invalidCVV: 'CVV må ha 3 siffer' });
    });

    it('should return error for non-digit CVV', () => {
      const group = new FormGroup({
        issuer: new FormControl('VISA'),
        CVV: new FormControl('12a')
      });
      const control = group.get('CVV')!;
      expect(service.cvvValidator()(control)).toEqual({ invalidCVV: 'CVV kan bare inneholde tall' });
    });

    it('should return null when issuer is not selected', () => {
      const group = new FormGroup({
        issuer: new FormControl(''),
        CVV: new FormControl('123')
      });
      const control = group.get('CVV')!;
      expect(service.cvvValidator()(control)).toBeNull();
    });

    it('should return null for empty input', () => {
      const group = new FormGroup({
        issuer: new FormControl('VISA'),
        CVV: new FormControl('')
      });
      const control = group.get('CVV')!;
      expect(service.cvvValidator()(control)).toBeNull();
    });
  });
});
