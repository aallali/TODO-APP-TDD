export function validateTaskTitle(str: string) {
    return /^[a-zA-Z0-9 \+\-]{3,50}$/.test(str)
}

export function validateTaskDescription(str: string) {
    return /^[a-zA-Z0-9 \+\-]{3,100}$/.test(str)
}
