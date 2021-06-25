import React from 'react';
import {Form, Row, Col, Button, Container} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../AuthContext.js';
class LogInForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {validated : false, continueSelected:false, data : {email : '', password : ''}};
  }
  render() {
    if(this.state.continueSelected)
      return <Redirect to = '/public'/>;
    return(
      <AuthContext.Consumer>
        {value =>
          <Container className = 'h-100 align-items-center justify-content-center m-auto'>
            <Row className = 'h-100'>
              <Col xs = '12' md = '6' className = 'align-self-end align-self-md-center d-flex'>
                <h1>Rent</h1><h1 className = 'text-danger'>agram</h1>
              </Col>
              <Col xs = '12' md = '6' className = 'align-self-start align-self-md-center'>
                <Form noValidate validated = {this.state.validated} onSubmit = {(e)=>{this.onSubmit(e, value.login);}}>
                  <Form.Group controlId = 'mail' >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control className = {(value.authError /* is defined */ && value.authError === 2 /* username is wrong */) ? 'is-invalid' : ''} name = 'email' type="email" placeholder="Enter email" value = {this.state.data.email} onChange = {(e) => {this.updateField(e.target.name, e.target.value)}} required/>
                    <Form.Control.Feedback type = 'invalid'>
                      Enter a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId = 'password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control className = {(value.authError /* is defined */ && value.authError === 1 /* is wrong password */) ? 'is-invalid' : ''} name = 'password' type="password" placeholder="Enter password" value = {this.state.data.password} onChange = {(e) => {this.updateField(e.target.name, e.target.value)}} required/>
                    <Form.Control.Feedback type = 'invalid'>
                      Enter a valid password.
                    </Form.Control.Feedback>
                  </Form.Group >
                  <Button variant = 'link' className = 'float-left text-secondary' onClick = {() => {return this.continue()}}>Continue as Guest</Button>
                  <Button variant = 'secondary' className = 'float-right' type = 'submit'>Log In</Button>
                </Form>
              </Col>
            </Row>
          </Container>
        }
      </AuthContext.Consumer>
    );
  }
  continue = () => {
    this.setState({continueSelected: true});
  }
  /* Used with prop value of form components to implement a controlled component */
  updateField = (name, value) => {
    this.setState((state) => {
      return ({data: {...state.data, [name]: value}});
    });
  }
  /* Use the login function defined in App.
   * The function is taken from the context. */
  onSubmit = (e, login) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if(!form.checkValidity()){
      this.setState({validated : true}); /* Form has prop validated: set it to true, is like reportValidity() */
    }
    else
      if(!login(this.state.data.email, this.state.data.password))
        this.setState({validated : true});
  }
}
export default LogInForm;
