import React, {useState} from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function SearchBox({login}) {
    const leagueOptions = ['League 1','League 2'];
    const userOptions = ['user1','user2','user3'];
    const yearOptions = ['2019','2020','2021','2022']
    const roundOptions = ['Round 1',"Round 2"]
    const groupOptions = ['Group 1','Group 2']
    
    const [selectedLeague,setSelectedLeague] = useState("League")
    const [selectedUser,setSelectedUser] = useState("User")
    const [selectedYear,setSelectedYear] = useState("Year")
    const [selectedRound,setSelectedRound] = useState("Round")
    const [selectedGroup,setSelectedGroup] = useState("Group")

    const [inputValue, setInputValue] = useState('')
  
    const onInputChange = (e) => {
      const { value } = e.target;
      setInputValue(value);
    }

    const _search = (() => {
        console.log("Searching...")
    })

  return (
    login ?
        <>
        <Row className="align-items-center">
            <Col xs={8}>
                <div className='input-wrapper-searchBox'>
                    <input className='input-searchBox'
                        onChange={onInputChange}
                        placeholder='Search...'
                        value={inputValue}
                        spellCheck={false}
                        />
                    <span className='input-highlight-searchBox'>
                        { inputValue.replace(/ /g, "\u00a0") }
                    </span>
                </div>
            </Col>
            <Col xs={4}>
                <Button className="loginButton" onClick={_search} variant="light" id="button-addon2" >
                Search
                </Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Dropdown className='inputDropdown' options={leagueOptions} onChange={setSelectedLeague} value={selectedLeague} placeholder="League" />;
            </Col>
            <Col>
                <Dropdown className='inputDropdown' options={groupOptions} onChange={setSelectedGroup} value={selectedGroup} placeholder="Group" />;
            </Col>
        </Row>
        <Row>
            <Col>
                <Dropdown className='inputDropdown' options={yearOptions} onChange={setSelectedYear} value={selectedYear} placeholder="Year" />;
            </Col>
            <Col>
                <Dropdown className='inputDropdown' options={roundOptions} onChange={setSelectedRound} value={selectedRound} placeholder="Round" />;
            </Col>
        </Row>
        <Row>
        <Col>
                <Dropdown className='inputDropdown' options={userOptions} onChange={setSelectedUser} value={selectedUser} placeholder="User" />;
            </Col>
        </Row>
        </>
    :

    <>
        <Row>
            <InputGroup className="mb-3">
                <FormControl
                placeholder="Search for a game"
                aria-label="Search for a game"
                aria-describedby="basic-addon2"
                />
                <Button onClick={_search} variant="outline-secondary" id="button-addon2" style={{color:'#e0d8c1'}}>
                Search
                </Button>
            </InputGroup>
        </Row>
        <Row>
            <Col>
                <Dropdown className='inputDropdown' options={leagueOptions} onChange={setSelectedLeague} value={selectedLeague} placeholder="League" />;
            </Col>
            <Col>
                <Dropdown className='inputDropdown' options={groupOptions} onChange={setSelectedGroup} value={selectedGroup} placeholder="Group" />;
            </Col>
        </Row>
        <Row>
            <Col>
                <Dropdown className='inputDropdown' options={yearOptions} onChange={setSelectedYear} value={selectedYear} placeholder="Year" />;
            </Col>
            <Col>
                <Dropdown className='inputDropdown' options={roundOptions} onChange={setSelectedRound} value={selectedRound} placeholder="Round" />;
            </Col>
        </Row>
        </>

  )
}

export default SearchBox