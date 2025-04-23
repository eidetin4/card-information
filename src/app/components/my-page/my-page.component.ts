import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CardDetailsService} from '../../services/card-details.service';
import {GetCardDetails} from '../../models/card-details-models';
import {CardFormComponent} from '../card-form/card-form.component';
import {CardDetailsComponent} from '../card-details/card-details.component';

@Component({
  selector: 'app-my-page',
  imports: [
    CardDetailsComponent,
    CardFormComponent
  ],
  templateUrl: './my-page.component.html'
})

export class MyPageComponent implements OnInit {

  private cardInformationService: CardDetailsService = inject(CardDetailsService);

  protected readonly activeCards: WritableSignal<GetCardDetails[]> = signal<GetCardDetails[]>([]);

  ngOnInit(): void {
    this.getAllCards();
  }

  getAllCards(): void {
    this.cardInformationService.getAllCards().subscribe({
      next: (response: GetCardDetails[]): void => {
        this.activeCards.set(response.filter((card: GetCardDetails) => card.active));
      },
      error: (error: Error): void => {
        console.error('Error fetching card details:', error.message);
      }
    });
  }
}
