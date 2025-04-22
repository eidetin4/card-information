import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CardDetailsService} from '../../services/card-details.service';
import {GetCardDetails} from '../../models/card-details-models';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html'
})

export class MyPageComponent implements OnInit {

  private cardInformationService: CardDetailsService = inject(CardDetailsService);

  protected readonly cards: WritableSignal<GetCardDetails[]> = signal<GetCardDetails[]>([]);

  ngOnInit(): void {
    this.cardInformationService.getAllCardDetails().subscribe({
      next: (response: GetCardDetails[]): void => {
        this.cards.set(response);
      },
      error: (error: Error): void => {
        console.error('Error fetching card information:', error.message);
      }
    });
  }
}
