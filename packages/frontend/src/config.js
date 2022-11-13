import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0xba01c6d23909cdD4F3edAf3a0B97096E46aec227'
export const CANON_ADDRESS = '0x60817191260F11021d3c39F763907b7655156ac4'
 export const ETH_PROVIDER_URL = 'https://goerli-arb.tubby.cloud'
// export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

 export const SERVER = 'https://canon.tubby.cloud'
// export const SERVER = 'http://localhost:8000'
