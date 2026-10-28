import { Locator } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

export class FilterBar extends BasePage {
  readonly resetFiltersBtn: Locator;
  readonly saveSearchBtn: Locator;

  constructor(page: any) {
    super(page);
    this.resetFiltersBtn = this.page.getByText("Reset filters");
    this.saveSearchBtn = this.page.locator("#button-search");
  }

  async clickSaveSearch() {
    const saveIcon = this.page.locator("button:nth-child(2)").first();
    await saveIcon.click();
  }

  async saveCurrentSearchWithName(name: string) {
    await this.clickSaveSearch();
    const nameInput = this.page
      .getByPlaceholder(/name/i)
      .or(this.page.locator('input[type="text"]').last());
    await nameInput.fill(name);
    await this.page.getByRole("button", { name: "Ok" }).click();
  }

  async resetFilters() {
    await this.resetFiltersBtn.click();
    await this.waitForPageReady();
  }
}
