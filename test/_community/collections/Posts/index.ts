import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

import { mediaSlug } from '../Media'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  versions: true,
  fields: [
    // validation code here

    {
      name: 'validation',
      type: 'group',
      fields: [
        {
          name: 'startDate',
          type: 'date',
        },
        {
          name: 'endDate',
          type: 'date',
          validate: (value, { _, siblingData }) => {
            if (value <= siblingData?.startDate) {
              return 'End date must be after start date'
            }
          },
        },
      ],
    },

    // conditional logic - checkbox

    {
      name: 'conditionalLogic1',
      label: 'Conditional Logic - Checkbox',
      type: 'group',
      fields: [
        {
          name: 'addLink',
          type: 'checkbox',
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData.addLink,
          },
        },
      ],
    },

    // conditional logic - select

    {
      name: 'conditionalLogic2',
      label: 'Conditional Logic - Select',
      type: 'group',
      fields: [
        {
          name: 'heroType',
          type: 'select',
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'Minimal',
              value: 'minimal',
            },
            {
              label: 'FeaturedPost',
              value: 'post',
            },
          ],
        },
        {
          name: 'minimal',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData.heroType === 'minimal',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'media',
              type: 'relationship',
              relationTo: mediaSlug,
            },
          ],
        },
        {
          name: 'featuredPost',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData.heroType === 'post',
          },
          fields: [
            {
              name: 'post',
              type: 'relationship',
              relationTo: postsSlug,
            },
            {
              name: 'content',
              type: 'richText',
            },
          ],
        },
      ],
    },

    // Collapsible field
    {
      label: ({ data }) => data?.title || 'Collapsible',
      type: 'collapsible',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'someTextField',
          type: 'text',
        },
        {
          label: 'Nested Collapsible',
          type: 'collapsible',
          fields: [
            {
              name: 'nestedTextField',
              type: 'text',
            },
            {
              name: 'andAgain',
              type: 'text',
            },
          ],
        },
      ],
    },

    // something else
  ],
}
