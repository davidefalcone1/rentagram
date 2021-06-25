import moment from 'moment';
var user = undefined
const carsDirectory = 'res/cars/'
const rentals = [
  { id: 0, startDate: moment('2021-04-05'), endDate: moment('2021-04-06'), driverAge: 24, extraDrivers: 2, insurance: 1, km: 0, car: { id: 0, brand: "Audi", model: "A1", image: carsDirectory + "a1_image.jpg", segment: 'C' } },
  { id: 1, startDate: moment('2021-05-08'), endDate: moment('2021-06-30'), driverAge: 24, extraDrivers: 0, insurance: 1, km: 0, car: { id: 8, brand: "Fiat", model: "Panda", image: carsDirectory + "panda_image.jpg", segment: 'E' } },
  { id: 2, startDate: moment('2020-02-03'), endDate: moment('2020-04-20'), driverAge: 24, extraDrivers: 2, insurance: 0, km: 2, car: { id: 6, brand: "Mercedes", model: "C-Class", image: carsDirectory + "cclass_image.jpg", segment: 'A' } },
  { id: 3, startDate: moment('2020-11-12'), endDate: moment('2021-01-06'), driverAge: 24, extraDrivers: 0, insurance: 0, km: 1, car: { id: 4, brand: "Alfa Romeo", model: "Giulia", image: carsDirectory + "giulia_image.jpg", segment: 'B' } }
]
const cars = [
  { id: 0, brand: "Audi", model: "A1", image: carsDirectory + "a1_image.jpg", segment: 'C' },
  { id: 1, brand: "Audi", model: "A1", image: carsDirectory + "a1_image.jpg", segment: 'C' },
  { id: 2, brand: "Audi", model: "A4", image: carsDirectory + "a4_image.jpg", segment: 'B' },
  { id: 3, brand: "Alfa Romeo", model: "Giulia", image: carsDirectory + "giulia_image.jpg", segment: 'B' },
  { id: 4, brand: "Alfa Romeo", model: "Giulia", image: carsDirectory + "giulia_image.jpg", segment: 'B' },
  { id: 5, brand: "Mercedes", model: "A-Class", image: carsDirectory + "aclass_image.jpg", segment: 'B' },
  { id: 6, brand: "Mercedes", model: "C-Class", image: carsDirectory + "cclass_image.jpg", segment: 'A' },
  { id: 7, brand: "Mercedes", model: "C-Class", image: carsDirectory + "cclass_image.jpg", segment: 'A' },
  { id: 8, brand: "Fiat", model: "Panda", image: carsDirectory + "panda_image.jpg", segment: 'E' },
  { id: 9, brand: "Fiat", model: "Panda", image: carsDirectory + "panda_image.jpg", segment: 'E' },
]
export function getNews() {
  return new Promise(async function (resolve, reject) {
    const imageDirectory = "res/news/"
    const news = [
      { id: 0, image: imageDirectory + "carousel_a4_image.jpg", title: "Audi A4 available in Garage", subTitle: "Try the new Audi A4, available from 06/08" },
      { id: 1, image: imageDirectory + "carousel_promo_image.jpg", title: "Special promo", subTitle: "Complete 3 rentals and get 10% off on future rentals." },
      { id: 2, image: imageDirectory + "carousel_giulia_image.jpg", title: "Alfa Romeo Giulia available in garage", subTitle: "Try Alfa Romeo Giulia, available from 05/02." }
    ]
    resolve(news)
  });
}
export function deleteRental(rental) {
  return new Promise(async function (resolve, reject) {
    rentals = rentals.filter(r => r.id != rental.id)
  });
}
export function carList() {
  return new Promise(async function (resolve, reject) {
    resolve(cars)
  });
}
export function addRental(rental) {
  return new Promise(async function (resolve, reject) {
    const car = cars.filter(c => c.segment === rental.segment)[0]
    const completeRental = { ...rental, id: rentals.length, startDate: moment(rental.startDate), endDate: moment(rental.endDate), car: car }
    rentals.push(completeRental)
    resolve(completeRental)
  });
}
export function getPrices() {
  return new Promise(async function (resolve, reject) {
    const prices = {
      segment: {
        A: 50,
        B: 40,
        C: 30,
        D: 20,
        E: 10
      },
      driverAge: {
        lt25: 0.2,
        mt65: 0.1
      },
      extraDriver: 0.1,
      insurance: 0.3,
      km: {
        lt50: 0.1,
        unlimited: 0.2
      },
      fewCars: 0.1,
      promo: -0.3
    }
    resolve(prices)
  });
}
export function getAvailableCars() {
  return new Promise(async function (resolve, reject) {
    const availableCars = { availableCars: 4, fewCars: 0 }
    resolve(availableCars)
  });
}

export function cancelRent(rentalID) {
  return new Promise(function (resolve, reject) {
    rentals = rentals.filter(r => r.id !== rentalID);
    resolve();
  });
}

export function rentalList() {
  return new Promise(async function (resolve, reject) {
    resolve(rentals)
  });
}
export function isLogged() {
  return new Promise(async function (resolve, reject) {
    if (user)
      resolve(user)
    else
      reject()
  });
};
export function login() {
  return new Promise(async function (resolve, reject) {
    user = { id: 0, email: "johndoe@mail.com", name: "johndoe", hasPromo: 1 }
    resolve(user)
  });
};
export function logout() {
  return new Promise(async function (resolve, reject) {
    user = undefined
    resolve()
  });
};
