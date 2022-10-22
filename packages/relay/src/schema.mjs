import { schema } from '@unirep/core'

const _schema = [
  {
    name: 'Section',
    rows: [
      ['epoch', 'Int', { optional: true }],
      ['content', 'String'],
      ['graffiti', 'String'],
      ['hash', 'String'],
      ['author', 'String'],
    ],
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
