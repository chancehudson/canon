import path from 'path'
import * as snarkjs from 'snarkjs'
import fs from 'fs'
import url from 'url'
import { exec } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const keyPath = path.join(__dirname, '../../keys')
const prefix = 'canon-tmp-' // prefix for tmp files

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function cmd(cmd) {
  let child = exec(cmd);
  return new Promise((resolve, reject) => {
    child.addListener("error", reject);
    child.addListener("close", resolve);
    child.stderr.on('data', (data) => {
      reject(data)
    });
    child.stdout.on('data', (data) => {
      resolve(data)
    });
  });
}

export default {

  genProofAndPublicSignals: async (
    circuitName,
    inputs
  ) => {
    // generate a new temporary file
    const folder = await new Promise((resolve, reject) => {
      fs.mkdtemp('canon-tmp-', (err, folder) => {
        return err ? reject(err) : resolve(folder)
      })
    });
    console.log('f', folder);
    // define key filepaths
    const circuitWasmPath = path.join(
      keyPath,
      `${circuitName}.wasm`
    );
    // define temporary proving artifact filepaths
    const witnessPath = path.join(folder, `${circuitName}.witness`);
    const zkeyPath = path.join(keyPath, `${circuitName}.zkey`);
    const proofPath = path.join(folder, `${circuitName}-proof.json`);
    const publicSignalsPath = path.join(folder, `${circuitName}-signals.json`);
    // calculate witness and write to fs
    await snarkjs.wtns.calculate(inputs, circuitWasmPath, witnessPath);
    // spawn child_process to build proof and public signals using rapidsnark
    try {
      await cmd(`rapidsnark ${zkeyPath} ${witnessPath} ${proofPath} ${publicSignalsPath}`);
      console.log('q', q);
    } catch (e) {
      throw new Error(e)
    }
    return { proof: require(proofPath), publicSignals: require(publicSignalsPath) }
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
