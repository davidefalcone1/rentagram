import React from 'react';
import RentalForm from './RentalForm.js';
import * as API from '../api/fetch.js';
import moment from 'moment';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AuthContext } from '../AuthContext.js';
import PaymentStub from './PaymentStub.js'
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

class AddRentalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableCars: undefined, /* It is an object with the number of available cars and a boolean that indicates if are available less than 10% cars*/
      prices: undefined, /* Object which contains all the prices. It is used to compute the total and is also passed to RentalForm */
      total: undefined, /* Total according to current configuration */
      totalPromo: undefined, /* Total with frequent user promo. It is undefined if the user is not a frequent user. It is used in order to show both the total and the total with promo */
      validated: false,
      rental: {
        startDate: moment().add(1, 'days').format('YYYY-MM-DD'), /* Initial value is tomorrow */
        endDate: moment().add(2, 'days').format('YYYY-MM-DD'), /* Initial value is the day after tomorrow */
        driverAge: '',
        extraDrivers: '',
        km: '', /* 0 means less than 50 km, 1 means between 50 and 150, 2 means unlimited km per day */
        insurance: false,
        segment: ''
      }
    };
  }
  componentDidMount() {
    /* Fetch prices */
    API.getPrices()
      .then((prices) => { this.setState({ prices }); })
      .catch((e) => { this.props.setAlert(true, 'Sorry, something went wrong. Try again.'); });
  }
  render() {
    return (
      <Switch>
        <Route exact path='/add/payment'>
          <PaymentStub tryAddRental={this.tryAddRental} amount={this.state.hasPromo ? this.state.totalPromo : this.state.total /* If the user is a frequent one, then use the total promo instead of total */} />
        </Route>
        <Route>
          <AuthContext.Consumer>
            {
              value =>
                value.authUser ?
                  <Form noValidate validated={this.state.validated /* If true shows validation messages */} onSubmit={(e) => { this.handleSubmit(e) }}>
                    <Form.Row>
                      <Col xs={12} md={{ span: '7', offset: '0' }} lg={{ span: '5', offset: '1' }} xl={{ span: '4', offset: '1' }}>
                        <RentalForm prices={this.state.prices} rental={this.state.rental} updateField={this.updateField} />
                      </Col>
                      <Col xs={12} md={{ span: '4', offset: '0' }} lg={{ span: '4', offset: '2' }} xl={{ span: '4', offset: '3' }}>
                        <Checkout availableCars={this.state.availableCars} total={this.state.total} totalPromo={this.state.totalPromo} hasPromo={value.authUser.hasPromo} promoPercentage={this.state.prices && this.state.prices.promo} />
                      </Col>
                    </Form.Row>
                  </Form>
                  :
                  <Redirect to={'/public'} />
            }
          </AuthContext.Consumer>
        </Route>
      </Switch>
    );
  }
  updateField = (name, value) => {
    this.setState((state) => {
      const newRental = { ...state.rental, [name]: value };
      return ({ rental: newRental });
    });
  }

  async componentDidUpdate(propsPrec, statePrec) {
    if (this.state.rental.startDate !== statePrec.rental.startDate || this.state.rental.endDate !== statePrec.rental.endDate || this.state.rental.segment !== statePrec.rental.segment) {
      /* Fetch cars only if startDate, endDate and segment has changed */
      const availableCars = await API.getAvailableCars();
      const [total, totalPromo] = this.computeTotal(this.state.rental, availableCars);
      this.setState({ availableCars, total, totalPromo });
    }
    else if (this.state.rental !== statePrec.rental) {
      /* In this case we do not fetch, we simply update the state */
      const [total, totalPromo] = this.computeTotal(this.state.rental, this.state.availableCars);
      this.setState({ total, totalPromo });
    }
  }

  computeTotal = (newRental, availableCars) => {
    let total = 0, fee = 0;
    let startDate = moment(newRental.startDate, 'YYYY-MM-DD');
    let endDate = moment(newRental.endDate, 'YYYY-MM-DD');
    let nDays = moment.duration/*Creates a duration object*/(endDate.diff(startDate) /* Gets the milliseconds between the 2 moments */).as('days') /* Milliseconds as days */;
    /* Duration and car segment */
    switch (newRental.segment) {
      case 'A':
        fee = total += nDays * this.state.prices.segment.A;
        break;
      case 'B':
        fee = total += nDays * this.state.prices.segment.B;
        break;
      case 'C':
        fee = total += nDays * this.state.prices.segment.C;
        break;
      case 'D':
        fee = total += nDays * this.state.prices.segment.D;
        break;
      case 'E':
        fee = total += nDays * this.state.prices.segment.E;
        break;
      default:
        return [undefined, undefined];
    }
    /* Driver age */
    if (parseInt(newRental.driverAge) > 65)
      total += fee * this.state.prices.driverAge.mt65;
    else if (parseInt(newRental.driverAge) < 25)
      total += fee * this.state.prices.driverAge.lt25;
    /* Extra drivers */
    total += fee * (newRental.extraDrivers * this.state.prices.extraDriver);
    /* Extra insurance */
    total += fee * (newRental.insurance ? this.state.prices.insurance : 0);
    /* Estimated km */
    if (newRental.km === '0')
      total += fee * this.state.prices.km.lt50;
    else if (newRental.km === '2')
      total += fee * this.state.prices.km.unlimited;
    /* Less than 10% available cars */
    if (availableCars.fewCars)
      total += fee * this.state.prices.fewCars;
    return [total, total + total * this.state.prices.promo];
  }

  tryAddRental = () => {
    this.props.addRental(this.state.rental);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity())
      this.props.openPaymentStub(this.state.totalPromo || this.state.total);
    else {
      this.setState({ validated: true });
    }
  }
}
function Checkout(props) {
  return (
    <Container className='mb-5 mt-5'>
      <Row>
        <Col>
          {
            /* Total is defined only if the user has provided enough information */
            props.total
              ?
              <>
                {
                  !props.hasPromo
                    ?
                    /* No Promo */
                    <div className='h4'>Total: <small>{props.total.toFixed(2) + "€"}</small></div>
                    :
                    /* Promo */
                    <>
                      <div className='h4'>Subtotal: <small>{props.total.toFixed(2) + "€"}</small></div>
                      <div className='h4'>Promo: <small>{props.promoPercentage * 100 + '%'}</small></div>
                      <div className='h3'>Total: <small>{props.totalPromo.toFixed(2) + "€"}</small></div>
                    </>
                }
                <div className='font-weight-light'>Available cars: {props.availableCars.availableCars && props.availableCars.availableCars.toString()}</div>
              </>
              :
              <div className='h3'>Total: 0€</div>
          }
        </Col>
        <Col>
          <Button size='sm' type='submit' variant='danger' disabled={props.availableCars && props.availableCars.availableCars === 0 /* Make the user able to go on iff at least one car is available */}>Procede with payment</Button>
        </Col>
      </Row>
    </Container>
  );
}
export default AddRentalComponent;
