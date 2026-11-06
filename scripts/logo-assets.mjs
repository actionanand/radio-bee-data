import {readFileSync,realpathSync,statSync,lstatSync} from 'node:fs';
import path from 'node:path';

export const logoPathPattern='^assets/logos/(stations|networks)/[a-z0-9]+(-[a-z0-9]+)*\\.(webp|png)$';
export const validLogoPath=value=>typeof value==='string' && new RegExp(logoPathPattern).test(value);
export function imageDimensions(bytes,extension) {
  if(extension==='.png' && bytes.length>=33 && bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')) && bytes.toString('ascii',12,16)==='IHDR' && bytes.readUInt32BE(8)===13)
    return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),format:'png'};
  if(extension==='.webp' && bytes.length>=25 && bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP' && bytes.readUInt32LE(4)+8===bytes.length) {
    const kind=bytes.toString('ascii',12,16);
    if(kind==='VP8X' && bytes.length>=30)return {width:1+bytes.readUIntLE(24,3),height:1+bytes.readUIntLE(27,3),format:'webp'};
    if(kind==='VP8L' && bytes[20]===47)return {width:1+((bytes[22]&63)<<8|bytes[21]),height:1+((bytes[24]&15)<<10|bytes[23]<<2|bytes[22]>>6),format:'webp'};
    if(kind==='VP8 ' && bytes.length>=30 && bytes.subarray(23,26).equals(Buffer.from([157,1,42])))return {width:bytes.readUInt16LE(26)&16383,height:bytes.readUInt16LE(28)&16383,format:'webp'};
  }
  throw Error('unsupported or invalid PNG/WebP header');
}
export function inspectLogo(root,logoPath) {
  if(!validLogoPath(logoPath))throw Error('invalid logoPath; expected assets/logos/stations|networks/<slug>.png|webp');
  const base=realpathSync(path.join(root,'data/v1'));
  let entry=base;
  for(const part of logoPath.split('/')) {
    entry=path.join(entry,part);
    if(lstatSync(entry).isSymbolicLink())throw Error('logoPath escapes or uses a symlink; artwork must be portable regular files');
  }
  const file=realpathSync(path.join(base,logoPath));
  const relative=path.relative(base,file);
  if(relative.startsWith('..') || path.isAbsolute(relative) || !relative.split(path.sep).slice(0,2).every((v,i)=>v===['assets','logos'][i]))throw Error('logoPath escapes assets/logos through symlink');
  const size=statSync(file).size;
  if(!statSync(file).isFile() || size<1 || size>262144)throw Error('logo must be a file of 1–262144 bytes');
  const dimensions=imageDimensions(readFileSync(file),path.extname(logoPath));
  if(!dimensions.width || !dimensions.height || dimensions.width>512 || dimensions.height>512)throw Error('logo dimensions must be 1–512 pixels per side');
  return {path:logoPath,bytes:size,...dimensions};
}
