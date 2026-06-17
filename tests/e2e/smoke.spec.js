import { test, expect } from '@playwright/test';

test('loads without console or page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});

test('nav links scroll to the matching section', async ({ page }) => {
  await page.goto('/');
  await page.click('nav.links a[href="#proiecte"]');
  await expect(page.locator('#proiecte')).toBeInViewport();
});

test('contact and social links point to the right destinations', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.mail-link')).toHaveAttribute('href', 'mailto:lvisoiu300@gmail.com');
  await expect(page.locator('a[href*="github.com/Leonard401"]')).toBeVisible();
  await expect(page.locator('a[href*="linkedin.com/in/leonard-visoiu"]')).toBeVisible();
});

test('reduced motion hides the custom cursor', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#curDot')).toBeHidden();
  await expect(page.locator('#curRing')).toBeHidden();
});

test('renders without horizontal overflow on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
  expect(hasOverflow).toBeFalsy();
});
