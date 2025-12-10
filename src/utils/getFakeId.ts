export function getFakeId(realId: string) {
  if (!realId) return 'N/A';
  let hash = 0;
  for (let i = 0; i < realId.length; i++) {
    hash = (hash << 5) - hash + realId.charCodeAt(i);
    hash |= 0; 
  }
  return `#${Math.abs(hash).toString(16)}`;
}
