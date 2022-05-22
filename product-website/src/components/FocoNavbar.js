import React from 'react'
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'
import { useCookies } from 'react-cookie'
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function FocoNavbar({goesBack,backPage,hasLoginBtn,cookies,setCookie,updateLogin}) {
  return (
    <Navbar style={{borderRadius:"15px"}} collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
        {(goesBack) ?
        <Nav.Link href={backPage}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '20px', marginTop: '10%', marginLeft: '2%' }} />
    </Nav.Link>
    :
    <></>
    }
        
        <Navbar.Brand href="/"><b>FoCo</b></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/meet_foco">Meet FoCo</Nav.Link>
            <Nav.Link href="https://isabelrosario8.wixsite.com/foco">About</Nav.Link>
            {/* <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav>
          {(hasLoginBtn) ? <>
          {(cookies.logged_user !== '') ?
            <Button className='loginButton' variant="light" onClick={() => {
              setCookie('logged_user', '', { path: '/' })
              setCookie('token', '', {path: '/'})
              updateLogin()
            }}>Logout</Button>
            :
            <Link to="/login">
              <Button className='loginButton' variant="light">Login/Register</Button>
            </Link>
          }</> : <></>}
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default FocoNavbar