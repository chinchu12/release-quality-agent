import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);

    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.waitForURL('**/cart.html');
  }

  getCartItemByName(productName: string): Locator {
    return this.page
      .locator('.cart_item')
      .filter({ hasText: productName })
      .locator('.inventory_item_name');
  }
}