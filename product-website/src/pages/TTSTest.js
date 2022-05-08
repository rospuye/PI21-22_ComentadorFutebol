import React, { useEffect, useState } from "react"
import TTS from "../components/TTS"

const TTSTest = () => {

    const [hasLoadedVoices, setHasLoadedVoices] = useState(false)
    const [tts, setTts] = useState(new TTS(setHasLoadedVoices))

    const areVoicesLoaded = () => {
        if (hasLoadedVoices) return true
        setTimeout(areVoicesLoaded, 1000)
    }

    useEffect(() => {
        let msg = new SpeechSynthesisUtterance()
        msg.text = "Hello people"
        console.log("msg empty", msg)
        window.speechSynthesis.speak(msg)
        areVoicesLoaded()
        // setTimeout(() => {
        //     tts.setText("amogus")
        //     tts.play()
        // }, 2000)
        
    }, [])  

    useEffect(() => {
        if (!hasLoadedVoices) return
        console.log("voices loaded", tts.voices)
    
        setTimeout(() => {
            tts.setText("amogus")
            tts.play()
            console.log("lateee")
        }, 2000)
        // let msg = new SpeechSynthesisUtterance()
        // window.speechSynthesis.cancel()
        // msg.text = "Hello people"
        // console.log("msg", msg)
        // window.speechSynthesis.speak(msg)
    }, [hasLoadedVoices])

 

    // const [play, setPlay] = useState(false)
    // const [ready2Play, setReady2Play] = useState(false)

    // useEffect(() => {
    //     if (!ready2Play) return
    //     setPlay(true)

    // }, [ready2Play])

    return (
        <>
            {/* <TTS
                text={"amongus"}
                play={play}
                setPlay={setPlay}
                setReady={setReady2Play}
            /> */}
        </>
    )
}

export default TTSTest