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

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

// TTS
import * as sdk from "microsoft-cognitiveservices-speech-sdk"

// Others
import axios from "axios"
import {commentaryToSSML, convertTime, predictNumberOfSyllabs, predictPhraseEnd} from "../components/Utils";



function GameViewingPage() {

    const [mood, setMood] = useState("friendly")
    const [diction, setDiction] = useState(1)
    const [script, setScript] = useState([])
    const [phraseHistory, setPhraseHistory] = useState([])

    const [cookies, setCookie] = useCookies(['logged_user'])

    const startPhrase = "Let's start the convertion."
    let phraseTimeEnd = 0

    let { id, gender, energy, aggressiveness, bias } = useParams();
    let gameTime = document.getElementsByClassName("game_time_lbl")
    let iframe = document.getElementById("video-game-iframe")

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
        const chatHistory = phraseHistory
        // console.log("script", script)
        gameTime = mutations[0].target.innerText
        gameTime = convertTime(gameTime)
        // console.log("expected end", phraseTimeEnd)
        if (gameTime < phraseTimeEnd)  // if should be a narration happening right now, it doesn't matter
            return
        const phrase = getPhraseByTimestamp(gameTime)
        console.log(gameTime, phrase)

        if (phrase != null) {
            const phraseEnd = predictPhraseEnd(phrase.text, phrase.timestamp)
            const timeDifference = phraseEnd - phrase.timestamp

            // get the best phrase in the estimated time that the commentator would be saying
            const bestPhrase = getPhraseByTimestamp(phrase.timestamp + timeDifference/2, timeDifference/2)
            console.log("gameTime", gameTime, "bestPhrase", bestPhrase, "phrase", phrase)

            if (phrase.priority <= bestPhrase.priority) {
                phraseTimeEnd = phraseEnd
                console.log("expected end", phraseTimeEnd)
                console.log("it spoke", phrase.text)
                chatHistory.push(phrase)
                speak(phrase.text)
                setPhraseHistory(chatHistory)
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

        // setSynthetiser(synth)
        let synthetiser = initializeSynthetiser()
        iframe = document.getElementById("video-game-iframe")
        gameTime = iframe.contentWindow.document.getElementsByClassName("game_time_lbl")
        if (gameTime.length !== 0) {
            observer.observe(gameTime[0], {characterData: false, childList: true, attributes: false})
        }

        const ssml = commentaryToSSML(startPhrase, mood, diction, gender)
        // console.log(ssml)
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
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Token ${cookies.token}`
                // 'Access-Control-Allow-Origin': 'http://localhost:3001'
            },
        };

        let url = `${process.env.REACT_APP_API_URL}generate_script/${id}?en_calm_mod=${energy}&agr_frnd_mod=${aggressiveness}&bias=${bias}`

        console.log("Get request")

        axios.get(url, config)
        .then(res => {
            console.log(res)
            setScript(res.data)
            // setGames(res.data)
        })
    }

    // useEffect(() => {
    //     setScript(testScript)
    // }, [])

    

    useEffect(() => {
        requestGame()
    }, [])



    return (
        <div>
            <Button onClick={() => {initializeScript()}}></Button>
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
                                                <p>{phrase.text}</p><br/>
                                            </>
                                        )
                                    })}
                                    {/*00:00 - Lorem Ipsum<br />*/}
                                    {/*00:23 - Ball ball ball<br />*/}
                                    {/*00:32 - AAAAAAAAA<br />*/}
                                    {/*01:01 - MAMA MIA<br />*/}
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </Col>
                </Row>
            </Container>


        </div>)
}

export default GameViewingPage;