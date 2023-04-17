import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0xCa61bFcA0107c5952f8bf59f4D510d111cbcE146'
export const CANON_ADDRESS = '0x25575Fb6C5599d84e87e55392B531736ec9a4ecB'
export const ETH_PROVIDER_URL = 'https://arbitrum.goerli.unirep.io'
// export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const KEY_SERVER = 'https://keys.unirep.io/2-beta-3/'
export const SERVER = 'https://api.canon.party'
// export const SERVER = 'http://localhost:8000'
