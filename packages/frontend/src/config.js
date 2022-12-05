import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0x5e50ba700443FfA87d3A02039234dAA4F3c59A36'
export const CANON_ADDRESS = '0xB6422080B02999c8f65aaC5d0D850cBD8730ec03'
// export const ETH_PROVIDER_URL = 'https://goerli-arb.tubby.cloud'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const KEY_SERVER = 'https://keys.unirep.io/2-alpha-2/'
// export const SERVER = 'https://canon.tubby.cloud'
export const SERVER = 'http://localhost:8000'
