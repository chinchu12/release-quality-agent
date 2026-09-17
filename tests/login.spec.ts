import { test, expect } from '../fixtures/baseFixture';
import { users } from '../fixtures/testData';

test.describe('Login Tests', () => {

  test('successful login to SauceDemo', async ({ loginPage, productsPage }) => {

    await loginPage.goto();

    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password
    );

    await expect(loginPage.page).toHaveURL(/inventory/);

    await expect(productsPage.title).toHaveText('Products');
  });

  test('locked out user cannot login', async ({ loginPage }) => {

    await loginPage.goto();

    await loginPage.login(
      users.lockedUser.username,
      users.lockedUser.password
    );

    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out'
    );
  });

});

test('controlled failure for release analysis', async ({ loginPage, productsPage }) => {
  await loginPage.goto();

  await loginPage.login(
    users.standardUser.username,
    users.standardUser.password
  );

  await expect(productsPage.title).toHaveText('Dashboard');
});