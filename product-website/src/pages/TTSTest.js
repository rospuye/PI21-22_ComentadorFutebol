import React, { useEffect, useState, useRef } from "react"
import TTS from "../components/TTS"
import Speech from 'react-speech';

const TTSTest = () => {

    const [hasLoadedVoices, setHasLoadedVoices] = useState(false)
    const [tts, setTts] = useState(new TTS(setHasLoadedVoices))
    let hasButtonClicked = {value: false}
    const speechButton = useRef()

    const areVoicesLoaded = () => {
        if (hasLoadedVoices) return true
        setTimeout(areVoicesLoaded, 1000)
    }
 
    // const emmitAudio = (text) => {
    //     console.log("emmit", hasButtonClicked, text)
    //     if (hasButtonClicked && !tts.isPlaying()) {
    //         handleClick(text)
    //         return
    //     }
    //     setTimeout(() => {emmitAudio(text)}, 1000)
    // }

    // useEffect(() => {
    //     let msg = new SpeechSynthesisUtterance()
    //     msg.text = "Hello people"
    //     console.log("msg empty", msg)
    //     window.speechSynthesis.speak(msg)
    //     areVoicesLoaded()
    
    //     // setTimeout(() => {
    //     //     tts.setText("amogus")
    //     //     tts.play()
    //     // }, 2000)
        
    // }, [])  

    useEffect(() => {
        // tts.setText("first amo gus")
        // tts.play()
        areVoicesLoaded()
    })

    useEffect(() => {
        if (!hasLoadedVoices) return
        // console.log("voices loaded", tts.voices)
    
        // setTimeout(() => {
        //     tts.setText("amogus")
        //     tts.play()
        //     // console.log("lateee")
        // }, 2000)

        tts.emmitAudio("Amogus emmit audio", hasButtonClicked)
        tts.emmitAudio("Amogus audio number 2", hasButtonClicked)
        
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

    // const handleClick = (text) => {
    //     console.log("handle click", text)
    //     tts.setText(text)
    //     tts.play()
    //     hasButtonClicked = true
    // }

    return (
        <>
            {/* <TTS
                text={"amongus"}
                play={play}
                setPlay={setPlay}
                setReady={setReady2Play}
            /> */}
            {/* <Speech text="amogus" /> */}
            <button ref={speechButton} onClick={() => {tts.speak("amogus button", hasButtonClicked)}}>Click</button>
        </>
    )
}

export default TTSTest