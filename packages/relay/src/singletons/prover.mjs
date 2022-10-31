import path from 'path'
import * as snarkjs from 'snarkjs'
import fs from 'fs'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const keyPath = path.join(__dirname, '../../keys')

export default {
  genProofAndPublicSignals: async (
    circuitName,
    inputs
  ) => {
    const circuitWasmPath = path.join(
      __dirname,
      keyPath,
      `${circuitName}.wasm`
    )
    const zkeyPath = path.join(__dirname, keyPath, `${circuitName}.zkey`)
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      circuitWasmPath,
      zkeyPath
    )

    return { proof, publicSignals }
  },

  verifyProof: async (
    circuitName,
    publicSignals,
    proof
  ) => {
    const data = await fs.promises.readFile(path.join(keyPath, `${circuitName}.vkey.json`))
    const vkey = JSON.parse(data.toString())
    return snarkjs.groth16.verify(vkey, publicSignals, proof)
  },

  getVKey: (name) => {
    return require(path.join(keyPath, `${name}.vkey.json`))
  },
}
