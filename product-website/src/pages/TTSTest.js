import React, { useEffect, useState } from "react"
import TTS from "../components/TTS"

const TTSTest = () => {

    const [hasLoadedVoices, setHasLoadedVoices] = useState(false)
    const [tts, setTts] = useState(new TTS())
    let hasButtonClicked = {value: false}

    useEffect(() => {
        tts.updateStateWhenVoicesLoaded(setHasLoadedVoices)
    }, [])

    useEffect(() => {
        if (!tts.hasVoices()) return
        tts.emmitAudio("Amogus emmit audio", hasButtonClicked)
        tts.emmitAudio("Amogus audio number 2", hasButtonClicked)
        
    }, [hasLoadedVoices])

    return (
        <>
            <button onClick={() => {tts.speak("amogus button", hasButtonClicked)}}>Click</button>
        </>
    )
}

export default TTSTest