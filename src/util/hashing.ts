import Crypto from 'crypto';
export function hashString(value): string {
	return Crypto.createHash('sha256').update(value).digest('base64');
}
