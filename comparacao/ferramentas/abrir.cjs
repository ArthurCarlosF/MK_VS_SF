const fs=require('fs'),path=require('path'),{spawn}=require('child_process'),{pathToFileURL}=require('url');
const home=path.resolve(__dirname,'..'),project=path.dirname(home);
const run=fs.readFileSync(path.join(home,'ULTIMA EXECUCAO.txt'),'utf8').trim(),file=path.join(run,'index.html');
if(!fs.existsSync(file))throw Error('Nenhuma comparação concluída. Execute a comparação primeiro.');
const child=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',[
 '--user-data-dir='+path.join(project,'dados/navegador'),'--no-first-run','--app='+pathToFileURL(file).href
],{detached:true,stdio:'ignore',windowsHide:false});child.unref();
