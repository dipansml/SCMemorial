export function generateOrderId(): string {
  const hexChars = '0123456789abcdef';

  let randomHex = '';
  const bytes = new Uint8Array(10);
  const cryptoObj: any = (globalThis as any).crypto;
  try {
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
      cryptoObj.getRandomValues(bytes);
      for (let i = 0; i < bytes.length; i++) {
        randomHex += hexChars[bytes[i] % 16];
      }
    }
  } catch {
    randomHex = '';
  }

  if (randomHex.length < 10) {
    randomHex = '';
    for (let i = 0; i < 10; i++) {
      randomHex += hexChars[Math.floor(Math.random() * 16)];
    }
  }

  return `ord-${randomHex}`;
}