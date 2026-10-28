import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;
  readonly globalLoader: Locator;

  constructor(page: Page) {
    this.page = page;
    // Спільний лоадер/індикатор обробки (на скріншоті у верхній панелі "5 Processing...")
    this.globalLoader = page.locator("text=Processing");
  }

  /**
   * Базовий перехід за відносним або абсолютним шляхом
   */
  async open(path: string = "/") {
    await this.page.goto(path);
    await this.waitForPageReady();
  }

  /**
   * Очікування завершення завантаження DOM та мережевої активності
   */
  async waitForPageReady() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Очікування зникнення глобального лоадера обробки файлів
   */
  async waitForProcessingComplete(timeout: number = 10000) {
    if (await this.globalLoader.isVisible()) {
      await expect(this.globalLoader).not.toBeVisible({ timeout });
    }
  }
}
