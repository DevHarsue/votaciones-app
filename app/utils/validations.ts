

export const validateNationality = (nationality:string)=>{
    if (nationality == "Extranjero" || nationality == "Venezolano"){
        return true
    }
    return false
}

export const validateGender = (gender:string)=>{
    if (gender == "Masculino" || gender == "Femenino"){
        return true
    }
    return false
}

export const validateCI = (ci: number)=>{
    const ciString = ci.toString()
    if (ciString.length < 7 || ciString.length > 8){
        return false
    }
    return true
}

export const validateName = (name: string)=>{
    const regex = /^[A-Za-z]+$/;
    if (!regex.test(name)){
        return false
    }

    return true
}

export const validateStarName = (name: string)=>{
    const regex = /^[a-zñÑ][a-z0-9ñÑ ]*$/i;
    if (!regex.test(name)){
        return false
    }

    return true
}

export const validateEmail = (email: string)=>{
    const regex_email = /^[^@]+@[^@]+\.[^@]+$/;
    const regex_digits = /\+\d@/
    if (regex_email.test(email) && !regex_digits.test(email)){
        return true
    }
    return false
}

export const validateCode = (code:number)=>{
    const code_str = code.toString()
    if (code_str.length!=6){
        return false
    }

    return true
}