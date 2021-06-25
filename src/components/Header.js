import React from 'react';
import defaultUserImage from '../user-image.png';
import { Navbar, Dropdown, Image, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext.js';
function Header(props) {
  return (
    <AuthContext.Consumer>
      {
        value =>
          <Navbar bg='dark' variant='dark' className='justify-content-between'>
            <Navbar.Brand as={Link} to={'/'}>Rentagram</Navbar.Brand>
            <ProfileIcon authUser={value.authUser} logout={value.logout} login={value.login} />
          </Navbar>
      }
    </AuthContext.Consumer>
  );
}
function ProfileIcon(props) {
  return (
    <Container fluid className='justify-content-end'>
      {
        props.authUser
          ?
          <div className='text-light'>{props.authUser.name}</div>
          :
          null
      }
      <Dropdown alignRight>
        {/*
          The toggle renders as a normal Button component and triggers the dropdown menu.
          'variant' is set to 'link' otherwise the button has a background color
        */}
        <Dropdown.Toggle variant='link' id="dropdown">
          <Image src={defaultUserImage} widht='35' height='35' rounded />
        </Dropdown.Toggle>
        {/* This is the dropdown menu itself */}
        <Dropdown.Menu>
          {
            props.authUser
              ? <Dropdown.Item as={Link} to={'/myrentals'}>My rentals</Dropdown.Item>
              : null
          }
          {
            /* If not logged, then display the "Log in" option, the "Exit" instead */
            props.authUser
              ? <Dropdown.Item onClick={() => { props.logout() }}>Exit</Dropdown.Item>
              : <Dropdown.Item onClick={() => { props.login() }}>Log in</Dropdown.Item>
          }
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
}
export default Header;
