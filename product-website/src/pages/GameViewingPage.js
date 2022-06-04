// React
import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

// Components
import JasminPlayer from '../components/JasminPlayer'
import ThreeJSCanvas from '../components/ThreeJSCanvas'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Button from 'react-bootstrap/Button'

// CSS
import "./GameViewingPage.css"

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

// TTS
import * as sdk from "microsoft-cognitiveservices-speech-sdk"

// Others
import axios from "axios"
import {
    commentaryToSSML,
    convertTimeToFloat,
    convertTimeToText,
    predictNumberOfSyllabs,
    predictPhraseEnd
} from "../components/Utils";

import { faPlay } from '@fortawesome/free-solid-svg-icons'

function GameViewingPage() {

    const [mood, setMood] = useState("friendly")
    const [diction, setDiction] = useState(1)
    const [script, setScript] = useState([])
    const [phraseHistory, setPhraseHistory] = useState([])
    const truePhraseHistory = []

    const [cookies, setCookie] = useCookies(['logged_user'])


    const startPhrase = "Let's start the convertion."
    let phraseTimeEnd = 0

    let { id, gender, energy, aggressiveness, bias } = useParams();

    // Iframe variables
    const [isGameLoaded, setIsGameLoaded] = useState(false)

    let gameTime = document.getElementsByClassName("game_time_lbl")
    let iframe = document.getElementById("video-game-iframe")
    let playerBar = undefined

    // const isStillLoading = (waitTime=2000, bottomLimit=20, maxVerificationCount=3, verificationCount=0) => {
    //     let totalTime = iframe.contentWindow.document.getElementsByClassName("total-time")
    //     let convertedTotalTime = totalTime[0].innerText
    //     convertedTotalTime = convertTimeToFloat(convertedTotalTime)
    //     console.log(convertedTotalTime, previousTotalTime, verificationCount, maxVerificationCount)
    //     if (convertedTotalTime === previousTotalTime) {
    //         if (verificationCount < maxVerificationCount) {
    //             console.log("failed")
    //             setTimeout(() => {isStillLoading(waitTime, bottomLimit, maxVerificationCount, verificationCount+1)}, waitTime)
    //             return
    //         }
    //         console.log("Game Loaded")
    //         setIsGameLoaded(true)
    //         return
    //     }
    //     previousTotalTime = convertedTotalTime
    //     console.log("not loaded yet", convertedTotalTime)
    //     setTimeout(() => {isStillLoading(waitTime, bottomLimit, maxVerificationCount, 0)}, waitTime)
    // }

    const verifyIframe = (waitTime=1000) => {
        iframe = document.getElementById("video-game-iframe")
        if (iframe !== null) {
            playerBar = iframe.contentWindow.document.getElementsByClassName("jsm-player-bar")
            if (playerBar.length !== 0) {
                playerBar = playerBar[0]
                console.log("playerBar", playerBar)
                playerBar.style.display = "none"
                // isStillLoading()
                setIsGameLoaded(true)
                return
            }
        }

        setTimeout(() => {
            verifyIframe()
        }, waitTime)
    }

    useEffect(() => {
        if (!isGameLoaded) {
            verifyIframe()
        }
    }, [isGameLoaded])

    // verifyIframe()

    const getPhraseByTimestamp = (time, errorMargin=0.05, sortFunc=(a, b) => a.priority - b.priority) => {
        let phrases = script.filter((line) => {
            return Math.abs(line.timestamp - time) <= errorMargin
        })

        if (phrases.length === 0) {
            return null
        }

        // If multiple, filter by those parameters
        // By priority
        let sortedPhrases = phrases.sort(sortFunc)
        let minimumPhrase = sortedPhrases[0]
        let isValid = true

        for (let i = 1; i < sortedPhrases.length; i++) {
            if (sortedPhrases[i].priority === minimumPhrase.priority) {
                isValid = false
            }
        }

        return minimumPhrase
    }

    const onGameTimeChange = (mutations, observer) => {
        gameTime = mutations[0].target.innerText
        gameTime = convertTimeToFloat(gameTime)
        if (gameTime < phraseTimeEnd)  // if should be a narration happening right now, it doesn't matter
            return
        const phrase = getPhraseByTimestamp(gameTime)

        if (phrase != null) {
            const phraseEnd = predictPhraseEnd(phrase.text, phrase.timestamp)
            const timeDifference = phraseEnd - phrase.timestamp

            // get the best phrase in the estimated time that the commentator would be saying
            const bestPhrase = getPhraseByTimestamp(phrase.timestamp + timeDifference/2, timeDifference/2)

            if (phrase.priority <= bestPhrase.priority) {
                phraseTimeEnd = phraseEnd
                truePhraseHistory.push(phrase)
                speak(phrase.text)
                setPhraseHistory([...truePhraseHistory])
            }
        }
    }

    const observer = new MutationObserver(onGameTimeChange)

    const initializeSynthetiser = () => {
        const speechConfig = sdk.SpeechConfig.fromSubscription("dfb5fa14bd85423db7a60da4b0ac369f", "westeurope");
        const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
        return new sdk.SpeechSynthesizer(speechConfig, audioConfig)
    }

    const initializeScript = () => {

        let synthetiser = initializeSynthetiser()
        iframe = document.getElementById("video-game-iframe")
        gameTime = iframe.contentWindow.document.getElementsByClassName("game_time_lbl")
        if (gameTime.length !== 0) {
            observer.observe(gameTime[0], {characterData: false, childList: true, attributes: false})
        }

        playerBar = iframe.contentWindow.document.getElementsByClassName("jsm-player-bar")
        if (playerBar.length !== 0) {
            playerBar = playerBar[0]
            console.log("playerBar", playerBar)
            playerBar.style.display = ""
        }

        const ssml = commentaryToSSML(startPhrase, mood, diction, gender)
        speakSsml(ssml, synthetiser)
    }

    const speak = (text) => {
        let synthetiser = initializeSynthetiser()

        const ssml = commentaryToSSML(text, mood, diction, gender)
        speakSsml(ssml, synthetiser)
    }

    const speakSsml = (ssml, synthesizer) => {

        synthesizer.speakSsmlAsync(
            ssml,
            result => {
                // if (result.errorDetails) {
                //     console.error(result.errorDetails);
                // } else {
                //     console.log(JSON.stringify(result));
                // }

                synthesizer.close();
            },
            error => {
                console.log(error);
                synthesizer.close();
            });
    }

    const requestGame = () => {
        let config = {}
        if (cookies.token != null && cookies.token !== "") {
            config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': `Token ${cookies.token}`
                }
            }
        }
        else {
            config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        }

        let url = `${process.env.REACT_APP_API_URL}generate_script/${id}?en_calm_mod=${energy}&agr_frnd_mod=${aggressiveness}&bias=${bias}`

        axios.get(url, config)
            .then(res => {
                console.log(res)
                setScript(res.data)
            })
    }

    useEffect(() => {
        requestGame()
        verifyIframe()
    }, [])


    // useEffect(() => {
    //     const chatHistory = [...phraseHistory]
    // }, [phraseHistory])



    return (
        <div>
            <Container fluid >
                <Row>
                    <Col>
                        <Link to="/">
                            <FontAwesomeIcon icon={faHouse} style={{ color: 'white', fontSize: '30px', marginTop: '40px', marginLeft: '40px' }} />
                        </Link>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right' }}>
                        <Link to="/statistics">
                            <FontAwesomeIcon icon={faArrowRight} style={{ color: 'white', fontSize: '30px', marginTop: '40px', marginRight: '40px' }} />
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ marginLeft: '5%', marginTop: '5%' }}>
                        <JasminPlayer />
                    </Col>
                    <Col>
                        <ThreeJSCanvas />
                        <ToastContainer style={{ marginTop: '2%', width: '100%' }}>
                            <Toast style={{ width: '80%', height: '300px', overflowY: 'scroll' }}>
                                <Toast.Body>
                                    {phraseHistory.map(phrase => {
                                        return (
                                            <>
                                                {convertTimeToText(phrase.timestamp)} - {phrase.text}<br/>
                                            </>
                                        )
                                    })}
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </Col>
                </Row>
                {isGameLoaded &&
                    <Button variant={"success"} size={"lg"} onClick={() => {initializeScript()}}>I agree to play <FontAwesomeIcon icon={faPlay} /></Button>
                }
            </Container>


        </div>)
}

export default GameViewingPage;