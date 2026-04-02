
export function toHash(value: string) {
    // Source: https://www.geeksforgeeks.org/javascript/how-to-create-hash-from-string-in-javascript/

    let hash = 0;

    if (value.length === 0) return hash;

    for (let i = 0; i < value.length; i++) {
        const char = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    if (hash < 0)
        hash *= -1;
    return hash;
}