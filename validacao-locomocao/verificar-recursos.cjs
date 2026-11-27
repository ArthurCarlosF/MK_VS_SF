const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../expansao'),c={window:{}};vm.createContext(c);
vm.runInContext(fs.readFileSync(path.join(root,'arena/locomocao-validada-data.js'),'utf8'),c);
const data=c.window.NATIVE_GROUND_GAITS;assert.equal(Object.keys(data).length,43);
let assets=0;for(const [id,gait] of Object.entries(data))for(const asset of Object.values(gait.assets)){assert(fs.existsSync(path.join(root,'arena',asset.file)),`${id}: ${asset.file}`);assets++;}
console.log(`PASS: 43 perfis aprovados e ${assets} recursos presentes`);
