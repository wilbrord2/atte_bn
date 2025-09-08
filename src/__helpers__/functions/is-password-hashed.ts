export function IsPasswordHashed(password: string | null): boolean {
        if (!password || typeof password !== 'string') {
                return false; // If password is null or not a string, it's not hashed
        }

        // Regular expression to match bcrypt hashed passwords
        const bcryptRegex = /^\$2[aby]\$.+$/i;

        return bcryptRegex.test(password);
}
