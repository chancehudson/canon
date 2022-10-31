import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0x327a6E0ff4DeE02bc7da512fB0514Be412Fe5877'
export const CANON_ADDRESS = '0xab4C378CCd0Ae4893ECb02F0c241E9608866Ae48'
export const ETH_PROVIDER_URL = 'https://goerli-arb.tubby.cloud'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'https://canon.tubby.cloud'
