import React from 'react';
import {Container, Row, Col, Form, FormControl, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

class PaymentStub extends React.Component {
  constructor(props){
    super(props);
    this.state = {goBack: false, validated: false};
  }
  render(){
    if(this.state.goBack)
      return (<Redirect to = '/add'/>);
    if(!this.props.amount)
      return (<Redirect to = '/add'/>);
    return(
      <Container className = 'd-flex flex-column mt-2 mt-md-5'>
        <Row>
          <div className = 'ml-3 mb-3 display-4'>Complete reservation</div>
          <Form noValidate validated = {this.state.validated} onSubmit = {(e)=>{this.handleSubmit(e)}} className = 'container-fluid h-100'>
            <Container>
              <Row className = 'align-items-start'>
                <Col xs = {12} md = {6} xl = {4}>
                  <Form.Row>
                    <Col xs = {2}>
                      <Form.Label>Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Control type = 'text' placeholder = 'First Name' style = {{'textTransform': 'capitalize'}} maxLength = {15} required/>
                        <FormControl.Feedback type = 'invalid'>Please, insert a valid first name</FormControl.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Control type = 'text' placeholder = 'Last Name' style = {{'textTransform': 'capitalize'}} maxLength = {15} required/>
                        <FormControl.Feedback type = 'invalid'>Please, insert a valid last name</FormControl.Feedback>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Group>
                    <Form.Label>Credit card number</Form.Label>
                    <Form.Control type = "text" placeholder = '**** **** **** 4565' style = {{'textTransform': 'uppercase'}} minLength = {16} maxLength = {19} required/>
                    <FormControl.Feedback type = 'invalid'>Please, insert a valid credit card number</FormControl.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type = "tel" minLength = {3} maxLength = {3} placeholder = '***' required/>
                    <FormControl.Feedback type = 'invalid'>Please, insert a valid CVV</FormControl.Feedback>
                  </Form.Group>
                </Col>
                <Col xs = {12} md = {5} lg = {4} xl = {{offset: 3, span: 4}}>
                  <Container fluid>
                    <Row className = 'justify-content-start'>
                      <Col xs = {12} className = 'font-weight-bold'>Total: {this.props.amount.toFixed(2)}</Col>
                    </Row>
                    <Row className = 'mt-2'>
                      <Col xs>
                        <Button variant = 'secondary' onClick = {()=>{this.goBack();}}>Cancel</Button>
                      </Col>
                      <Col xs className = 'd-flex justify-content-end'>
                        <Button type = 'submit' variant = 'danger'>Pay</Button>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </Form>
        </Row>
      </Container>
    );
  }
  goBack = () => {
    this.setState({goBack: true});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if(form.checkValidity()){
      this.props.tryAddRental();
    }
    else {
      this.setState({validated: true});
    }
  }
}
export default PaymentStub;
