import hardhat from 'hardhat'
const { ethers } = hardhat

const UNIREP_ADDRESS = '0x24b540A1E487fdb0a30140Ad3ADe82CCa5F4e1F4'

const Canon = await ethers.getContractFactory('Canon')
const canon = await Canon.deploy(UNIREP_ADDRESS)
await canon.deployed()
console.log(`Deployed at ${canon.address}`)
