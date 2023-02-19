import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0x24b540A1E487fdb0a30140Ad3ADe82CCa5F4e1F4'
// export const CANON_ADDRESS = '0x8EB848cc903383986153711eEBdd81CA7d88856B'
export const CANON_ADDRESS = '0xe7fceF4B6c581B42b244F0C5369F026412aAA4B7'
export const ETH_PROVIDER_URL = 'https://arbitrum.goerli.unirep.io'
// export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

// export const KEY_SERVER = 'https://keys.unirep.io/2-alpha-2/'
export const KEY_SERVER = 'http://localhost:8000/build/'
// export const SERVER = 'https://canon.tubby.cloud'
export const SERVER = 'http://localhost:8000'
