import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export class CheckoutFlow {
  readonly loginPage: LoginPage;
  readonly productsPage: ProductsPage;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.productsPage = new ProductsPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
  }

  async reachCheckout(
    username: string,
    password: string
  ) {
    await this.loginPage.goto();

    await this.loginPage.login(
      username,
      password
    );

    await this.productsPage.addBackpackToCart();

    await this.cartPage.openCart();

    await this.checkoutPage.startCheckout();
  }
}