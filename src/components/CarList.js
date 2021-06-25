import React from 'react';
import { Container, Row, Card, Col, Badge, Button, Collapse, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { segmentsColors, getBrands, getCarsByFilters } from '../helper.js';
import NewsComponent from './NewsComponent.js';
class CarList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeSegment: undefined, activeBrand: undefined }; /* Filter */
  }
  render() {
    if (this.props.cars.length === 0)
      return null;
    const cars = getCarsByFilters(this.props.cars, this.state.activeSegment, this.state.activeBrand);
    /* container-xl means fluid until xl breakpoint */
    return (
      <div className='container-xl'>
        <Row>
          <NewsComponent news={this.props.news} />
        </Row>

        <Row>
          <Container fluid className='mt-5'>
            <Row className='d-flex justify-content-center mb-5'>
              <div className='display-4'>Garage</div>
            </Row>

            <Row>
              <Filter brands={getBrands(this.props.cars)} changeBrand={this.changeBrand} changeSegment={this.changeSegment} activeSegment={this.state.activeSegment} activeBrand={this.state.activeBrand} />
            </Row>

            <Row>
              <Col xs={12} className='mt-3'>
                {
                  cars.length === 0 /* There are no cars satisfying filters */
                    ?
                    <Container className='mb-5 d-flex flex-column align-items-center'>
                      <svg height='120' width='120' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enableBackground="new 0 0 64 64"><g fill="#65b1ef"><ellipse cx="17.5" cy="59.9" rx="12.5" ry="1.5" /><ellipse cx="44" cy="60.2" rx="18" ry="1.8" /></g><circle cx="32" cy="32" r="30" fill="#ffdd67" /><path d="m44.7 46c-1.4-3.6-4.8-6-12.7-6-8 0-11.3 2.4-12.7 6-.7 1.9.3 5 .3 5 1.3 3.9 1.1 5 12.4 5 11.3 0 11.1-1.1 12.4-5 0 0 1.1-3.1.3-5" fill="#664e27" /><path d="m41 45c.1-.3 0-.6-.2-.8 0 0-2-2.2-8.8-2.2-6.8 0-8.8 2.2-8.8 2.2-.2.1-.2.5-.2.8l.2.6c.1.3.3.5.5.5h16.6c.2 0 .5-.2.5-.5l.2-.6" fill="#fff" /><g fill="#65b1ef"><path d="m44.5 60.5c2.3 0 4.6 0 6.8 0 8.2-9.9-1.5-20 .9-29.8-2.3 0-4.6 2.5-6.8 2.5-3.2 9.5 7.3 17.4-.9 27.3" /><path d="m19.5 60.5c-2.3 0-4.6 0-6.8 0-8.2-9.9 1.5-20-.9-29.8 2.3 0 4.6 2.5 6.8 2.5 3.2 9.5-7.3 17.4.9 27.3" /></g><g fill="#917524"><path d="m40.7 18.3c3 3 7.2 4.5 11.4 4.1.6-.1.9 2.1.2 2.2-4.9.4-9.7-1.3-13.1-4.8-.6-.5 1.1-1.9 1.5-1.5" /><path d="m12 22.4c4.2.4 8.4-1.1 11.4-4.1.4-.4 2.1 1 1.6 1.5-3.4 3.5-8.3 5.2-13.1 4.8-.9 0-.5-2.2.1-2.2" /></g><g fill="#664e27"><path d="m35.9 30.3c4.2 8 12.7 8 16.9 0 .2-.4-.3-.6-1-1-4.2 3.3-11.1 3-14.9 0-.6.4-1.2.6-1 1" /><path d="m11.2 30.3c4.2 8 12.7 8 16.9 0 .2-.4-.3-.6-1-1-4.2 3.3-11.1 3-14.9 0-.7.4-1.2.6-1 1" /></g></svg>
                      <div className='text-muted'>We're sorry, there are no cars satisfying your filters.</div>
                    </Container>
                    :
                    null
                }
                <Container>
                  <Row>
                    {
                      cars.length === 0 /* There are no cars satisfying filters */
                        ?
                        null
                        :
                        cars.map((car) => {
                          return (
                            <Col key={car.id} className='mb-2' xs={{ offset: 1, span: 10 }} sm={{ offset: 0, span: 6 }} md={4} lg={3}>
                              <Card>
                                <Card.Img src={car.image} style={{ 'maxHeight': '140px' }} />
                                <Card.Body>
                                  <Card.Title>{car.brand + ' ' + car.model}</Card.Title>
                                  <Card.Text>Segment: <Badge variant={this.getSegmentColor(car.segment)}>{car.segment}</Badge></Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Row>
      </div>
    );
  }
  /* Get color of badge according to the Segment */
  getSegmentColor = (segment) => {
    const s = segmentsColors.find(s => s.name === segment);
    return s.color;
  }
  changeSegment = (segment) => {
    this.setState({ activeSegment: segment });
  }
  changeBrand = (brand) => {
    this.setState({ activeBrand: brand });
  }
}
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterIsOpen: false }; /* Is Filter collapsed ? */
  }
  render() {
    const segments = ['A', 'B', 'C', 'D', 'E'];
    const brands = this.props.brands;
    return (
      <Container className='d-flex flex-column align-items-start'>

        <Button variant='link' className='text-secondary font-weight-bold' onClick={() => { this.setState((state) => { return { filterIsOpen: !state.filterIsOpen }; }) }} aria-controls='filter-jumbotron' aria-expanded={this.state.filterIsOpen}>Filter</Button>

        <Collapse in={this.state.filterIsOpen}>
          <Container>
            <Row>
              <Col className='d-flex flex-column'>
                <strong className='border-bottom'>Filter by Segment</strong>
                <ToggleButtonGroup className='d-flex flex-column align-items-start' type='radio' name='radio' value={this.props.activeSegment} onChange={(activeSegment) => { this.props.changeSegment(activeSegment); }}>
                  {segments.map((s) => {
                    return (
                      <ToggleButton key={s} variant='link' className={'text-secondary ' + (s === this.props.activeSegment ? 'font-weight-bold' : '')} value={s}>
                        Segment {s}
                        {
                          s === this.props.activeSegment /* If it is active, then show the remove button */
                            ?
                            <svg onClick={() => { this.props.changeSegment(undefined); }} className='ml-2 pb-1' enableBackground="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="15px" xml="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0 L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z" fill="#040404" /></svg>
                            :
                            null
                        }
                      </ToggleButton>
                    );
                  })
                  }
                </ToggleButtonGroup>
              </Col>
              <Col className='d-flex flex-column'>
                <strong className='border-bottom'>Filter by Brand</strong>
                <ToggleButtonGroup className='d-flex flex-column align-items-start' type='radio' name='radio' value={this.props.activeBrand} onChange={(activeBrand) => { this.props.changeBrand(activeBrand); }}>
                  {brands.map((b) => {
                    return (
                      <ToggleButton key={b} variant='link' className={'text-secondary ' + (b === this.props.activeBrand ? 'font-weight-bold' : '')} value={b}>
                        {b /* Name of brand */}
                        {
                          b === this.props.activeBrand /* If it is active, then show the remove button */
                            ?
                            <svg onClick={() => { this.props.changeBrand(undefined); }} className='ml-2 pb-1' enableBackground="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="15px" xml="preserve" xmlns="http://www.w3.org/2000/svg" ><path d="M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0 L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z" fill="#040404" /></svg>
                            :
                            null
                        }
                      </ToggleButton>
                    )
                  })
                  }
                </ToggleButtonGroup>
              </Col>
            </Row>
          </Container>
        </Collapse>

      </Container>
    );
  }
}
export default CarList;
