import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0x8D0AfEb50b88B5E837f43AdD8De3ff87390CA865'
export const CANON_ADDRESS = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
// export const ETH_PROVIDER_URL = 'https://arbitrum.goerli.unirep.io'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const KEY_SERVER = 'https://keys.unirep.io/2-beta-2/'
// export const SERVER = 'https://canon.tubby.cloud'
export const SERVER = 'http://localhost:8000'
