import { TestBed } from '@angular/core/testing';

import { Meet2ShopFormService } from './meet2-shop-form.service';

describe('Meet2ShopFormService', () => {
  let service: Meet2ShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Meet2ShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
