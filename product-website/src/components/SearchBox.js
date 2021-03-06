import React, {useState} from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './components_css/Title.css'

function SearchBox({login, selectedLeague, setSelectedLeague, selectedUser,setSelectedUser, 
    selectedYear, setSelectedYear, selectedRound, setSelectedRound, selectedGroup, setSelectedGroup,
    selectedTitle, setSelectedTitle, requestGame}) {
    const leagueOptions = ['League 1','League 2'];
    const userOptions = ['user1','user2','user3'];
    const yearOptions = ['2019','2020','2021','2022']
    const roundOptions = ['Round 1',"Round 2"]
    const groupOptions = ['Group 1','Group 2']

    const [inputValue, setInputValue] = useState('')
  
    const onInputChange = (e) => {
      const { value } = e.target;
      setInputValue(value);
    }

    const _search = (() => {
        console.log("Searching...")
    })

  return (
    <>
    <Container className="logUpload">
        <Row className="align-items-center">
            <Col xs={8}>
                <div className='input-wrapper-searchBox'>
                    <input className='input-searchBox'
                        onChange={(e) => { setSelectedTitle(e.target.value) }}
                        placeholder='Title'
                        value={selectedTitle}
                        spellCheck={false}
                        />
                    <span className='input-highlight-searchBox'>
                        { selectedTitle.replace(/ /g, "\u00a0") }
                    </span>
                </div>
            </Col>
            <Col xs={4}>
                <Button className="loginButton" onClick={requestGame} variant="light" id="button-addon2" >
                Search
                </Button>
            </Col>
        </Row>
        <Row>
            <Col>
            <div className='input-wrapper-searchBox'>
                {/* <Dropdown className='inputDropdown' options={leagueOptions} onChange={} value={selectedLeague} placeholder="League" />; */}
                <input className='input-searchBox'
                    onChange={(e) => {setSelectedLeague(e.target.value)}}
                    placeholder='League'
                    value={selectedLeague}
                    spellCheck={false}
                />
                <span className='input-highlight-searchBox'>
                        { selectedLeague.replace(/ /g, "\u00a0") }
                </span>
            </div>
            </Col>
            <Col>
                <div className='input-wrapper-searchBox'>
                {/* <Dropdown className='inputDropdown' options={groupOptions} onChange={(e) => {setSelectedGroup(e.value)}} value={selectedGroup} placeholder="Group" />; */}
                <input className='input-searchBox'
                    onChange={(e) => {setSelectedGroup(e.target.value)}}
                    placeholder='Group'
                    value={selectedGroup}
                    spellCheck={false}
                />
                <span className='input-highlight-searchBox'>
                        { selectedGroup.replace(/ /g, "\u00a0") }
                </span>
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <div className='input-wrapper-searchBox'>
                {/* <Dropdown className='inputDropdown' options={yearOptions} onChange={(e) => {setSelectedYear(e.value)}} value={selectedYear} placeholder="Year" />; */}
                <input className='input-searchBox'
                    onChange={(e) => {setSelectedYear(e.target.value)}}
                    placeholder='Year'
                    value={selectedYear}
                    spellCheck={false}
                />
                <span className='input-highlight-searchBox'>
                        { selectedYear.replace(/ /g, "\u00a0") }
                </span>
                </div>
            </Col>
            <Col>
                <div className='input-wrapper-searchBox'>
                {/* <Dropdown className='inputDropdown' options={roundOptions} onChange={(e) => {setSelectedRound(e.value)}} value={selectedRound} placeholder="Round" />; */}
                <input className='input-searchBox'
                    onChange={(e) => {setSelectedRound(e.target.value)}}
                    placeholder='Round'
                    value={selectedRound}
                    spellCheck={false}
                />
                <span className='input-highlight-searchBox'>
                        { selectedRound.replace(/ /g, "\u00a0") }
                </span>
                </div>
            </Col>
        </Row>
        <Row>
        <Col>
            <div className='input-wrapper-searchBox'>
                {/* <Dropdown className='inputDropdown' options={userOptions} onChange={(e) => {setSelectedUser(e.value)}} value={selectedUser} placeholder="User" />; */}
                <input className='input-searchBox'
                    onChange={(e) => {setSelectedUser(e.target.value)}}
                    placeholder='User'
                    value={selectedUser}
                    spellCheck={false}
                />
                <span className='input-highlight-searchBox'>
                        { selectedUser.replace(/ /g, "\u00a0") }
                </span>
            </div>
            </Col>
        </Row>
        </Container>
    </>)
}

export default SearchBox