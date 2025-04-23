import {Injectable} from '@angular/core';
import {AbstractControl, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class CardValidationService {

  cardNumberValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value?.toString().replace(/\s/g, '');

      // Check if the field is empty
      if (!value) {
        return null;
      }

      // Check if it contains only digits
      if (!/^\d+$/.test(value)) {
        return { invalidCardNumber: 'Card number must contain only digits' };
      }

      // Check if it has the correct length based on the issuer
      if (value.startsWith('34') || value.startsWith('37')) {
        if (value.length !== 15) {
          return { invalidCardNumber: 'AMEX card number must have 15 digits' };
        }
      } else if (value.length !== 16) {
        return { invalidCardNumber: 'Card number must have 16 digits' };
      }

      // Luhn algorithm validation (checksum)
      let sum: number = 0;
      let shouldDouble: boolean = false;

      for (let i = value.length - 1; i >= 0; i--) {
        let digit = parseInt(value.charAt(i));

        if (shouldDouble) {
          digit *= 2;

          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
      }

      return (sum % 10 === 0) ? null : { invalidCardNumber: 'Invalid card number' };
    }
  }

  expiryDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;

      // Check if the field is empty
      if (!value) {
        return null;
      }

      // Check format (MM/YY)
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(control.value)) {
        return { invalidExpiryDate: 'Format must be MM/YY' };
      }

      const [month, year] = value.split('/');

      const currentDate: Date = new Date();
      const expiryDate: Date = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);

      // Check if the card is expired
      if (expiryDate < currentDate) {
        return { expiredCard: 'Card is expired' };
      }

      return null;
    }
  }

  cvvValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      const issuer = control.parent?.get('issuer')?.value;

      // Check if the field is empty
      if (!value) {
        return null;
      }

      // Check if it contains only digits
      if (!/^\d+$/.test(value)) {
        return { invalidCVV: 'CVV must contain only digits' };
      }

      // Check length based on issuer
      if (issuer === 'AMEX' && value.length !== 4) {
        return { invalidCVV: 'AMEX CVV must have 4 digits' };
      } else if (issuer !== 'AMEX' && value.length !== 3) {
        return { invalidCVV: 'CVV must have 3 digits' };
      }

      return null;
    }
  }
}
