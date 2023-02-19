import { ethers } from 'ethers'
import { config } from 'dotenv'
config()

export const UNIREP_ADDRESS = process.env.UNIREP_ADDRESS ?? '0x24b540A1E487fdb0a30140Ad3ADe82CCa5F4e1F4'
// export const CANON_ADDRESS = process.env.CANON_ADDRESS ?? '0x8EB848cc903383986153711eEBdd81CA7d88856B'
export const CANON_ADDRESS = '0xe7fceF4B6c581B42b244F0C5369F026412aAA4B7'
export const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL ?? 'https://arbitrum.goerli.unirep.io'
// export const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL ?? 'http://localhost:8545'
// export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '0x4fba49cf81efd3609744b42bfaafbd1fa55b381ee9de06045677842cf38ee940'
export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '0x0f70e777f814334daa4456ac32b9a1fdca75ae07f70c2e6cef92679bad06c88b'

export const DB_PATH = process.env.DB_PATH ?? ':memory:'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)
