import React, { useEffect, useState } from "react"
import TTS from "../components/TTS"

const TTSTest = () => {

    const [hasLoadedVoices, setHasLoadedVoices] = useState(false)
    const [tts, setTts] = useState(new TTS())
    let hasButtonClicked = {value: false}

    useEffect(() => {
        if (!tts.isSearchingVoices) {
            tts.updateStateWhenVoicesLoaded(setHasLoadedVoices)
        }
    }, [])

    useEffect(() => {
        if (!tts.hasVoices()) return
        const lang_voices = tts.getVoicesByLanguage("en")
        const voices_names = tts.getVoicesByName("male", lang_voices)
        tts.setVoice(voices_names[0])
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