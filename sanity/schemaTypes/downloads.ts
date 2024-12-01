import {SchemaTypeDefinition} from 'sanity'

const downloads: SchemaTypeDefinition = {
  name: 'downloads',
  title: 'Downloads',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().max(80).warning('Titles should be short and descriptive'),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Technical Writing', value: 'technicalWriting'},
          {title: 'Circulars & Orders', value: 'circulars'},
          {title: 'Election Nomination', value: 'electionNomination'},
          {title: 'IS Codes', value: 'isCodes'},
          {title: 'IRC Codes', value: 'ircCodes'},
          {title: 'Handbooks', value: 'handbooks'},
          {title: 'Handbooks', value: 'handbooks'},
          {title: 'Others', value: 'others'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().warning('Please select a category'),
    },
    {
      name: 'file',
      title: 'Document',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx',
      },
      validation: (Rule) => Rule.required().error('Please upload a document (PDF or DOC format)'),
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'file',
    },
  },
}

export default downloads
