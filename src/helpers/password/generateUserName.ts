
const generateNumber = ():Number => {
    const min = 100;
    const max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default (firstName: string, lastName: string):string => {
    const firstNameLower = firstName.toLowerCase();
    const lastNameLower = lastName.toLowerCase();

    const userNumber = generateNumber();

    return `${firstNameLower}${lastNameLower[0]}${userNumber}`;
};