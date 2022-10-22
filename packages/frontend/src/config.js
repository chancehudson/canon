export const UNIREP_ADDRESS = '0xBf9E8b3B0FED002e0eE97B4A5dE2a0761B3E3fFD'
export const ETH_PROVIDER_URL = 'wss://opt-goerli.g.alchemy.com/v2/C_Y7sd1-CSmvHUmu5Dx0w750Uzc-TG8Q'

export const provider = ETH_PROVIDER_URL.startsWith('http') ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL) : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const SERVER = 'http://localhost:8000'
