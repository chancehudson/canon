import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef'
export const CANON_ADDRESS = '0xc5a5C42992dECbae36851359345FE25997F5C42d'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'http://localhost:8000'
