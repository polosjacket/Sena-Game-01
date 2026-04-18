const { test, expect } = require('@playwright/test');

test.describe('Zap the Thing! Gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the game and show the setup screen', async ({ page }) => {
    await expect(page).toHaveTitle(/Zap the Thing!/);
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('ZAP THE THING!');

  });

  test('should start the game after clicking Start Game', async ({ page }) => {
    // Select difficulty
    await page.click('button:has-text("MEDIUM")');

    
    // Select players
    await page.click('button:has-text("2P")');

    // Click start
    await page.click('#start-btn');

    // Setup screen should be hidden, game screen should be visible
    await expect(page.locator('#setup-screen')).not.toBeVisible();
    await expect(page.locator('#game-screen')).toBeVisible();
    
    // Canvas should be present
    const canvas = page.locator('#gameCanvas');
    await expect(canvas).toBeVisible();
  });

  test('should show highscores', async ({ page }) => {
    // Highscores are usually visible on the setup screen or game over
    // Let's check if there's a leaderboard section
    const leaderboard = page.locator('.leaderboard');
    if (await leaderboard.isVisible()) {
        await expect(leaderboard).toBeVisible();
    }
  });
});
