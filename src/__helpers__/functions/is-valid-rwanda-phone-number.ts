export function isValidRwandanPhoneNumber(phone: string): boolean {

    const validPhoneNumberFormat = ['25078', '25079', '25073', '25072'];
    for (const format of validPhoneNumberFormat) {
        if (phone.startsWith(format)) {
            return true;
        }
    }
    return false;
}
