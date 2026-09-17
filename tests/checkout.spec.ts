import { test, expect } from '../fixtures/baseFixture';
import { users, checkoutData } from '../fixtures/testData';

test.describe('Checkout Tests', () => {

  test('user can complete checkout successfully', async ({ checkoutFlow }) => {

    await checkoutFlow.reachCheckout(
      users.standardUser.username,
      users.standardUser.password
    );

    await checkoutFlow.checkoutPage.fillCustomerDetails(
      checkoutData.customer.firstName,
      checkoutData.customer.lastName,
      checkoutData.customer.postalCode
    );

    await checkoutFlow.checkoutPage.continueCheckout();

    await checkoutFlow.checkoutPage.finishCheckout();

    await expect(
      checkoutFlow.checkoutPage.successMessage
    ).toHaveText('Thank you for your order!');
  });

  test('checkout should fail when postal code is missing', async ({ checkoutFlow }) => {

    await checkoutFlow.reachCheckout(
      users.standardUser.username,
      users.standardUser.password
    );

    await checkoutFlow.checkoutPage.fillCustomerDetails(
      checkoutData.customer.firstName,
      checkoutData.customer.lastName,
      ''
    );

    await checkoutFlow.checkoutPage.continueCheckout();

    await expect(
      checkoutFlow.checkoutPage.errorMessage
    ).toContainText('Postal Code is required');
  });

});