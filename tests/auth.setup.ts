import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";

setup("authenticate session", async ({ page }) => {
  setup.setTimeout(120000);

  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  if (!email || !password) {
    throw new Error("USER_EMAIL and USER_PASSWORD must be set in .env");
  }

  await page.goto("https://pics.io");

  const cookieHeading = page.getByRole("heading", { name: "We use cookies" });
  const acceptAllButton = page.getByRole("button", { name: "Accept All" });

  try {
    await expect(cookieHeading).toBeVisible({ timeout: 4000 });
    await acceptAllButton.click();
  } catch {}

  await page.getByRole("link", { name: "Log in" }).click();

  await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill(password);

  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForURL(/.*pics\.io/);
  await expect(
    page.getByRole("textbox", { name: "Search collections" }),
  ).toBeVisible({ timeout: 60000 });

  await page.context().storageState({ path: STORAGE_STATE });
});
