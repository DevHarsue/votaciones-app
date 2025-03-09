

export const validateEmail = (email: string)=>{
    const regex_email = /^[^@]+@[^@]+\.[^@]+$/;
    const regex_digits = /\+\d@/
    if (regex_email.test(email) && !regex_digits.test(email)){
        return true
    }
    return false
}