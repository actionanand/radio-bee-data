/**
 * Deliberately narrow exception to the V2 HTTPS stream rule.
 * Preserve only these contributor-supplied legacy HTTP endpoints, not arbitrary
 * http:// streams. No permission, availability or playback success is inferred.
 * V1 remains HTTPS-only.
 */
export const legacyHttpStreams = Object.freeze([
  'http://media2.lankasri.fm/;stream.mp3',
  'http://s2.voscast.com:9370/;',
  'http://117.241.19.61:88/broadwave.mp3',
]);

export function allowedV2StreamUrl(value, validHttps) {
  return validHttps(value) || (typeof value === 'string' && legacyHttpStreams.includes(value));
}
