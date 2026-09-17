import { test, expect } from '../fixtures/baseFixture';
import { users } from '../fixtures/testData';

test.describe('Product Tests', () => {

  test('user can add a product to cart', async ({
    loginPage,
    productsPage,
    cartPage
  }) => {

    await loginPage.goto();

    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password
    );

    await productsPage.addBackpackToCart();

    await expect(productsPage.cartBadge).toHaveText('1');

    await cartPage.openCart();

    await expect(loginPage.page).toHaveURL(/cart.html/);

    await expect(
      cartPage.getCartItemByName('Sauce Labs Backpack')
    ).toHaveText('Sauce Labs Backpack');
  });

});