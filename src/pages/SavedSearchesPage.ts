import { Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SavedSearchesPage extends BasePage {
  readonly searchInput: Locator;
  readonly teamSavedSearchesHeader: Locator;
  readonly catalogCards: Locator;
  readonly emptyStateMessage: Locator;

  constructor(page: any) {
    super(page);
    this.searchInput = this.page.getByPlaceholder("Search in saved searches");
    this.teamSavedSearchesHeader = this.page.locator(
      "text=Team Saved Searches",
    );
    this.catalogCards = this.page.locator("#tiles .catalogItem");
    this.emptyStateMessage = this.page.locator(
      "text=This saved search shows all files that cannot be previewed",
    );
  }

  async getCatalogCardsCount(): Promise<number> {
    await expect(this.catalogCards.first()).toBeVisible({ timeout: 15000 });
    return await this.catalogCards.count();
  }

  async expectCatalogCardsCount(expectedCount: number) {
    await expect(this.catalogCards).toHaveCount(expectedCount, {
      timeout: 15000,
    });
  }
  async expandFolder() {
    const folder = this.page
      .locator("div")
      .filter({ hasText: /^Restricted$/ })
      .nth(2);
    await folder.waitFor({ state: "visible", timeout: 10000 });
    await folder.click();
  }

  async navigateToSavedSearches() {
    if (!(await this.searchInput.isVisible())) {
      const glassIcon = this.page.locator("#button-search");
      await glassIcon.click().catch(async () => {
        await this.page.goto("/#saved-searches").catch(() => {});
      });
    }
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });
  }

  getSavedSearchItem(name: string): Locator {
    return this.page
      .locator('li, [role="treeitem"]')
      .filter({ hasText: name })
      .last();
  }

  async selectSavedSearch(name: string) {
    const item = this.getSavedSearchItem(name);
    await item.hover();
    await item.click();
    await this.waitForPageReady();
  }

  async deleteSavedSearch(name: string) {
    const item = this.getSavedSearchItem(name);
    await item.hover();
    const deleteBtn = item.getByTestId("savedSearchDelete");
    await deleteBtn.hover();
    await deleteBtn.click();

    const confirmBtn = this.page.getByRole("button", {
      name: "Delete",
    });
    if (await confirmBtn.isVisible({ timeout: 2000 })) {
      await confirmBtn.click();
    }
  }

  async searchInSidebar(query: string) {
    await this.searchInput.fill(query);
  }
}
