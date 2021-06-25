import React from 'react';
import { ListGroup, Container, Row, Col, Badge, Image, Tab, Tabs, Button } from 'react-bootstrap';
import NewsComponent from './NewsComponent.js';
import { segmentsColors, getPastRentals, getFutureRentals } from '../helper.js';
import moment from 'moment';
import endTimeImage from '../res/icon_time_end.svg';
import startTimeImage from '../res/icon_time_start.svg';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../AuthContext.js';

function RentalList(props) {
  return (
    <AuthContext.Consumer>
      {
        value =>
          value.authUser ?
            <Container>

              <div className="display-4 mt-2 mt-md-3 mb-2 mb-md-3">My rentals</div>

              <Tabs transition={false} defaultActiveKey="rentals" id="tab">
                <Tab eventKey="rentals" title="Rentals">
                  {
                    getFutureRentals(props.rentals).length === 0 /* If user has no future rentals, then show a suitable message. */
                      ?
                      <Container className='h-100 my-5 d-flex flex-row align-items-center justify-content-center'>
                        <div className='display-5'>Click</div>
                        <Button disabled variant='danger' size='lg' className='rounded-circle mx-3'>+</Button>
                        <div className='display-5'> and add a new rental!</div>
                      </Container>
                      :
                      <ListGroup>
                        {getFutureRentals(props.rentals).map(rental => <RentalRow deleteRental={props.deleteRental} activeCancelAction={moment().isBefore(rental.startDate) /* You can cancel only a rental that is not started yet */} rental={rental} key={rental.id} />)}
                      </ListGroup>
                  }
                </Tab>
                <Tab eventKey="pastrentals" title="Past rentals">
                  {
                    getPastRentals(props.rentals).length === 0
                      ?
                      <Container className='h-100 my-5 d-flex flex-row align-items-center justify-content-center'>
                        <div className='display-5'>You do not have past rentals.</div>
                      </Container>
                      :
                      <ListGroup>
                        {getPastRentals(props.rentals).map(rental => <RentalRow deleteRental={props.deleteRental} activeCancelAction={false /* You can cancel only a rental that is not started yet */} rental={rental} key={rental.id} />)}
                      </ListGroup>
                  }
                </Tab>
              </Tabs>

              <NewsComponent className='my-5' news={props.news} />

            </Container>
            :
            <Redirect to={'/public'} />
      }
    </AuthContext.Consumer>
  );
}

