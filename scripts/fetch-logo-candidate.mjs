// Bounded binary transport for the opt-in Python review collector; never publishes.
import {safeHttpsFetch} from './safe-https.mjs';
import {fetchHttps} from './check-streams.mjs';
if(process.platform!=='linux')throw Error('Use WSL2 Linux Node');
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
let reader,response;
try{
 const result=await fetchHttps(process.argv[2],{method:'GET',signal:controller.signal,maxBytes:131072},safeHttpsFetch);
 response=result.response;if(!response.ok)throw Error('Unsuccessful image response');
 reader=response.body?.getReader();const chunks=[];let size=0;
 while(reader){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>131072)throw Error('Review image exceeds 128 KiB collector budget');chunks.push(Buffer.from(value));}
 if(size>=131072)throw Error('Image reaches review ceiling; completeness unconfirmed');
 process.stdout.write(Buffer.concat(chunks));
}finally{clearTimeout(timer);controller.abort();await reader?.cancel().catch(()=>{});if(!reader)await response?.body?.cancel().catch(()=>{});}
