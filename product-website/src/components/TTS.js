import React, { useEffect, useState } from "react";

const TTS = ({text, rate=5, volume=50, pitch=5}) => {

    // Play: When true, the program starts playing. Maybe needs to be set as false after start playing
    // Pause: samething but for pause
    // Cancel: samething but for cancel
    // Resume: samething but for resume

    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en"

    const [voices, setVoices] = useState([])

    useEffect(() => {
        window.speechSynthesis.onvoiceschanged = () => {
            setVoices(window.speechSynthesis.getVoices())
        }
    }, [])

    useEffect(() => {
        speech.text = text
        speech.rate = rate
        speech.volume = volume
        speech.pitch = pitch
    }, [text, rate, volume, pitch])

    useEffect(() => {
        console.log("voices", voices)
    }, [voices])

    return (
        <>
        </>
    )
}

export default TTS