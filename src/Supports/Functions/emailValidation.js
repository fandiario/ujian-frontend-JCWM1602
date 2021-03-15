function emailValidation (input) {
    let result = false
    let numbers = "0123456789"

    if (input.length < 6 ) {
        result = false
    }

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (input[i] === numbers[j]) {
                result = true
            }
        }
    }

    return result
}

export default emailValidation