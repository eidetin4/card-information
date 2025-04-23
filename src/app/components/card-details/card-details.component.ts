import {Component, input, InputSignal} from '@angular/core';
import {GetCardDetails} from '../../models/card-details-models';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html'
})

export class CardDetailsComponent {

  card: InputSignal<GetCardDetails> = input.required<GetCardDetails>();

  getLastFourDigits(cardNumber: number): string {
    const cardNumberString: string = cardNumber.toString();
    return cardNumberString.slice(-4);
  }
}
