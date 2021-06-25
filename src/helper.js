import moment from 'moment';
export let segmentsColors = [
  { name: 'A', color: 'danger' /* Color of the badge */ },
  { name: 'B', color: 'secondary' /* Color of the badge */ },
  { name: 'C', color: 'primary' /* Color of the badge */ },
  { name: 'D', color: 'dark' /* Color of the badge */ },
  { name: 'E', color: 'info' /* Color of the badge */ },
];
export function getBrands(cars) {
  const brands = [];
  cars.forEach((car) => {
    if (!brands.includes(car.brand))
      brands.push(car.brand);
  });
  brands.sort();
  return brands;
}
export function getCarsByFilters(cars, segment, brand) {
  let filterCars = cars;
  if (segment)
    filterCars = getCarsBySegment(filterCars, segment);
  if (brand)
    filterCars = getCarsByBrand(filterCars, brand);
  return filterCars;
}
function getCarsBySegment(cars, segment) {
  return cars.filter(c => c.segment === segment);
}
function getCarsByBrand(cars, brand) {
  return cars.filter(c => c.brand === brand);
}
export function getPastRentals(rentals) {
  const pastRentals = [];
  rentals.forEach((rental) => {
    if (rental.endDate.isBefore(moment()))
      pastRentals.push(rental);
  });
  return pastRentals;
}
export function getFutureRentals(rentals) {
  const pastRentals = getPastRentals(rentals);
  return rentals.filter(rental => !pastRentals.includes(rental));
}
