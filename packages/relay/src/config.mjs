import { ethers } from 'ethers'
import { config } from 'dotenv'
config()

export const UNIREP_ADDRESS = process.env.UNIREP_ADDRESS ?? '0x5e50ba700443FfA87d3A02039234dAA4F3c59A36'
export const CANON_ADDRESS = process.env.CANON_ADDRESS ?? '0xf8584F960d6AE7552a6f37298007a1595ACa306A'
export const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL ?? 'https://goerli-arb.tubby.cloud'
export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '0x4fba49cf81efd3609744b42bfaafbd1fa55b381ee9de06045677842cf38ee940'

export const DB_PATH = process.env.DB_PATH ?? ':memory:'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)
