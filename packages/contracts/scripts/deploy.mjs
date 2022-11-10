import hardhat from 'hardhat'
const { ethers } = hardhat

import { deployUnirep } from '@unirep/contracts/deploy/index.js'

const [signer] = await ethers.getSigners()
const unirep = await deployUnirep(signer)
console.log(`Unirep address: ${unirep.address}`)


// const UNIREP_ADDRESS = '0x327a6E0ff4DeE02bc7da512fB0514Be412Fe5877'
const UNIREP_ADDRESS = unirep.address

const Canon = await ethers.getContractFactory('Canon')
const canon = await Canon.deploy(UNIREP_ADDRESS)
await canon.deployed()
console.log(`Deployed at ${canon.address}`)
