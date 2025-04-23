import {Component, computed, inject, Signal, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardValidationService} from '../../services/card-validation.service';
import {CardDetailsService} from '../../services/card-details.service';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html'
})

export class CardFormComponent {

  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly validator: CardValidationService = inject(CardValidationService);
  private readonly cardDetailsService: CardDetailsService = inject(CardDetailsService);

  protected cardDetailsForm: FormGroup = new FormGroup({});

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
      cvv: ['', [
        Validators.required,
        this.validator.cvvValidator()
      ]],
      issuer: ['', Validators.required]
    });
  }
}
