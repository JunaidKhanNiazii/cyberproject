// Basic RSA Utilities for demonstration purposes
// Note: In a production app, use a dedicated crypto library like WebCrypto or Forge

export const gcd = (a, b) => {
    while (b) {
        a %= b;
        [a, b] = [b, a];
    }
    return a;
};

export const modInverse = (e, phi) => {
    let [m0, y, x] = [phi, 0, 1];
    if (phi === 1) return 0;
    while (e > 1) {
        let q = Math.floor(e / phi);
        let t = phi;
        phi = e % phi;
        e = t;
        t = y;
        y = x - q * y;
        x = t;
    }
    if (x < 0) x += m0;
    return x;
};

export const isPrime = (n) => {
    const num = typeof n === 'bigint' ? n : BigInt(n);
    if (num <= 1n) return false;
    if (num <= 3n) return true;
    if (num % 2n === 0n || num % 3n === 0n) return false;
    for (let i = 5n; i * i <= num; i = i + 6n) {
        if (num % i === 0n || num % (i + 2n) === 0n) return false;
    }
    return true;
};

export const generateRandomPrime = () => {
    const primes = [101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199];
    return BigInt(primes[Math.floor(Math.random() * primes.length)]);
};

// Derive RSA keys from specific primes
export const calculateRSA = (p, q, eVal = 65537n) => {
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = typeof eVal === 'bigint' ? eVal : BigInt(eVal);

    const extendedGCD = (a, b) => {
        if (a === 0n) return [b, 0n, 1n];
        let [g, x1, y1] = extendedGCD(b % a, a);
        let x = y1 - (b / a) * x1;
        let y = x1;
        return [g, x, y];
    };

    let [g, x, y] = extendedGCD(e, phi);
    let d = (x % phi + phi) % phi;

    return { p, q, n, phi, e, d };
};

// Simple RSA generation for demonstration
export const generateRSA = (bits = 1024) => {
    const p = generateRandomPrime();
    let q = generateRandomPrime();
    while (p === q) q = generateRandomPrime();

    return calculateRSA(p, q, 65537n);
};

export const encrypt = (text, e, n) => {
    const chars = text.split('').map(c => BigInt(c.charCodeAt(0)));
    const encrypted = chars.map(m => power(m, e, n));
    return encrypted.join(',');
};

export const decrypt = (cipher, d, n) => {
    const nums = cipher.split(',').map(n => BigInt(n));
    const decrypted = nums.map(c => power(c, d, n));
    return decrypted.map(m => String.fromCharCode(Number(m))).join('');
};

export const power = (base, exp, mod) => {
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % mod;
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return res;
};
