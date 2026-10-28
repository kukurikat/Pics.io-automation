import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  readonly globalLoader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalLoader = page.locator("text=Processing");
  }

  async open(path: string = "/") {
    await this.page.goto(path);
    await this.waitForPageReady();
  }

  async waitForPageReady() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async waitForProcessingComplete(timeout: number = 10000) {
    if (await this.globalLoader.isVisible()) {
      await expect(this.globalLoader).not.toBeVisible({ timeout });
    }
  }
}
