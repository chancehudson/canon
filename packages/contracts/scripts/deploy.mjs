import hardhat from 'hardhat'
const { ethers } = hardhat

import { deployUnirep } from '@unirep/contracts/deploy/index.js'

const [signer] = await ethers.getSigners()
const unirep = await deployUnirep(signer)
console.log(`Unirep address: ${unirep.address}`)


// const UNIREP_ADDRESS = '0x5e50ba700443FfA87d3A02039234dAA4F3c59A36'
const UNIREP_ADDRESS = unirep.address

const Canon = await ethers.getContractFactory('Canon')
const canon = await Canon.deploy(UNIREP_ADDRESS)
await canon.deployed()
console.log(`Deployed at ${canon.address}`)