import { ethers } from 'ethers'
export const UNIREP_ADDRESS = '0xf953b3A269d80e3eB0F2947630Da976B896A8C5b'
export const CANON_ADDRESS = '0xAA292E8611aDF267e563f334Ee42320aC96D0463'
export const ETH_PROVIDER_URL = 'http://localhost:8545'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'http://localhost:8000'
