import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPageComponent } from './dashboard.page';
import { RoomsStoreService } from '../../services/rooms-store.service';

describe('DashboardPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [provideRouter([]),
        {
          provide: RoomsStoreService,
          useValue: {
            summary: signal({ totalDone: 2, totalWishlist: 1, averageRating: 8.9, favorites: 1, recommendedPercentage: 50 }),
            loading: signal(false),
            favoriteRooms: signal([]),
            toggleFavorite: jasmine.createSpy('toggleFavorite'),
            deleteRoom: jasmine.createSpy('deleteRoom')
          }
        }
      ]
    }).compileComponents();
  });

  it('crea el dashboard', () => {
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
