const fs = require('fs')
const path = require('path')

const { abi } = require('../artifacts/contracts/Canon.sol/Canon.json')

fs.writeFileSync(
  path.join(__dirname, '../abi/Canon.json'),
  JSON.stringify(abi)
)
