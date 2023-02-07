import path from 'path'
import * as snarkjs from 'snarkjs'
import fs from 'fs'
import url from 'url'
import { exec } from 'child_process'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const keyPath = path.join(__dirname, '../../keys')


export default {

  // /**
  //  * Write input.json to /tmp/
  //  * @notice fed into rapidnsnark
  //  * @param inputs - json object of properly named key value pairs mapping to circuit inputs
  //  */
  // writeInputs: (
  //   inputs
  // ) => {

  // }

  /**
   * Generate the witness for a given input for a circuit and save to fs in /tmp/
   * 
   * @param {string} circuitName - name of zk circuit being used
   * @param {Object} inputs - json object of properly named key value pairs mapping to circuit inputs
   */
  genWitnessFs: async (
    circuitName,
    inputs
  ) => {
    // define path to circuit wasm artifact
    const circuitWasmPath = path.join(
      keyPath,
      `${circuitName}.wasm`
    )
    // define path to export witness file to
    const witnessPath = path.join('tmp', `${circuitName}.wtns`)
    // generate witness and write to /tmp/{CIRCUIT_NAME}.wtns
    await snarkjs.groth16.fullProvingKeyGen(circuitWasmPath, witnessPath, inputs)
  },

  genProofAndPublicSignals: async (
    circuitName,
    inputs
  ) => {
    // write inputs.json to /tmp/inputs.json
    fs.writeFileSync('/tmp/inputs.json', JSON.stringify(inputs));
    // write witness to /tmp/{CIRCUIT_NAME}.wtns
    await this.genWitnessFs(circuitName, inputs);
    // define path to proving artifact inputs / outputs
    const zkeyPath = path.join(keyPath, `${circuitName}.zkey`)
    const witnessPath = path.join("tmp", `${circuitName}.witness`)
    const proofPath = path.join("tmp", `${circuitName}-proof.json`)
    const publicSignalsPath = path.join("tmp", `${circuitName}-signals.json`)
    // spawn child_process to build proof and public signals using rapidsnark
    exec(`rapidsnark ${zkeyPath} ${witnessPath} ${proofPath} ${publicSignalsPath}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      return {
        proof: require(proofPath),
        publicSignals: require(publicSignalsPath)
      }
    });
  },

  genProofAndPublicSignals: async (
    circuitName,
    inputs
  ) => {
    const circuitWasmPath = path.join(
      keyPath,
      `${circuitName}.wasm`
    )
    const zkeyPath = path.join(keyPath, `${circuitName}.zkey`)
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
