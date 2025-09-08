export function cleanPhone(phone: string ): string {

    let phoneNumber = phone.replace(/[^0-9]/g, '');
    phoneNumber.slice(-12);

    if(phoneNumber.length === 9 && phoneNumber[0] === '7') {
        phoneNumber = `0${phoneNumber}`;
    };

    if (phoneNumber.length === 10) {
        phoneNumber = `25${phoneNumber}`;
    };

   return phoneNumber;
}