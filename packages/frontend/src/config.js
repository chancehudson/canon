import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0xB69426AC9537623B7c69622b8dfF6058D9D78b6c'
export const CANON_ADDRESS = '0xcF9e9683734926846CfE4875Ce09E498df7FF9a7'
export const ETH_PROVIDER_URL = 'https://arbitrum.goerli.unirep.io'
// export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const KEY_SERVER = 'https://keys.unirep.io/2-alpha-2/'
// export const SERVER = 'https://canon.tubby.cloud'
export const SERVER = 'http://localhost:8000'
