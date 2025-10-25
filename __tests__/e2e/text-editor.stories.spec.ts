import { test, expect } from '@playwright/test';

// Test to verify that the text editor has the expected default labels
test('text editor has default labels', async ({ page }) => {
  await page.goto('/?path=/story/input-default-value--default-value');

  // Wait for the network to be idle
  await page.waitForLoadState('networkidle');

  // Locate the iframe that contains the story
  const storyFrame = page.frameLocator('#storybook-preview-iframe');

  await storyFrame.locator('[data-testid="text-editor-input"]').waitFor({ state: 'visible', timeout: 20000 });
  await expect(storyFrame.getByTestId('text-editor-input')).toBeVisible();
});

// Test to verify that the form is displayed when the button is clicked
test('text editor has default toolbar buttons', async ({ page }) => {
  await page.goto('/?path=/story/input-default-value--default-value');
  // Wait for the network to be idle
  await page.waitForLoadState('networkidle');
  // Locate the iframe that contains the story
  const storyFrame = page.frameLocator('#storybook-preview-iframe');

  await storyFrame.locator('[data-testid="bold"]').waitFor({ state: 'visible', timeout: 15000 });
  await storyFrame.locator('[data-testid="italic"]').waitFor({ state: 'visible', timeout: 10000 });
  await storyFrame.locator('[data-testid="underline"]').waitFor({ state: 'visible', timeout: 10000 });
  await storyFrame.locator('[data-testid="link"]').waitFor({ state: 'visible', timeout: 10000 });
  await storyFrame.locator('[data-testid="bulletList"]').waitFor({ state: 'visible', timeout: 10000 });

  // Verify the button text
  await expect(storyFrame.getByTestId('bold')).toBeVisible();
  await expect(storyFrame.getByTestId('italic')).toBeVisible();
  await expect(storyFrame.getByTestId('underline')).toBeVisible();
  await expect(storyFrame.getByTestId('link')).toBeVisible();
  await expect(storyFrame.getByTestId('bulletList')).toBeVisible();
});

// test form with result
test('text editor has default value', async ({ page }) => {
  // Navigate to the Storybook page for the mui-tiptap-editor component
  await page.goto('/?path=/story/input-default-value--default-value');
  // Wait for the network to be idle
  await page.waitForLoadState('networkidle');
  // Locate the iframe that contains the story
  const storyFrame = page.frameLocator('#storybook-preview-iframe');

  await storyFrame.locator('[data-testid="text-editor-input"]').waitFor({ state: 'visible', timeout: 10000 });
  // check content value "Welcome", it's a child h2 title
  await expect(storyFrame.getByRole('heading', { name: 'Welcome to the Editor' })).toBeVisible();
});
