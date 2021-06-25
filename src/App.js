import React from 'react';
import './App.css';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import LogInForm from './components/Login.js';
import Header from './components/Header.js';
import AddRentalComponent from './components/AddRental.js';
import RentalList from './components/RentalList.js';
import { AuthContext } from './AuthContext.js';
import CarList from './components/CarList.js';
import * as API from './api/fetch.js';
import { Button, Container, Alert } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: undefined,
      total: undefined, /* This is the amount to pay for a new rental.
        AddRentalComponent calls openPaymentStub() and provides the total to pay.
        App opens the payment stub. Another possible solution could be to not pass
        through App and let AddRentalComponent to open directly PaymentStub. */
      authUser: undefined,
      authError: undefined, /* Used mainly to notify LogInForm about the TYPE of a login error.
       The EXISTENCE of the error is indicated by the return value of login() */
      rentals: [],
      cars: [],
      alert: {
        showAlert: false,
        alertErr: undefined /* is an error message ?*/,
        alertMsg: undefined
      },
    };
  }
  componentDidMount() {
    /* Fetch news */
    API.getNews()
      .then((news) => { this.setState({ news }) })
      .catch((e) => { this.setAlert(true, 'Sorry, something went wrong. Try again.'); });
    /* Fetch cars */
    API.carList()
      .then((cars) => { this.setState({ cars }) })
      .catch((e) => { this.setAlert(true, 'Sorry, something went wrong. Try again.'); })
    /* Check if the user is already logged in */
    API.isLogged()
      .then(async (user) => { this.setState({ authUser: user, rentals: await API.rentalList() }) })
      .catch((e) => { });
  }
  render() {
    /* Make available the current user and function for both log in and log out to the entire application */
    const value = {
      authUser: this.state.authUser,
      authError: this.state.authError,
      login: this.login,
      logout: this.logout
    }
    return (
      <AuthContext.Provider value={value}>
        <Switch>

          <Route path={'/myrentals'}>
            <Header />
            <RentalList news={this.state.news} deleteRental={this.deleteRental} rentals={this.state.rentals} />
            <Container fluid className='fixed-bottom d-flex mb-3 align-items-center'>
              {
                this.state.alert.showAlert
                  ?
                  <Alert className='mx-auto' variant={this.state.alert.alertErr ? 'danger' : 'success'}>{this.state.alert.alertMsg}</Alert>
                  :
                  null
              }
              <Button variant='danger' size='lg' className='ml-auto rounded-circle mr-3' onClick={() => { this.requestAdd(); }}>+</Button>
            </Container>
          </Route>

          <Route path={'/add'}>
            <Header />
            <AddRentalComponent setAlert={this.setAlert /* Is passed to handle fetch errors */} openPaymentStub={this.openPaymentStub} addRental={this.addRental} />
            {
              this.state.alert.showAlert
                ?
                <Container fluid className='fixed-bottom d-flex mb-3 align-items-center'>
                  <Alert className='mx-auto' variant={this.state.alert.alertErr ? 'danger' : 'success'}>{this.state.alert.alertMsg}</Alert>
                </Container>
                :
                null
            }
          </Route>

          <Route>
            <Route path={'/'}>
              <Header />
              <CarList news={this.state.news} cars={this.state.cars} />
              <Container fluid className='fixed-bottom d-flex mb-3'>
                {
                  this.state.alert.showAlert
                    ?
                    <Alert className='mx-auto' variant={this.state.alert.alertErr ? 'danger' : 'success'}>{this.state.alert.alertMsg}</Alert>
                    :
                    null
                }
              </Container>
            </Route>
          </Route>
        </Switch>
      </AuthContext.Provider>
    );
  }
  login = async (email, password) => {
    try {
      const user = await API.login(email, password);
      const rentals = await API.rentalList();
      this.setState({ authUser: user, rentals: rentals, authError: undefined });
      this.setAlert(false, `Welcome, ${this.state.authUser.name}`)
      this.props.history.push('/');
      return true;
    } catch (e) { }
  }
  logout = async () => {
    try {
      await API.logout();
      const username = this.state.authUser.name;
      this.props.history.push('/');
      this.setState({ authUser: undefined, rentals: undefined });
      this.setAlert(false, `Goodbye, ${username}`);
    } catch (e) {
      this.setState({ authError: undefined });
    }
  }
  requestAdd = () => {
    this.props.history.push('/add');
  }
  addRental = async (rental) => {
    this.props.history.push('/myrentals');
    try {
      const r = await API.addRental(rental);
      this.setState((state) => {
        const list = state.rentals;
        if (!list.includes(r))
          list.push(r);
        return { ...state, rentals: list };
      });
      this.setAlert(false, 'Your reservation has been correctly submitted.');
    } catch (e) {
      this.setAlert(true, 'We cannot add your reservation right now. Try again.');
    }
  }
  openPaymentStub = (total) => {
    this.setState({ total });
    this.props.history.push('/add/payment');
  }
  setAlert = (alertErr /* is an error message ? */, alertMsg) => {
    this.setState({ alert: { showAlert: true, alertErr, alertMsg } });
    setTimeout(() => {
      this.setState(
        {
          alert: {
            showAlert: false,
            alertMsg: undefined,
            alertErr: undefined
          }
        })
    }, 3000);
  }
  deleteRental = async (rental) => {
    try {
      API.deleteRental(rental);
      this.setState((state) => {
        const newList = state.rentals.filter(r => r.id !== rental.id);
        return { ...state, rentals: newList };
      });
      this.setAlert(false, 'Your rental has been deleted.');
    } catch (e) {
      this.setAlert(true, 'We cannot delete your rental right now. Try again.');
    }
  }
}

export default withRouter(App);
