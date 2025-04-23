import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardValidationService} from '../../services/card-validation.service';
import {CardDetailsService} from '../../services/card-details.service';
import {AddCardDetails} from '../../models/card-details-models';

@Component({
  selector: 'app-card-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './card-form.component.html'
})

export class CardFormComponent {

  @Output() cardAdded: EventEmitter<void> = new EventEmitter<void>();

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly validator: CardValidationService = inject(CardValidationService);
  private readonly cardDetailsService: CardDetailsService = inject(CardDetailsService);

  protected cardDetailsForm: FormGroup = new FormGroup({});
  protected isSubmitting: boolean = false;
  protected showSuccessMessage: boolean = false;
  protected errorMessage: string = '';

  constructor() {
    this.cardDetailsForm = this.formBuilder.group({
      currency: ['NOK', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ]],
      cardDetails: ['', [
        Validators.required,
        this.validator.cardNumberValidator()
      ]],
      expiryDate: ['', [
        Validators.required,
        this.validator.expiryDateValidator()
      ]],
      CVV: ['', [
        Validators.required,
        this.validator.cvvValidator()
      ]],
      issuer: ['', Validators.required]
    });
  }

  submitCard(): void {
    if (this.cardDetailsForm.valid) {
      this.isSubmitting = true;

      const newCard: AddCardDetails = {
        currency: this.cardDetailsForm.value.currency,
        cardDetails: this.cardDetailsForm.value.cardDetails,
        expiryDate: this.cardDetailsForm.value.expiryDate,
        CVV: this.cardDetailsForm.value.CVV,
        issuer: this.cardDetailsForm.value.issuer
      }

      this.cardDetailsService.addCard(newCard).subscribe({
        next: () => {
          this.showSuccessMessage = true;
          this.errorMessage = '';
          this.cardDetailsForm.reset({ currency: 'NOK', issuer: '' });
          this.cardAdded.emit();

          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        error: (error: Error) => {
          this.errorMessage = 'Det oppsto en feil ved registrering av kortet. Vennligst prøv igjen.';
          console.error('Error adding card:', error.message);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  getCardNumberErrorMessage(): string {
    const cardNumberControl = this.cardDetailsForm.get('cardDetails');

    if (cardNumberControl?.hasError('required')) {
      return 'Kortnummer er påkrevd.';
    } else if (cardNumberControl?.hasError('invalidCardNumber')) {
      return 'Ugyldig kortnummer.';
    }

    return '';
  }

  getExpiryDateErrorMessage(): string {
    const expiryDateControl = this.cardDetailsForm.get('expiryDate');

    if (expiryDateControl?.hasError('required')) {
      return 'Utløpsdato er påkrevd.';
    } else if (expiryDateControl?.hasError('invalidExpiryDate')) {
      return 'Ugyldig format. Må være MM/ÅÅ.';
    } else if (expiryDateControl?.hasError('expiredCard')) {
      return 'Kortet er utløpt.';
    }

    return '';
  }

  getCvvErrorMessage(): string {
    const cvvControl = this.cardDetailsForm.get('CVV');

    if (cvvControl?.hasError('required')) {
      return 'CVV er påkrevd.';
    } else if (cvvControl?.hasError('invalidCVV')) {
      return cvvControl?.getError('invalidCVV') || 'Ugyldig CVV.';
    }

    return '';
  }
}
