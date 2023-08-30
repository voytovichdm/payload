import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import path from 'path'

import type { LocalizedPost } from './payload-types.js'

import payload from '../../src/index.js'
import { saveDocAndAssert } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadTest } from '../helpers/configHelpers.js'
import { localizedPostsSlug } from './config.js'
import { englishTitle, spanishLocale } from './shared.js'
const __dirname = path.dirname(new URL(import.meta.url).pathname)

/**
 * TODO: Localization
 *
 * Fieldtypes to test: (collections for each field type)
 *  - localized and non-localized: array, block, group, relationship, text
 *
 * Repeat above for Globals
 */

const { beforeAll, describe } = test
let url: AdminUrlUtil

const defaultLocale = 'en'
const title = 'english title'
const spanishTitle = 'spanish title'
const arabicTitle = 'arabic title'
const description = 'description'

let page: Page
describe('Localization', () => {
  beforeAll(async ({ browser }) => {
    const { serverURL } = await initPayloadTest({
      __dirname,
      init: {
        local: false,
      },
    })

    url = new AdminUrlUtil(serverURL, localizedPostsSlug)

    const context = await browser.newContext()
    page = await context.newPage()
  })

  describe('localized text', () => {
    test('create english post, switch to spanish', async () => {
      await page.goto(url.create)

      await fillValues({ title, description })
      await saveDocAndAssert(page)

      // Change back to English
      await changeLocale('es')

      // Localized field should not be populated
      await expect(page.locator('#field-title')).toBeEmpty()
      await expect(page.locator('#field-description')).toHaveValue(description)

      await fillValues({ title: spanishTitle, description })
      await saveDocAndAssert(page)
      await changeLocale(defaultLocale)

      // Expect english title
      await expect(page.locator('#field-title')).toHaveValue(title)
      await expect(page.locator('#field-description')).toHaveValue(description)
    })

    test('create spanish post, add english', async () => {
      await page.goto(url.create)

      const newLocale = 'es'

      // Change to Spanish
      await changeLocale(newLocale)

      await fillValues({ title: spanishTitle, description })
      await saveDocAndAssert(page)

      // Change back to English
      await changeLocale(defaultLocale)

      // Localized field should not be populated
      await expect(page.locator('#field-title')).toBeEmpty()
      await expect(page.locator('#field-description')).toHaveValue(description)

      // Add English

      await fillValues({ title, description })
      await saveDocAndAssert(page)
      await saveDocAndAssert(page)

      await expect(page.locator('#field-title')).toHaveValue(title)
      await expect(page.locator('#field-description')).toHaveValue(description)
    })

    test('create arabic post, add english', async () => {
      await page.goto(url.create)

      const newLocale = 'ar'

      // Change to Arabic
      await changeLocale(newLocale)

      await fillValues({ title: arabicTitle, description })
      await saveDocAndAssert(page)

      // Change back to English
      await changeLocale(defaultLocale)

      // Localized field should not be populated
      await expect(page.locator('#field-title')).toBeEmpty()
      await expect(page.locator('#field-description')).toHaveValue(description)

      // Add English

      await fillValues({ title, description })
      await saveDocAndAssert(page)
      await saveDocAndAssert(page)

      await expect(page.locator('#field-title')).toHaveValue(title)
      await expect(page.locator('#field-description')).toHaveValue(description)
    })
  })

  describe('localized duplicate', () => {
    let id

    beforeAll(async () => {
      const localizedPost = await payload.create({
        collection: localizedPostsSlug,
        data: {
          title: englishTitle,
        },
      })
      id = localizedPost.id
      await payload.update({
        collection: localizedPostsSlug,
        id,
        locale: spanishLocale,
        data: {
          title: spanishTitle,
        },
      })
    })

    test('should duplicate data for all locales', async () => {
      await page.goto(url.edit(id))

      await page.locator('.btn.duplicate').first().click()
      await expect(page.locator('.Toastify')).toContainText('successfully')

      await expect(page.locator('#field-title')).toHaveValue(englishTitle)

      await changeLocale(spanishLocale)
      await expect(page.locator('#field-title')).toHaveValue(spanishTitle)
    })
  })
})

async function fillValues(data: Partial<LocalizedPost>) {
  const { title: titleVal, description: descVal } = data

  if (titleVal) await page.locator('#field-title').fill(titleVal)
  if (descVal) await page.locator('#field-description').fill(descVal)
}

async function changeLocale(newLocale: string) {
  await page.locator('.localizer >> button').first().click()
  await page.locator(`.localizer >> a:has-text("${newLocale}")`).click()
  expect(page.url()).toContain(`locale=${newLocale}`)
}