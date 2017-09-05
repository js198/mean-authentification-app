/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OffService } from './off.service';

describe('OffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OffService]
    });
  });

  it('should ...', inject([OffService], (service: OffService) => {
    expect(service).toBeTruthy();
  }));
});
