import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07'
export const CANON_ADDRESS = '0x162A433068F51e18b7d13932F27e66a3f99E6890'
// export const ETH_PROVIDER_URL = 'https://goerli-arb.tubby.cloud'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

// export const SERVER = 'https://canon.tubby.cloud'
export const SERVER = 'http://localhost:8000'
