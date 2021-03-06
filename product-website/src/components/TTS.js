class TTS {

    // Play: When true, the program starts playing. Maybe needs to be set as false after start playing
    // Pause: samething but for pause
    // Cancel: samething but for cancel
    // Resume: samething but for resume

    constructor(setHasLoadedVoices=()=>{}, rate=1, volume=50, pitch=1) {
        this.speech = new SpeechSynthesisUtterance();
        this.speech.rate = rate
        this.speech.volume = volume
        this.speech.pitch = pitch
        this.speech.lang = "en"
        this.voices = []
        this.selVoice = undefined
        this.isSearchingVoices = false
        window.speechSynthesis.onvoiceschanged = () => {
            setHasLoadedVoices(true)
            this.voices = window.speechSynthesis.getVoices()
            this.selVoice = this.voices[0]
            this.speech.voice = this.selVoice
        }
    }

    // Setters / Getters / Basic functions

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
    setVoice(voice) {
        this.speech.voice = voice
    }

    hasVoices() {
        return this.voices.length != 0
    }

    getVoicesByLanguage(lang, voices = this.voices) {
        return voices.filter((voice) => {
            return voice.lang.toLowerCase().includes(lang)
        })
    }

    getVoicesByName(name, voices = this.voices) {
        return voices.filter((voice) => {
            return voice.voiceURI.toLowerCase().includes(name)
        })
    }

    // Voice Functions themselves

    play() {
        // this.speech.onstart = () => console.log("class", this.speech)
        window.speechSynthesis.speak(this.speech)
    } 

    isPlaying() {
        return window.speechSynthesis.speaking
    }

    emmitAudio(text, hasButtonClicked, waitTime=1000) {
        if (hasButtonClicked.value && !this.isPlaying()) {
            this.speak(text, hasButtonClicked)
            return
        }
        setTimeout(() => {this.emmitAudio(text, hasButtonClicked, waitTime)}, waitTime)
    }

    speak(text, hasButtonClicked) {
        console.log("TTS speaking:", text)
        this.setText(text)
        this.play()
        hasButtonClicked.value = true
    }

    updateStateWhenVoicesLoaded(setState, waitTime=1000) {
        this.isSearchingVoices = true
        if (this.hasVoices()) {
            setState(true)
            this.isSearchingVoices = false
            return true
        }
        setTimeout(() => {
            this.updateStateWhenVoicesLoaded(setState, waitTime)
        }, waitTime)
    }

}

export default TTS