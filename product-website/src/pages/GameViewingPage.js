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

const testScript = [
    {"start": 3.1, "end": 8.3, "text": "Not implemented yet"},
    {"start": 8.34, "end": 9.10002, "text": "matNum4matLeft has the ball!"},
    {"start": 12.2601, "end": 12.2601, "text": "and the games goes on"},
    {"start": 12.3001, "end": 13.8201, "text": "Not implemented yet :)"},
    {"start": 13.8601, "end": 16.5002, "text": "matNum5matLeft has the ball!"},
    {"start": 16.5002, "end": 16.5002, "text": "intersected the ball"},
    {"start": 16.5402, "end": 18.6202, "text": "Not implemented yet :)"},
    {"start": 18.6602, "end": 20.3003, "text": "matNum3matRight has the ball!"},
    {"start": 20.3003, "end": 20.3003, "text": "intersected the ball"},
    {"start": 20.7403, "end": 21.1803, "text": "matNum5matLeft and matNum3matRight fall down"},
    {"start": 20.3403, "end": 22.3803, "text": "Not implemented yet :)"},
    {"start": 22.1003, "end": 22.5803, "text": "matNum4matLeft and matNum8matRight fall down"},
    {"start": 22.4203, "end": 25.2204, "text": "matNum3matLeft has the ball!"},
    {"start": 25.7804, "end": 25.8204, "text": "matNum3matLeft has the ball!"},
    {"start": 25.8604, "end": 25.9004, "text": "matNum3matLeft has the ball!"},
    {"start": 26.2604, "end": 27.5804, "text": "matNum3matLeft is racing through the field"},
    {"start": 27.5804, "end": 27.5804, "text": "intersected the ball"},
    {"start": 27.6204, "end": 27.9804, "text": "matNum3matRight is racing through the field"},
    {"start": 27.9804, "end": 27.9804, "text": "intersected the ball"},
    {"start": 28.0205, "end": 28.0605, "text": "matNum3matLeft is racing through the field"},
    {"start": 28.0605, "end": 28.0605, "text": "intersected the ball"},
    {"start": 28.1005, "end": 28.1405, "text": "matNum3matLeft has the ball!"},
    {"start": 28.1405, "end": 28.1405, "text": "intersected the ball"},
]


function commentaryToSSML(text, mood, diction, gender) {
    let voice = "en-US-AnaNeural"
    if (gender == "female") {
        voice = "en-US-JennyNeural"
    }
    else if (gender == "male") {
        voice = "en-US-BrandonNeural"
    }

    let style = null
    if (mood == "aggressive") {
        style = "angry"
    }
    else if (mood == "friendly") {
        style = "friendly"
    }

    let pitch = "medium"
    let rate = 1

    let inner = ""
    if (style) {
        let string = `<mstts:express-as style="${style}">${text}</mstts:express-as>`
        inner = `<paropsy pitch="${pitch}" rate="${rate}">${string}</paropsy>`
    }
    else {
        inner = `<paropsy pitch="${pitch}" rate="${rate}">${text}</paropsy>`
    }
    
    let speak = `<voice name="${voice}">${inner}</voice>` 
    let base = `<speak version="1.0" xmlns:mstts="https://www.w3.org/2001/mstts" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">${speak}</speak>`
    return base

}

function GameViewingPage() {

    const [synthetiser, setSynthetiser] = useState()
    const [mood, setMood] = useState("friendly")
    const [diction, setDiction] = useState(1)
    const [script, setScript] = useState([])
    const startPhrase = "Let's start the convertion."

    let { id, gender, energy, aggressiveness, bias } = useParams();
    const [cookies, setCookie] = useCookies(['logged_user'])

    console.log("game_id", id)
    console.log("gender: " + gender)
    console.log("energy: " + energy)
    console.log("aggressiveness: " + aggressiveness)
    console.log("bias: " + bias)

    let gameTime = document.getElementsByClassName("game_time_lbl")
    let iframe = document.getElementById("video-game-iframe")
    console.log("time", gameTime)

    const convertTime = (time="") => {
        // Convert time to float value, instead of MM:SS.ss
        const timeSplit = time.split(":")
        const timeMin = timeSplit[0]/1 // str convertion lmao
        const timeSeg = timeSplit[1]/1
        return timeMin * 60 + timeSeg
    }

    const getPhraseByTimestamp = (time, errorMargin=0.05) => {
        let test = script.filter((line) => {
            return Math.abs(line.start - time) < errorMargin
        })
        console.log("test", test, time)
    }

    const onGameTimeChange = (mutations, observer) => {
        gameTime = mutations[0].target.innerText
        gameTime = convertTime(gameTime)
        // TODO do stuff with gameTime
        const phrase = getPhraseByTimestamp(gameTime)
    }

    const observer = new MutationObserver(onGameTimeChange)

    const initializeScript = () => {
        const speechConfig = sdk.SpeechConfig.fromSubscription("dfb5fa14bd85423db7a60da4b0ac369f", "westeurope");
        const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
        let synth = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
        setSynthetiser(synth)

        iframe = document.getElementById("video-game-iframe")
        gameTime = iframe.contentWindow.document.getElementsByClassName("game_time_lbl")
        if (gameTime.length !== 0) {
            observer.observe(gameTime[0], {characterData: false, childList: true, attributes: false})
        }

        const ssml = commentaryToSSML(startPhrase, mood, diction, gender)
        console.log(ssml)
        speakSsml(ssml, synth)
    }

    const speak = (text) => {
        const ssml = commentaryToSSML(text, mood, diction, gender)
        speakSsml(ssml, synthetiser)
    }

    const speakSsml = (ssml, synthesizer) => {

        synthesizer.speakSsmlAsync(
            ssml,
            result => {
                if (result.errorDetails) {
                    console.error(result.errorDetails);
                } else {
                    console.log(JSON.stringify(result));
                }

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
                                    00:00 - Lorem Ipsum<br />
                                    00:23 - Ball ball ball<br />
                                    00:32 - AAAAAAAAA<br />
                                    01:01 - MAMA MIA<br />
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </Col>
                </Row>
            </Container>


        </div>)
}

export default GameViewingPage;