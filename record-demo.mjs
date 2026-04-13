import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  console.log('Launching headless browser to record smooth demo...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: 'public/', size: { width: 1440, height: 900 } },
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark', // Force dark mode for sleek look
  });
  const page = await context.newPage();

  // Start from catalog
  await page.goto('http://localhost:3000/catalog');
  await page.waitForTimeout(1000);

  // Smooth scroll down the catalog
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1500);

  // Hover over the first card and click
  await page.mouse.move(400, 500, { steps: 20 });
  await page.mouse.down();
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(2000);

  // Smooth scroll on the details page
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(2000);

  await context.close();
  await browser.close();

  // rename the generated webm
  const files = fs
    .readdirSync('public/')
    .filter((f) => f.endsWith('.webm') && f !== 'hero-demo.webm');
  if (files.length > 0) {
    if (fs.existsSync('public/hero-demo.webm')) fs.unlinkSync('public/hero-demo.webm');
    fs.renameSync('public/' + files[0], 'public/hero-demo.webm');
    console.log('Successfully recorded and saved public/hero-demo.webm!');
  }
})();
