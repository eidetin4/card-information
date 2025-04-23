import {Component, EventEmitter, inject, input, InputSignal, Output, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardValidationService} from '../../services/card-validation.service';
import {CardDetailsService} from '../../services/card-details.service';
import {AddCardDetails, GetCardDetails} from '../../models/card-details-models';

@Component({
  selector: 'app-card-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './card-form.component.html'
})

export class CardFormComponent {

  existingCards: InputSignal<GetCardDetails[]> = input.required<GetCardDetails[]>();
  @Output() cardAdded: EventEmitter<void> = new EventEmitter<void>();

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly validator: CardValidationService = inject(CardValidationService);
  private readonly cardDetailsService: CardDetailsService = inject(CardDetailsService);

  protected cardDetailsForm: FormGroup = new FormGroup({});
  protected isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  protected showSuccessMessage: WritableSignal<boolean> = signal<boolean>(false);
  protected errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  constructor() {
    this.cardDetailsForm = this.formBuilder.group({
      currency: ['NOK', [
        Validators.required
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

    this.cardDetailsForm.get('issuer')?.valueChanges.subscribe(() => {
      this.cardDetailsForm.get('CVV')?.updateValueAndValidity();
    });
  }

  protected submitCard(): void {
    if (this.cardDetailsForm.valid) {
      const newCardNumber = this.cardDetailsForm.value.cardDetails.replace(/\s/g, '');

      const duplicate = this.existingCards().some(
        c => c.cardDetails.toString().replace(/\s/g, '') === newCardNumber
      );

      if (duplicate) {
        this.errorMessage.set('Dette kortet er allerede registrert.');
        return;
      }

      this.isSubmitting.set(true);

      const newCard: AddCardDetails = {
        currency: this.cardDetailsForm.value.currency,
        cardDetails: newCardNumber,
        expiryDate: this.cardDetailsForm.value.expiryDate,
        CVV: this.cardDetailsForm.value.CVV,
        issuer: this.cardDetailsForm.value.issuer
      }

      this.cardDetailsService.addCard(newCard).subscribe({
        next: () => {
          this.showSuccessMessage.set(true);
          this.errorMessage.set(null);
          this.cardDetailsForm.reset({ currency: 'NOK', issuer: '' });
          this.cardAdded.emit();

          setTimeout(() => {
            this.showSuccessMessage.set(false);
          }, 3000);
        },
        error: () => {
          this.errorMessage.set('Det oppsto en feil ved registrering av kortet. Vennligst prøv igjen.');
        },
        complete: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }

  protected getCardNumberErrorMessage(): string {
    const cardNumberControl = this.cardDetailsForm.get('cardDetails');

    if (cardNumberControl?.hasError('required')) {
      return 'Kortnummer er påkrevd.';
    } else if (cardNumberControl?.hasError('invalidCardNumber')) {
      return cardNumberControl?.getError('invalidCardNumber');
    }

    return '';
  }

  protected getExpiryDateErrorMessage(): string {
    const expiryDateControl = this.cardDetailsForm.get('expiryDate');

    if (expiryDateControl?.hasError('required')) {
      return 'Utløpsdato er påkrevd.';
    } else if (expiryDateControl?.hasError('invalidExpiryDate')) {
      return expiryDateControl?.getError('invalidExpiryDate');
    } else if (expiryDateControl?.hasError('expiredCard')) {
      return expiryDateControl?.getError('expiredCard');
    }

    return '';
  }

  protected getCvvErrorMessage(): string {
    const cvvControl = this.cardDetailsForm.get('CVV');

    if (cvvControl?.hasError('required')) {
      return 'CVV er påkrevd.';
    } else if (cvvControl?.hasError('invalidCVV')) {
      return cvvControl?.getError('invalidCVV');
    }

    return '';
  }
}
