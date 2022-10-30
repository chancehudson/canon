import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0x36C02dA8a0983159322a80FFE9F24b1acfF8B570'
export const CANON_ADDRESS = '0x809d550fca64d94Bd9F66E60752A544199cfAC3D'
export const ETH_PROVIDER_URL = 'http://192.168.1.127:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'http://192.168.1.127:8000'
