/**
 * RSA Cryptography Utilities
 * Implementation using BigInt for precision modular arithmetic.
 */

/**
 * Modular exponentiation: (base^exp) % mod
 * Uses the binary exponentiation algorithm (Square-and-Multiply).
 */
export const modPow = (base, exp, mod) => {
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % mod;
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return res;
};

/**
 * Basic primality test for demonstration purposes.
 */
export const isPrime = (n) => {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;
    for (let i = 5n; i * i <= n; i += 6n) {
        if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
};

/**
 * Encrypts a message string into a comma-separated ciphertext of BigInt values.
 * Formula: C = m^e mod n
 */
export const encrypt = (message, e, n) => {
    if (!e || !n) throw new Error("Public key (e, n) is required for encryption.");

    const eBI = BigInt(e);
    const nBI = BigInt(n);

    return message
        .split('')
        .map(char => {
            const m = BigInt(char.charCodeAt(0));
            return modPow(m, eBI, nBI).toString();
        })
        .join(',');
};

/**
 * Decrypts a comma-separated ciphertext of BigInt values back into a message string.
 * Formula: m = c^d mod n
 */
export const decrypt = (ciphertext, d, n) => {
    if (!d || !n) throw new Error("Private key (d, n) is required for decryption.");

    const dBI = BigInt(d);
    const nBI = BigInt(n);

    return ciphertext
        .split(',')
        .map(c => {
            const charCode = Number(modPow(BigInt(c), dBI, nBI));
            return String.fromCharCode(charCode);
        })
        .join('');
};

/**
 * Calculates RSA components from two prime numbers.
 */
export const calculateRSA = (p, q, e = 65537n) => {
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    // Iterative Extended Euclidean Algorithm to find modular inverse
    const extendedGCD = (a, b) => {
        let old_r = a, r = b;
        let old_s = 1n, s = 0n;
        let old_t = 0n, t = 1n;

        while (r !== 0n) {
            const quotient = old_r / r;
            [old_r, r] = [r, old_r - quotient * r];
            [old_s, s] = [s, old_s - quotient * s];
            [old_t, t] = [t, old_t - quotient * t];
        }
        return { gcd: old_r, s: old_s, t: old_t };
    };

    const { gcd, s } = extendedGCD(e, phi);
    if (gcd !== 1n) throw new Error("e and phi are not coprime. Choose a different e or different primes.");

    // d is the modular inverse of e modulo phi
    let d = s % phi;
    if (d < 0n) d += phi;

    return { p, q, n, phi, e, d };
};

/**
 * Helper to generate random small primes for demonstration/educational use.
 */
export const generateRandomPrime = () => {
    const primes = [
        101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n,
        151n, 157n, 163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n,
        1009n, 1013n, 1019n, 1021n, 1031n, 1033n, 1039n, 1049n, 1051n, 1061n
    ];
    return primes[Math.floor(Math.random() * primes.length)];
};

/**
 * Automatically generates a complete RSA key pair.
 */
export const generateRSA = () => {
    let p = generateRandomPrime();
    let q = generateRandomPrime();
    while (p === q) q = generateRandomPrime();

    return calculateRSA(p, q);
};
