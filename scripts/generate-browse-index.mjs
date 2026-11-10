import {writeFileSync,renameSync,rmSync} from 'node:fs';
import {randomUUID} from 'node:crypto';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {readCatalogue,validateCatalogue} from './validate.mjs';import {buildBrowseIndex} from './catalogue-navigation.mjs';
export function generateBrowseIndex(root=path.resolve(fileURLToPath(new URL('..',import.meta.url)))) {
 const data=readCatalogue(root,'v2');if(data.index.schemaVersion!==2||data.index.files.browseIndex!=='browse-index.json')throw Error('v2 browse index is not enabled in manifest');
 data.browseIndex=buildBrowseIndex(data);const errors=validateCatalogue(data,{root,version:'v2'});if(errors.length)throw Error(errors.join('\n'));
 const dest=path.join(root,'data/v2/browse-index.json'),temp=dest+'.'+randomUUID()+'.tmp';
 try{writeFileSync(temp,JSON.stringify(data.browseIndex,null,2)+'\n',{flag:'wx'});renameSync(temp,dest);}finally{rmSync(temp,{force:true});}
 return data.browseIndex;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const result=generateBrowseIndex();console.log('Generated browse index for '+result.totals.all+' unique stations.');}
