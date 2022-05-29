const isLetter = (char) => {
    return char.length === 1 && char.match(/[a-z]/i);
}

export const predictNumberOfSyllabs = (phrase="") => {
    // Not 100% accurate, but tries to predict the number of syllabs of a phrase
    const VOWELS = ['a','e','i','o','u']
    const VOWELS_LIMIT = 2
    const CONSONANT_LIMIT = 2

    let vowelsInARow = 0
    let consonantInARow = 0

    let numberOfSyllabs = 0

    for (let i = 0; i < phrase.length; i++) {
        let ch = phrase.charAt(i).toLowerCase()
        if (!isLetter(ch)) continue
        let isVowel = VOWELS.includes(ch)
        if (isVowel) {
            if (consonantInARow > 0) {
                numberOfSyllabs++
            }
            consonantInARow = 0
            vowelsInARow++
            if (i === 0 || vowelsInARow > VOWELS_LIMIT ) {
                numberOfSyllabs++
                vowelsInARow = 0
            }
        }
        else {
            consonantInARow++
            vowelsInARow = 0
            if (consonantInARow > CONSONANT_LIMIT ) {
                numberOfSyllabs++
                consonantInARow = 0
            }
        }
    }

    return numberOfSyllabs
}
// banana
// among us
// rain

export const predictPhraseEnd = (phrase="", startingTime=0) => {
    let numberOfSyllabs = predictNumberOfSyllabs(phrase)

    return startingTime + numberOfSyllabs * 0.25
}

export const convertTimeToFloat = (time="") => {
    // Convert time to float value, instead of MM:SS.ss
    const timeSplit = time.split(":")
    const timeMin = timeSplit[0]/1 // str convertion lmao
    const timeSeg = timeSplit[1]/1
    return timeMin * 60 + timeSeg
}

export const convertTimeToText = (time=0) => {
    const minutes = time/60
    const seconds = time%60
    return `${Math.round(minutes)}:${Math.round(seconds * 100)/100}`
}

export const commentaryToSSML = (text, mood, diction, gender) => {
    let voice = "en-US-AnaNeural"
    if (gender == "female") {
        voice = "en-US-JennyNeural"
    }
    else if (gender == "male") {
        voice = "en-US-BrandonNeural"
    }

    let style = null
    if (mood == "aggressive") {
        style = "angry"
    }
    else if (mood == "friendly") {
        style = "friendly"
    }

    let pitch = "medium"
    let rate = 1

    let inner = ""
    if (style) {
        let string = `<mstts:express-as style="${style}">${text}</mstts:express-as>`
        inner = `<paropsy pitch="${pitch}" rate="${rate}">${string}</paropsy>`
    }
    else {
        inner = `<paropsy pitch="${pitch}" rate="${rate}">${text}</paropsy>`
    }

    let speak = `<voice name="${voice}">${inner}</voice>`
    let base = `<speak version="1.0" xmlns:mstts="https://www.w3.org/2001/mstts" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">${speak}</speak>`
    return base
}
