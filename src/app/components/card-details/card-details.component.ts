import {Component, input, InputSignal} from '@angular/core';
import {GetCardDetails} from '../../models/card-details-models';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-card-details',
  imports: [
    DatePipe
  ],
  templateUrl: './card-details.component.html'
})

export class CardDetailsComponent {

  card: InputSignal<GetCardDetails> = input.required<GetCardDetails>();
}
