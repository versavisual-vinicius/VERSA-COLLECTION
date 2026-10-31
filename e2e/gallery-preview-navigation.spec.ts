// Source Jam: https://jam.dev/c/ca7db081-5cb3-4621-ac8f-2b223ebf4253
import { expect, test } from '@playwright/test';

test('opens the selected collection preview from the admin workspace', async ({ page }) => {
  await page.goto('/dashboard');

  await page.getByRole('button', { name: 'Painel Admin' }).click();
  await expect(page.getByRole('dialog', { name: 'Painel do Fotógrafo' })).toBeVisible();

  await page
    .getByLabel('Selecionar coleção')
    .selectOption({ label: 'MODEC DIA DAS CRIANÇAS 2026' });
  await page.getByRole('button', { name: 'Abrir Galeria' }).click();

  await expect(page).toHaveURL(/\/\?collection=modec-dia-das-criancas-2026$/);
  await expect(
    page.getByRole('heading', { name: 'MODEC DIA DAS CRIANÇAS 2026', level: 1 }),
  ).toBeVisible();
});
