import { test, expect } from '@playwright/test';

test('has title and main heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Pylon/);

  // Expect the main hero heading to be visible.
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();
});

test('can navigate to catalog', async ({ page }) => {
  await page.goto('/');

  // Find a link or button that says "Catalog"
  const catalogLink = page.getByRole('link', { name: /Catalog/i }).first();
  if (await catalogLink.isVisible()) {
    await catalogLink.click();
    await expect(page).toHaveURL(/.*catalog/);
  }
});