function RentalRow(props) {
  return (
    <ListGroup.Item>
      <Row>
        <Col xs={12} lg={5} className='container-fluid'>
          <Row>
            <Col className='d-flex align-items-center'>
              <p className='ml-2'>Rent no. {props.rental.id} <strong className='text-danger'>{moment().isBetween(props.rental.startDate, props.rental.endDate) ? 'ACTIVE' : ''}</strong></p>
            </Col>
            <Col className='d-flex flex-row align-items-start justify-content-center'>
              <div>{props.rental.car.brand + " " + props.rental.car.model}</div>
              <Badge className='mr-2 ml-2' variant={getSegmentColor(props.rental.car.segment)}> {props.rental.car.segment}</Badge>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex align-items-center'>
              <Image src={startTimeImage} widht='20' height='20' />
              <small>{props.rental.startDate.format('MM/DD/YYYY')}</small>
            </Col>
            <Col className='d-flex align-items-center justify-content-center'>
              <svg xmlns="http://www.w3.org/2000/svg"
                width="25" height="25" viewBox="0 0 561 561" enableBackground='new 0 0 561 561' xml="preserve">
                <path d="M357,280.5c56.1,0,102-45.9,102-102s-45.9-102-102-102s-102,45.9-102,102S300.9,280.5,357,280.5z M127.5,229.5V153h-51
                  v76.5H0v51h76.5V357h51v-76.5H204v-51H127.5z M357,331.5c-68.85,0-204,33.15-204,102v51h408v-51
                  C561,364.65,425.85,331.5,357,331.5z"/>
              </svg>
              <small>Extra Drivers: {props.rental.extraDrivers}</small>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex align-items-center'>
              <Image src={endTimeImage} widht='20' height='20' />
              <small>{props.rental.endDate.format('MM/DD/YYYY')}</small>
            </Col>
            <Col className='d-flex align-items-end justify-content-center'>
              <svg version="1.1" width='25' height='25' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000" xml="preserve">
                <g><path d="M492.3,260.6l1.8-0.1c47.5,1.2,76.8-28.8,85.5-57.3c14.9-48.3-16.7-95-42.2-132.5c-12.9-19-25-37-28.8-51.2l-2.5-9.5l-16.3,0.1c-4.1,0.4-7.5,1.8-10,4.2c-9.1,3.5-9.4,11.7-9.3,11.7c-3.2,18.9-15.9,36.6-29.4,55.3c-20.6,28.6-44,61-39.3,106.3C405.8,225.6,454.9,260.6,492.3,260.6L492.3,260.6z M478.1,107.4c5.5-8.1,10.8-16,15.3-23.7c27,36.8,47.4,81.6,38.4,110.3c-3.7,13.2-11.3,31.4-37,31.4c-7.3-0.6-19.2-2.9-22.3-4.4c-18-8.8-20.5-16.6-24.9-30.5C439.7,164.5,460.1,134.2,478.1,107.4L478.1,107.4z M950.5,829.1c-0.5-11.4-1.1-22.7-1.1-33.1V566.6c0-11.1,0.5-23.2,1.1-35.3c1.4-32,2.8-62.1-4.4-82.2C927.6,396.7,832.4,378.5,773,367c-61.9-12-120.1-17.6-203.3-23.2v-52l-9.9-2.2c-42.6-9.7-100.4-9.7-142.9,0l-9.9,2.2v54.2c-63.5,2.4-124.3,10-190.3,23.6l-6,1.2C152.2,382.9,71.9,399.5,54.4,449c-8.1,22.9-6.4,53.3-4.7,82.6C50.3,542.9,51,554,51,564v229.4c0,11.5-0.5,23.8-0.9,36c-1.2,32.3-2.4,33.4,4.3,52.4c18,50.9,113.4,73.5,194.4,87.4c80.1,13.8,163.4,20.8,247.4,20.8c84.2,0,169.1-7,252.6-20.8c118.8-19.6,183.3-48.2,197-87.4C953.5,860.4,951.9,858.9,950.5,829.1L950.5,829.1z M258.5,786.6l11.7,20.1l10.6-20.6c15.6-30.3,55.7-49.8,102.2-49.8c46.5,0,86.4,19.6,101.8,49.8l11.4,22.5l11.3-22.5c15.3-30.4,55.7-50,103.1-50c36.4,0,81.3,13,98,49.6l9.7,21.1l12.6-19.5c19.9-30.5,66.4-52.7,110.9-52.7c21.9,0,41.9,5.4,58.1,15.7v108.3C828.9,915,692,928.2,580,933.4c-50.5,2.3-105,2.3-157.1,0c-113.3-5.1-251.6-18.1-322.5-75V745.7c15.3-7.6,32.9-11.6,51.6-11.6C195.8,734.1,240.7,756.1,258.5,786.6L258.5,786.6z M523,511.6c-20.3,3.8-49,3.8-69.3,0l-0.4-182.1c10.2-0.4,25.4-0.7,40.5-0.7c13.1,0,22.5,0.3,29.1,0.7L523,511.6L523,511.6z" /></g>
              </svg>
              <small>Driver age: {props.rental.driverAge}</small>
            </Col>
          </Row>
          <Row>
            <Col className='d-flex align-items-center ml-1 mt-1'>
              <svg height="20" viewBox="0 -71 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m227.078125 113.53125c0-62.332031-50.476563-113.089844-112.707031-113.5195312l-.839844-.0117188c-62.601562 0-113.53125 50.929688-113.53125 113.53125 0 34.328125 17.128906 60.527344 36.21875 86.558594l52.351562 71.429687c-16.378906 8.878907-27.53125 26.25-27.53125 46.160157 0 28.949218 23.550782 52.5 52.5 52.5 23.742188 0 43.851563-15.828126 50.3125-37.488282h23.820313v-30h-23.820313s0 0 0-.011718c-4-13.398438-13.210937-24.558594-25.273437-31.128907.5-.710937 52.292969-71.460937 52.292969-71.460937 19.078125-26.03125 36.207031-52.230469 36.207031-86.558594zm-113.539063 226.808594c-12.507812 0-22.660156-10.140625-22.660156-22.660156 0-12.507813 10.152344-22.648438 22.660156-22.648438 12.511719 0 22.660157 10.140625 22.660157 22.648438 0 12.519531-10.148438 22.660156-22.660157 22.660156zm.050782-85.449219-53.179688-72.539063c-16.640625-22.691406-30.410156-43.53125-30.410156-68.820312 0-45.890625 37.199219-83.261719 83.019531-83.53125h.519531c46.0625 0 83.539063 37.480469 83.539063 83.53125 0 25.289062-13.769531 46.128906-30.40625 68.820312 0 0-52.351563 71.527344-53.082031 72.539063zm0 0" /><path d="m113.539062 58.421875c-30.390624 0-55.109374 24.71875-55.109374 55.109375s24.71875 55.109375 55.109374 55.109375c30.390626 0 55.109376-24.71875 55.109376-55.109375s-24.71875-55.109375-55.109376-55.109375zm0 80.21875c-13.847656 0-25.109374-11.261719-25.109374-25.109375 0-13.839844 11.261718-25.109375 25.109374-25.109375 13.851563 0 25.109376 11.269531 25.109376 25.109375 0 13.847656-11.257813 25.109375-25.109376 25.109375zm0 0" /><path d="m512 113.53125c0-62.332031-50.480469-113.089844-112.710938-113.5195312l-.839843-.0117188c-62.597657 0-113.527344 50.929688-113.527344 113.53125 0 34.328125 17.128906 60.527344 36.207031 86.558594l52.359375 71.429687c-12.089843 6.550781-21.339843 17.75-25.339843 31.160157v.011718h-23.109376v30h23.109376c6.460937 21.660156 26.570312 37.488282 50.3125 37.488282 28.949218 0 52.5-23.550782 52.5-52.5 0-19.890626-11.121094-37.238282-27.472657-46.140626.523438-.710937 52.300781-71.449218 52.300781-71.449218 19.082032-26.03125 36.210938-52.230469 36.210938-86.558594zm-113.539062 226.808594c-12.511719 0-22.660157-10.140625-22.660157-22.660156 0-12.507813 10.148438-22.648438 22.660157-22.648438 12.507812 0 22.660156 10.140625 22.660156 22.648438 0 12.519531-10.152344 22.660156-22.660156 22.660156zm.050781-85.449219-53.183594-72.539063c-16.636719-22.691406-30.40625-43.53125-30.40625-68.820312 0-45.890625 37.199219-83.261719 83.019531-83.53125h.519532c46.058593 0 83.539062 37.480469 83.539062 83.53125 0 25.289062-13.769531 46.128906-30.410156 68.820312 0 0-52.339844 71.527344-53.078125 72.539063zm0 0" /><path d="m398.460938 58.421875c-30.390626 0-55.109376 24.71875-55.109376 55.109375s24.71875 55.109375 55.109376 55.109375c30.390624 0 55.109374-24.71875 55.109374-55.109375s-24.71875-55.109375-55.109374-55.109375zm0 80.21875c-13.851563 0-25.109376-11.261719-25.109376-25.109375 0-13.839844 11.257813-25.109375 25.109376-25.109375 13.847656 0 25.109374 11.269531 25.109374 25.109375 0 13.847656-11.261718 25.109375-25.109374 25.109375zm0 0" /><path d="m209.039062 302.691406h36.628907v30h-36.628907zm0 0" /><path d="m267.039062 302.691406h36.628907v30h-36.628907zm0 0" /></svg>
              <small className='ml-1'>Distance: {getKm(props.rental.km)}</small>
            </Col>
          </Row>
          <Row>
            {
              props.rental.insurance
                ?
                <Col className='d-flex align-items-center ml-1'>
                  <svg enableBackground="new 0 0 64 64" height="25" viewBox="0 0 64 64" width="25" xmlns="http://www.w3.org/2000/svg"><g><path d="m58 45h-1.62l-4.232-3.761c-2.058-1.83-4.516-3.094-7.148-3.74v-35.499c0-.552-.447-1-1-1h-42c-.553 0-1 .448-1 1v60c0 .552.447 1 1 1h42c.553 0 1-.448 1-1v-7h2.101c.465 2.279 2.484 4 4.899 4s4.434-1.721 4.899-4h5.101c.553 0 1-.448 1-1v-4c0-2.757-2.243-5-5-5zm-4.63 0h-11.37v-5.954c3.261.221 6.362 1.503 8.82 3.688zm-13.37 0h-11.37l2.549-2.266c2.458-2.185 5.5593.467 8.82-3.688v5.954zm3 16h-40v-58h40v34.134c-.661-.079-1.327-.134-2-.134-4.114 0-8.074 1.505-11.148 4.239l-4.28 3.805c-2.554.221-4.572 2.346-4.572 4.956v4c0 .552.447 1 1 1h3.101c.465 2.279 2.484 4 4.899 4s4.434-1.721 4.899-4h8.101zm-16-7c0-1.654 1.346-3 3-3s3 1.346 3 3-1.346 3-3 3-3-1.346-3-3zm25 3c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm9-4h-4.101c-.465-2.279-2.484-4-4.899-4s-4.434 1.721-4.899 4h-12.202c-.465-2.279-2.484-4-4.899-4s-4.434 1.721-4.899 4h-2.101v3c0-1.654 1.346-3 3-3h32c1.654 0 3 1.346 3 3z" /><path d="m22.094 34.598.352.234c.167.112.361.168.554.168s.387-.056.555-.168l.352-.234c7.572-5.049 12.093-13.496 12.093-22.598 0-.379-.214-.725-.553-.895l-12-6c-.281-.141-.613-.141-.895 0l-12 6c-.338.17-.552.516-.552.895 0 9.102 4.521 17.549 12.094 22.598zm.906-27.48 10.992 5.496c-.196 8.115-4.269 15.607-10.992 20.183-6.723-4.576-10.796-12.068-10.992-20.183z" /><path d="m30 19c0-1.312-.369-2.536-1-3.586l1.707-1.707-1.414-1.414-1.5621.562c-1.248-1.147-2.906-1.855-4.731-1.855-3.859 0-7 3.14-7 7s3.141 7 7 7 7-3.14 7-7zm-12 0c0-2.757 2.243-5 5-5 1.273 0 2.423.493 3.307 1.279l-3.307 3.307-1.293-1.293-1.414 1.414 2 2c.195.195.451.293.707.293s.512-.098.707-.293l3.812-3.812c.301.642.481 1.351.481 2.105 0 2.757-2.243 5-5 5s-5-2.243-5-5z" /><path d="m7 39h22v-2h-23c-.553 0-1 .448-1 1v20c0 .552.447 1 1 1h15v-2h-14z" /><path d="m9 41h17v2h-17z" /><path d="m9 45h10v2h-10z" /><path d="m9 49h10v2h-10z" /><path d="m9 53h10v2h10z" /></g></svg>
                  <small>Insurance</small>
                </Col>
                : null
            }
          </Row>
        </Col>
        <Col lg={5} className='d-none d-lg-flex justify-content-end'>
          <Image rounded src={props.rental.car.image} style={{ 'maxWidth': '300px', 'maxHeight': '200px' }} />
        </Col>
        <Col lg={2} className={'justify-content-end align-items-start ' + (props.activeCancelAction ? 'd-flex' : 'invisible') /* Use invisible for hide the element, but it occupies space */}>
          <Button variant='link' className='text-danger' onClick={() => { props.deleteRental(props.rental) }}>DELETE</Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
function getKm(km) {
  switch (km) {
    case 0:
      return 'Less than 50 km per day';
    case 1:
      return 'Less than 150 km per day';
    default:
      return 'Unlimited km';
  }
}
function getSegmentColor(segment) {
  const s = segmentsColors.find(s => s.name === segment);
  return s.color;
}

export default RentalList;
