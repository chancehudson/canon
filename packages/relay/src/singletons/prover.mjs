import path from 'path'
import * as snarkjs from 'snarkjs'
import fs from 'fs'
import url from 'url'
import { exec } from 'child_process'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const keyPath = path.join(__dirname, '../../keys')
const prefix = 'canon-tmp-' // prefix for tmp files


export default {

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
    // generate a new temporary file
    const { folder } = await fs.mkdtemp('canon-tmp-');
    // write inputs.json to /tmp/inputs.json
    await fs.writeFile('/tmp/inputs.json', JSON.stringify(inputs));
    // write witness to /tmp/{CIRCUIT_NAME}.wtns
    await this.genWitnessFs(circuitName, inputs);
    // define path to proving artifact inputs / outputs
    const zkeyPath = path.join(keyPath, `${circuitName}.zkey`)
    const witnessPath = path.join(folder, `${circuitName}.witness`)
    const proofPath = path.join(folder, `${circuitName}-proof.json`)
    const publicSignalsPath = path.join(folder, `${circuitName}-signals.json`)
    // spawn child_process to build proof and public signals using rapidsnark
    const { err } = await exec(`rapidsnark ${zkeyPath} ${witnessPath} ${proofPath} ${publicSignalsPath}`);
    if (err) {
      console.error(err);
      return;
    } else {
      return {
        proof: require(proofPath),
        publicSignals: require(publicSignalsPath)
      }
    }
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
