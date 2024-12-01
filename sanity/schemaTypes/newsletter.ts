import {SchemaTypeDefinition} from 'sanity'

const newsletter: SchemaTypeDefinition = {
  name: 'newsletter',
  title: 'Newsletter',
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
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
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
}
export default newsletter
