// Explicitly independent of legacy rightsStatus. This predicate is a proposed
// client contract, not a migration of existing playback controls.
export function directListeningReady(stream) {
  return stream?.verificationStatus==='verified' && stream.directListening?.status==='allowed';
}
export function policyErrors(stream,sources) {
  if(!Object.hasOwn(stream,'directListening'))return [];
  const p=stream.directListening,errors=[];
  if(!p || typeof p!=='object' || Array.isArray(p))return ['directListening must be an object'];
  const keys=['status','reviewedAt','sourceId','notes','recording','redistribution'];
  if(Object.keys(p).some(k=>!keys.includes(k))||keys.some(k=>!Object.hasOwn(p,k)))errors.push('directListening fields invalid');
  if(!['needs-review','restricted','allowed'].includes(p.status))errors.push('directListening status invalid');
  if(typeof p.notes!=='string'||!p.notes.trim())errors.push('directListening needs a public review rationale');
  if(!sources.has(p.sourceId))errors.push('directListening source missing');
  if(typeof p.reviewedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(p.reviewedAt)||!Number.isFinite(Date.parse(p.reviewedAt)))errors.push('directListening review timestamp invalid');
  for(const key of ['recording','redistribution'])if(!['unconfirmed','prohibited','permission-granted'].includes(p[key]))errors.push(`directListening ${key} invalid`);
  if(p.status==='allowed'&&(stream.verificationStatus!=='verified'||sources.get(p.sourceId)?.kind!=='official'))errors.push('allowed directListening requires verified playback and official use evidence');
  return errors;
}
