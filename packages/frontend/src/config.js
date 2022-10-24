import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0xf4B146FbA71F41E0592668ffbF264F1D186b2Ca8'
export const CANON_ADDRESS = '0x172076E0166D1F9Cc711C77Adf8488051744980C'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'http://localhost:8000'
