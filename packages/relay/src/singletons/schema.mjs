import { schema } from '@unirep/core'

const _schema = [
  {
    name: 'Section',
    rows: [
      ['epoch', 'Int'],
      ['content', 'String'],
      ['graffiti', 'String'],
      ['contentHash', 'String'],
      ['graffitiHash', 'String'],
      ['id', 'String'],
      ['author', 'String'],
      ['confirmed', 'Int'],
      {
        name: 'voteCount',
        type: 'Int',
        default: 0,
      }
    ],
  },
  {
    name: 'Canon',
    rows: [
      ['epoch', 'Int', { unique: true }],
      ['sectionId', 'String'],
      ['voteCount', 'Int']
    ]
  },
  {
    name: 'AccountTransaction',
    primaryKey: 'signedData',
    rows: [
      ['signedData', 'String'],
      ['address', 'String'],
      ['nonce', 'Int']
    ]
  },
  {
    name: 'AccountNonce',
    primaryKey: 'address',
    rows: [
      ['address', 'String'],
      ['nonce', 'Int'],
    ],
  }
]

export default [...schema, ..._schema]
