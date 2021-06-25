import React from 'react';
import { Container, Form, FormControl, Col } from 'react-bootstrap';
import moment from 'moment';
function RentalForm(props) {
  if (!props.prices)
    return null
  let agesOptions = []; /* Array of object (key, value) used to populate the select for the age of the driver */
  for (let i = 18; i <= 75; i++) {
    if (i < 25)
      agesOptions.push({ key: i, value: i + ` (+${props.prices.driverAge.lt25 * 100}%)` });
    else if (i > 65)
      agesOptions.push({ key: i, value: i + ` (+${props.prices.driverAge.mt65 * 100}%)` });
    else
      agesOptions.push({ key: i, value: i });
  }
  let driversOptions = []; /* Array used to populate the select for the age of the driver */
  for (let i = 0; i <= 10; i++)
    driversOptions.push(i);
  return (
    <Container className='d-flex flex-column mt-2 mt-md-5'>
      <div className='display-4 mb-2 mb-md-5'>New rental</div>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>From</Form.Label>
            <Form.Control type='date' name='startDate' value={props.rental.startDate} min={moment().add(1, 'd').format('YYYY-MM-DD')} onChange={(e) => { props.updateField(e.target.name, e.target.value) }} required />
          </Form.Group>
        </Col>
        <Col>
          <Form.Label>To</Form.Label>
          <Form.Control type='date' name='endDate' value={props.rental.endDate} min={moment(props.rental.startDate).add(1, 'd').format('YYYY-MM-DD') /* min is the day after start rental */} onChange={(e) => { props.updateField(e.target.name, e.target.value) }} required />
        </Col>
      </Form.Row>
      <Form.Group controlId="segment">
        <Form.Label>Car segment</Form.Label>
        <Form.Control name='segment' as="select" value={props.rental.segment} onChange={(e) => { props.updateField(e.target.name, e.target.value) }} required>
          <option value=''>Choose a segment</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
          <option>D</option>
          <option>E</option>
        </Form.Control>
        <FormControl.Feedback type='invalid'>Please, choose a segment</FormControl.Feedback>
      </Form.Group>
      <Form.Group controlId='driverAge'>
        <Form.Label>Driver age</Form.Label>
        <Form.Control name='driverAge' as='select' value={props.rental.driverAge.toString()} onChange={(e) => { props.updateField(e.target.name, e.target.value) }} required>
          <option value='' key='0'>Select age of the driver</option>
          {
            agesOptions.map((option) => <option key={option.key} value={option.key}>{option.value}</option>)
          }
        </Form.Control>
        <FormControl.Feedback type='invalid'>Please, select the age of the driver</FormControl.Feedback>
      </Form.Group>
      <Form.Group controlId='extraDrivers'>
        <Form.Label>Extra drivers  (+{props.prices ? (props.prices.extraDriver * 100) : ''}% per-driver)</Form.Label>
        <Form.Control name='extraDrivers' as='select' value={props.rental.extraDrivers.toString()} onChange={(e) => { props.updateField(e.target.name, e.target.value) }} required>
          <option value='' key='0'>Number of extra drivers</option>
          {
            driversOptions.map((option) => <option key={option}>{option}</option>)
          }
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="km">
        <Form.Label>Estimated kilometers per day</Form.Label>
        <Form.Control as='select' name='km' value={props.rental.km} onChange={(e) => { props.updateField(e.target.name, e.target.value) }} required>
          <option value=''>Estimated kilometers per day</option>
          <option value='0'>Less than 50 km per day ({props.prices.km.lt50 * 100}%)</option>
          <option value='1'>Between 50 km and 150 km per day</option>
          <option value='2'>More than 150 km per day (+{props.prices.km.unlimited * 100}%)</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Check name='insurance' type='checkbox' label={'Add insurance (+' + props.prices.insurance * 100 + '%)'} checked={props.rental.insurance} onChange={(e) => { props.updateField(e.target.name, e.target.checked) }} />
      </Form.Group>
    </Container>
  );
}
export default RentalForm;
