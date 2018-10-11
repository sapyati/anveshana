import { TestBed, inject } from '@angular/core/testing';

import { RoomsListService } from './rooms-list.service';

xdescribe('RoomsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomsListService]
    });
  });

  it('should be created', inject([RoomsListService], (service: RoomsListService) => {
    expect(service).toBeTruthy();
  }));
});
