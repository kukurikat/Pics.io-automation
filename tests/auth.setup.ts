import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";

setup("authenticate session", async ({ page }) => {
  setup.setTimeout(120000);

  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  if (!email || !password) {
    throw new Error("USER_EMAIL and USER_PASSWORD must be set in .env");
  }

  // 1. Відкриваємо сайт
  await page.goto("https://pics.io");

  const cookieHeading = page.getByRole("heading", { name: "We use cookies" });
  const acceptAllButton = page.getByRole("button", { name: "Accept All" });

  try {
    // Очікуємо появу заголовка банера до 4 секунд
    await expect(cookieHeading).toBeVisible({ timeout: 4000 });
    await acceptAllButton.click();
  } catch {
    // Якщо банер не з'явився (наприклад, вже збережено у сесії), продовжуємо далі
  }

  // 2. Клікаємо на посилання "Log in" за допомогою getByRole
  await page.getByRole("link", { name: "Log in" }).click();

  // 4. Заповнюємо облікові дані
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill(password);

  // 5. Натискаємо кнопку підтвердження входу
  await page.getByRole("button", { name: "Log in" }).click();

  // 6. Очікуємо переходу в робочий простір (до появи заголовка Team Saved Searches)
  await page.waitForURL(/.*pics\.io/);
  await expect(
    page.getByRole("textbox", { name: "Search collections" }),
  ).toBeVisible({ timeout: 60000 });

  // 7. Зберігаємо згенеровану сесію
  await page.context().storageState({ path: STORAGE_STATE });
});
