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
        return { invalidCardNumber: 'Kortnummer kan kun inneholde tall' };
      }

      // Check if it has the correct length based on the issuer
      if (value.startsWith('34') || value.startsWith('37')) {
        if (value.length !== 15) {
          return { invalidCardNumber: 'AMEX-kort må ha 15 siffer' };
        }
      } else if (value.length !== 16) {
        return { invalidCardNumber: 'Kortnummer må ha 16 siffer' };
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

      return (sum % 10 === 0) ? null : { invalidCardNumber: 'Ugyldig kortnummer' };
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
        return { invalidExpiryDate: 'Ugyldig format. Formatet må være MM/YY' };
      }

      const [month, year] = value.split('/');

      const currentDate: Date = new Date();
      const expiryDate: Date = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);

      // Check if the card is expired
      if (expiryDate < currentDate) {
        return { expiredCard: 'Kortet er utgått' };
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
        return { invalidCVV: 'CVV kan bare inneholde tall' };
      }

      // Check length based on issuer
      if (issuer === 'AMEX' && value.length !== 4) {
        return { invalidCVV: 'AMEX CVV må ha 4 siffer' };
      } else if (issuer !== 'AMEX' && value.length !== 3) {
        return { invalidCVV: 'CVV må ha 3 siffer' };
      }

      return null;
    }
  }
}
