import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154'
export const CANON_ADDRESS = '0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'http://localhost:8000'
