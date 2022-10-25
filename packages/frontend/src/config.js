import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0xe1708FA6bb2844D5384613ef0846F9Bc1e8eC55E'
export const CANON_ADDRESS = '0x0aec7c174554AF8aEc3680BB58431F6618311510'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'http://localhost:8000'
