import { ethers } from 'ethers'

export const UNIREP_ADDRESS = '0xf4B146FbA71F41E0592668ffbF264F1D186b2Ca8'
export const CANON_ADDRESS = '0x172076E0166D1F9Cc711C77Adf8488051744980C'
export const ETH_PROVIDER_URL = 'http://localhost:8545'
// export const PRIVATE_KEY = '0x0f70e777f814334daa4456ac32b9a1fdca75ae07f70c2e6cef92679bad06c88b'
export const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)
