import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="stars-container">
      @for (star of stars(); track $index) {
        <span class="star" [class]="star">
          @if (star === 'full') {
            ★
          } @else if (star === 'half') {
            <span class="half-star">★</span>
          } @else {
            ☆
          }
        </span>
      }
      <span class="rating-text">({{ rating() }})</span>
    </div>
  `,
  styles: `
    .stars-container {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      align-self: center;
      flex-wrap: nowrap;
    }
    .star {
      display: inline-flex;
      font-size: 1.5rem;
      color: lightgray;
      line-height: 1;
      font-size: 1.5rem;

    }
    .star.full, .star.half {
      color: gold;
    }
    .half-star {
      display: inline-flex;
      width: 55%;
      overflow: hidden;
    }
    .star.half {
      position: relative;
    }
    .star.half::after {
      content: '☆';
      position: absolute;
      top: 0;
      left: 0;
      color: lightgray;
    }
    .rating-text {
      margin-left: 8px;
      font-size: 0.9rem;
      color: #666;
    }
  `
})
export class StarRatingComponent {
  rating = input<number>(0);
  maxRating = input<number>(5);

  stars = computed(() => {
    const currentRating = this.rating();
    const max = this.maxRating();
    const starsArray: ('full' | 'half' | 'empty')[] = [];

    for (let i = 1; i <= max; i++) {
      if (currentRating >= i) {
        starsArray.push('full');
      } else if (currentRating >= i - 0.5) {
        starsArray.push('half');
      } else {
        starsArray.push('empty');
      }
    }

    return starsArray;
  });
}
