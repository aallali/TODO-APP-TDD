


export function validateUsername(usr: string) {
    return /^[a-zA-Z0-9]{3,10}$/.test(usr)
}


export function validatepassword(psswd: string) {
    return /^[a-zA-Z0-9]{3,10}$/.test(psswd)
}