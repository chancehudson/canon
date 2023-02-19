import hardhat from 'hardhat'
const { ethers } = hardhat

// import { deployUnirep } from '@unirep/contracts/deploy/index.js'

// const [signer] = await ethers.getSigners()
// const unirep = await deployUnirep(signer)
// console.log(`Unirep address: ${unirep.address}`)


const UNIREP_ADDRESS = '0x24b540A1E487fdb0a30140Ad3ADe82CCa5F4e1F4'
// const UNIREP_ADDRESS = unirep.address

const Canon = await ethers.getContractFactory('Canon')
const canon = await Canon.deploy(UNIREP_ADDRESS)
await canon.deployed()
console.log(`Deployed at ${canon.address}`)
