import hardhat from 'hardhat'
const { ethers } = hardhat
import { deployUnirep } from '@unirep/contracts/deploy/index.js'

const [signer] = await ethers.getSigners()
const unirep = await deployUnirep(signer)
console.log(`Unirep address: ${unirep.address}`)

const Canon = await ethers.getContractFactory('Canon')
const canon = await Canon.deploy(unirep.address)
await canon.deployed()
console.log(`Deployed at ${canon.address}`)
