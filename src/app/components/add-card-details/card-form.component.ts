import {Component, inject} from '@angular/core';
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
          this.cardDetailsForm.reset({ currency: 'NOK' });
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.errorMessage = 'Fyll inn alle feltene korrekt.';
    }
  }
}
