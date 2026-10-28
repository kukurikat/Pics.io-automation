import { test, expect } from "@playwright/test";
import { SavedSearchesPage } from "../src/pages/SavedSearchesPage";
import { FilterBar } from "../src/components/FilterBar";

test.describe("Pics.io - Saved Searches Automation Suite", () => {
  let savedSearchesPage: SavedSearchesPage;
  let filterBar: FilterBar;

  test.beforeEach(async ({ page }) => {
    savedSearchesPage = new SavedSearchesPage(page);
    filterBar = new FilterBar(page);

    await page.goto("/", { timeout: 120000 });
    await page.waitForLoadState("domcontentloaded");

    await savedSearchesPage.navigateToSavedSearches();
  });

  test("1. Should successfully create a new saved search", async ({ page }) => {
    const uniqueSearchName = `AutoSearch_${Date.now()}`;

    await filterBar.saveCurrentSearchWithName(uniqueSearchName);

    const newItem = savedSearchesPage.getSavedSearchItem(uniqueSearchName);
    await expect(newItem).toBeVisible({ timeout: 10000 });
  });

  test("2. Should delete an existing saved search", async ({ page }) => {
    const tempSearchName = `ToDelete_${Date.now()}`;

    await filterBar.saveCurrentSearchWithName(tempSearchName);
    await expect(
      savedSearchesPage.getSavedSearchItem(tempSearchName),
    ).toBeVisible();

    await savedSearchesPage.deleteSavedSearch(tempSearchName);

    await expect(
      savedSearchesPage.getSavedSearchItem(tempSearchName),
    ).not.toBeVisible();
  });

  test("3. Should apply an existing saved search and verify its state", async ({
    page,
  }) => {
    await savedSearchesPage.expandFolder();
    await savedSearchesPage.selectSavedSearch("Corrupted files");

    await expect(page.locator("text== 0KB")).toBeVisible({ timeout: 5000 });

    const emptyState = page.locator(
      "text=This saved search shows all files that cannot be previewed",
    );
    await expect(emptyState).toBeVisible();
  });

  test("4. Should reset filters and return to default collection view", async ({
    page,
  }) => {
    const initialCardsCount = await savedSearchesPage.getCatalogCardsCount();

    await savedSearchesPage.expandFolder();
    await savedSearchesPage.selectSavedSearch("Corrupted files");

    const zeroKbChip = page.locator("text== 0KB");
    await expect(zeroKbChip).toBeVisible({ timeout: 10000 });

    await filterBar.resetFilters();

    await expect(zeroKbChip).not.toBeVisible({ timeout: 10000 });

    const emptyState = page.locator(
      "text=This saved search shows all files that cannot be previewed",
    );
    await expect(emptyState).not.toBeVisible({ timeout: 10000 });

    await savedSearchesPage.expectCatalogCardsCount(initialCardsCount);
  });

  test("5. Should filter saved search items using sidebar search input", async () => {
    await savedSearchesPage.searchInSidebar("Corrupted");

    await expect(
      savedSearchesPage.getSavedSearchItem("Corrupted files"),
    ).toBeVisible();

    await expect(
      savedSearchesPage.getSavedSearchItem("Photoshop documents"),
    ).not.toBeVisible();
  });
});
