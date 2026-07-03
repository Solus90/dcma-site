import siteSettings from './siteSettings'
import homePage from './homePage'
import fridgePage from './fridgePage'
import aboutPage, { aboutTextItem, aboutTocItem } from './aboutPage'
import page from './page'
import contactSubmission from './contactSubmission'
import { cta, card, navLink, contactFormCopy, errorPageCopy } from './objects'
import { pageSectionTypes } from './pageSections'

export const schemaTypes = [
  siteSettings,
  homePage,
  fridgePage,
  aboutPage,
  page,
  contactSubmission,
  ...pageSectionTypes,
  aboutTextItem,
  aboutTocItem,
  cta,
  card,
  navLink,
  contactFormCopy,
  errorPageCopy,
]
