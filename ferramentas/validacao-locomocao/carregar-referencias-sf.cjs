const fs=require('fs'),path=require('path'),crypto=require('crypto');
module.exports=function(folder){
 const base=path.join(folder,'variacao-turbo.json'),source=JSON.parse(fs.readFileSync(base)),files=[base],additional=path.join(folder,'variacao-turbo-adicional-20261127.json');
 if(fs.existsSync(additional)){
  const extra=JSON.parse(fs.readFileSync(additional));if(extra.id!==source.id||extra.fps!==source.fps||extra.romModified!==false)throw Error('Incompatible native witnesses');
  for(const test of source.cases){const added=extra.cases.find(c=>c.id===test.id);if(!added||added.repeats.length!==12)throw Error('Incomplete additional witnesses');test.repeats.push(...added.repeats);}
  files.push(additional);
 }
 const finalFile=path.join(folder,'variacao-turbo-final-akuma-20261127.json');
 if(source.id==='akuma'&&fs.existsSync(finalFile)){
  const final=JSON.parse(fs.readFileSync(finalFile));if(final.id!=='akuma'||final.fps!==source.fps||final.romModified!==false)throw Error('Invalid final Akuma witnesses');
  for(const test of source.cases){const added=final.cases.find(c=>c.id===test.id);if(!added||added.repeats.length!==6)throw Error('Incomplete final Akuma witnesses');test.repeats.push(...added.repeats);}files.push(finalFile);
 }
 source.witnessFiles=files.map(file=>({file:path.basename(file),sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}));return source;
};
