import { test, expect } from '@playwright/test';

test('generates art on the home page', async ({ page }) => {
  await page.goto('/');
  await page.fill('.gen-input', 'HELLO');
  await expect(page.locator('.ascii-output')).not.toBeEmpty();
});

test('cycles theme with T', async ({ page }) => {
  await page.goto('/');
  const before = await page.locator('html').getAttribute('data-theme');
  await page.keyboard.press('t');
  const after = await page.locator('html').getAttribute('data-theme');
  expect(after).not.toBe(before);
});

test('fonts gallery shows attribution', async ({ page }) => {
  await page.goto('/fonts');
  await expect(page.locator('.font-card').first()).toBeVisible();
});

test('docs page renders nav', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.locator('.docs-sidebar')).toBeVisible();
});
