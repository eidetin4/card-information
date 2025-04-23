import {Component, inject, input, InputSignal, OnInit, signal, WritableSignal} from '@angular/core';
import {CardDetailsService} from '../../services/card-details.service';
import {GetCardDetails} from '../../models/card-details-models';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-card-details',
  imports: [
    DatePipe
  ],
  templateUrl: './card-details.component.html'
})

export class CardDetailsComponent implements OnInit {

  cardId: InputSignal<number> = input.required<number>();

  private cardDetailService: CardDetailsService = inject(CardDetailsService);

  protected readonly cardDetails: WritableSignal<GetCardDetails> = signal<GetCardDetails>({} as GetCardDetails);

  ngOnInit(): void {
    this.getCardDetails();
  }

  getCardDetails(): void {
    this.cardDetailService.getCard(this.cardId()).subscribe({
      next: (response: GetCardDetails): void => {
        this.cardDetails.set(response);
      },
      error: (error: Error): void => {
        console.error('Error fetching card details:', error.message);
      }
    });
  }
}
