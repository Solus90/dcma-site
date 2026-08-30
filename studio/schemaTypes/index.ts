import siteSettings from './siteSettings'
import homePage from './homePage'
import fridgePage from './fridgePage'
import aboutPage, { aboutTextItem, aboutTocItem } from './aboutPage'
import mutualAidPage, { mutualAidBook, mutualAidQuestion } from './mutualAidPage'
import page from './page'
import update from './update'
import updatesPage from './updatesPage'
import contactSubmission from './contactSubmission'
import { cta, card, navLink, contactFormCopy, errorPageCopy } from './objects'
import { pageSectionTypes } from './pageSections'

export const schemaTypes = [
  siteSettings,
  homePage,
  fridgePage,
  aboutPage,
  mutualAidPage,
  updatesPage,
  page,
  update,
  contactSubmission,
  ...pageSectionTypes,
  aboutTextItem,
  aboutTocItem,
  mutualAidBook,
  mutualAidQuestion,
  cta,
  card,
  navLink,
  contactFormCopy,
  errorPageCopy,
]
