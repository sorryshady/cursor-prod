import {SchemaTypeDefinition} from 'sanity'

const gallery: SchemaTypeDefinition = {
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().max(100).warning('Please keep titles brief and descriptive'),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/*',
            storeOriginalFilename: true,
          },
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.required().min(1).error('At least one image is required'),
    },
  ],
}

export default gallery
