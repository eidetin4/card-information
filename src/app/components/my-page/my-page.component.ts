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

  protected activeCards: WritableSignal<GetCardDetails[]> = signal<GetCardDetails[]>([]);
  protected errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  protected expandedCardId: WritableSignal<number | null> = signal<number | null>(null);

  ngOnInit(): void {
    this.getAllCards();
  }

  protected getAllCards(): void {
    this.cardInformationService.getAllCards().subscribe({
      next: (response: GetCardDetails[]): void => {
        this.activeCards.set(response.filter((card: GetCardDetails) => card.active));

        this.errorMessage.set(null);
      },
      error: (): void => {
        this.errorMessage.set('Kunne ikke hente kortinformasjon. Vennligst prøv igjen senere.');
      }
    });
  }

  protected toggleCardDetails(cardId: number): void {
    this.expandedCardId.set(this.expandedCardId() === cardId ? null : cardId);
  }

  protected getLastFourDigits(cardNumber: number): string {
    const cardNumberString: string = cardNumber.toString();
    return cardNumberString.slice(-4);
  }
}
