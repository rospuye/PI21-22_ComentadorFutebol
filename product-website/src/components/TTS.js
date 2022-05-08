// import React, { useEffect, useState } from "react";

// const TTS = ({text, rate=1, volume=50, pitch=1,
// play, setPlay, setReady}) => {

//     // Play: When true, the program starts playing. Maybe needs to be set as false after start playing
//     // Pause: samething but for pause
//     // Cancel: samething but for cancel
//     // Resume: samething but for resume

//     let speech = new SpeechSynthesisUtterance();
//     speech.lang = "en"

//     const [voices, setVoices] = useState([])

//     useEffect(() => {
//         window.speechSynthesis.onvoiceschanged = () => {
//             setVoices(window.speechSynthesis.getVoices())
//             setReady(true)
//         }
//     }, [])

//     useEffect(() => {
//         speech.text = text
//         speech.rate = rate
//         speech.volume = volume
//         speech.pitch = pitch
//     }, [text, rate, volume, pitch])

//     useEffect(() => {
//         console.log("voices", voices)
//     }, [voices])

//     useEffect(() => {
//         console.log("init")
//         if (!play) return
//         console.log("play")
//         window.speechSynthesis.speak(speech)
//         setPlay(false)
//     }, [play])

//     return (
//         <>
//         </>
//     )
// }

// export default TTS


class TTS {

    // Play: When true, the program starts playing. Maybe needs to be set as false after start playing
    // Pause: samething but for pause
    // Cancel: samething but for cancel
    // Resume: samething but for resume

    constructor(setHasLoadedVoices, rate=1, volume=50, pitch=1) {
        this.speech = new SpeechSynthesisUtterance();
        this.speech.rate = rate
        this.speech.volume = volume
        this.speech.pitch = pitch
        this.speech.lang = "en"
        this.voices = []
        this.selVoice = undefined
        window.speechSynthesis.onvoiceschanged = () => {
            console.log("i should had voices")
            setHasLoadedVoices(true)
            this.voices = window.speechSynthesis.getVoices()
            this.selVoice = this.voices[0]
            this.speech.voice = this.selVoice
        }
    }

    setText(text) {
        this.speech.text = text
    }
    setRate(rate) {
        this.speech.rate = rate
    }
    setVolume(volume) {
        this.speech.volume = volume
    }
    setPitch(pitch) {
        this.speech.pitch = pitch
    }

    play() {
        console.log("class", this.speech)
        // window.speechSynthesis.cancel()
        window.speechSynthesis.speak(this.speech)
    } 


}

export default TTS