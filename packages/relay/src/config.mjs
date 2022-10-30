import { ethers } from 'ethers'

export const UNIREP_ADDRESS = '0x36C02dA8a0983159322a80FFE9F24b1acfF8B570'
export const CANON_ADDRESS = '0x809d550fca64d94Bd9F66E60752A544199cfAC3D'
export const ETH_PROVIDER_URL = 'http://localhost:8545'
// export const PRIVATE_KEY = '0x0f70e777f814334daa4456ac32b9a1fdca75ae07f70c2e6cef92679bad06c88b'
export const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

export const DB_PATH = 'db2.sqlite'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)
