import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const singletons = ['siteSettings', 'homePage', 'fridgePage']

export default defineConfig({
  name: 'default',
  title: 'Door County Mutual Aid',
  projectId: '1qb86j9s',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site Settings').child(
              S.document().schemaType('siteSettings').documentId('siteSettings'),
            ),
            S.listItem().title('Home Page').child(
              S.document().schemaType('homePage').documentId('homePage'),
            ),
            S.listItem().title('Full Hearts Fridge').child(
              S.document().schemaType('fridgePage').documentId('fridgePage'),
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !singletons.includes(t.schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletons.includes(schemaType)
        ? actions.filter((a) => !['unpublish', 'delete', 'duplicate'].includes(a.action ?? ''))
        : actions,
  },
})
