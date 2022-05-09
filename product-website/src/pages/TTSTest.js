import React, { useEffect, useState, useRef } from "react"
import TTS from "../components/TTS"

const TTSTest = () => {

    const [hasLoadedVoices, setHasLoadedVoices] = useState(false)
    const [tts, setTts] = useState(new TTS(setHasLoadedVoices))
    let hasButtonClicked = {value: false}
    const speechButton = useRef()

    const areVoicesLoaded = () => {
        if (hasLoadedVoices) return true
        setTimeout(areVoicesLoaded, 1000)
    }

    useEffect(() => {
        areVoicesLoaded()
    })

    useEffect(() => {
        if (!hasLoadedVoices) return

        tts.emmitAudio("Amogus emmit audio", hasButtonClicked)
        tts.emmitAudio("Amogus audio number 2", hasButtonClicked)
        
    }, [hasLoadedVoices])

    return (
        <>
            <button ref={speechButton} onClick={() => {tts.speak("amogus button", hasButtonClicked)}}>Click</button>
        </>
    )
}

export default TTSTest