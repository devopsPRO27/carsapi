const express = require('express');
const app = express();
const fs = require('fs');

// Middleware to parse JSON data
app.use(express.json());

// Load the cars data from the JSON file
const carsData = JSON.parse(fs.readFileSync('./cars.json'));

// Route to get all cars
app.get('/cars', (req, res) => {
  res.json(carsData.cars);
});

// Route to get a single car by ID
app.get('/cars/:id', (req, res) => {
  const carId = parseInt(req.params.id);
  const car = carsData.cars.find((car) => car.id === carId);
  if (car) {
    res.json(car);
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

// Route to add a new car
app.post('/cars', (req, res) => {
  const newCar = req.body;
  newCar.id = carsData.cars.length + 1;
  carsData.cars.push(newCar);
  fs.writeFileSync('./cars.json', JSON.stringify(carsData, null, 2));
  res.status(201).json(newCar);
});

// Route to update a car by ID
app.put('/cars/:id', (req, res) => {
  const carId = parseInt(req.params.id);
  const updatedCar = req.body;
  const index = carsData.cars.findIndex((car) => car.id === carId);
  if (index !== -1) {
    carsData.cars[index] = { ...updatedCar, id: carId };
    fs.writeFileSync('./cars.json', JSON.stringify(carsData, null, 2));
    res.json(carsData.cars[index]);
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

// Route to delete a car by ID
app.delete('/cars/:id', (req, res) => {
  const carId = parseInt(req.params.id);
  const index = carsData.cars.findIndex((car) => car.id === carId);
  if (index !== -1) {
    const deletedCar = carsData.cars.splice(index, 1)[0];
    fs.writeFileSync('./cars.json', JSON.stringify(carsData, null, 2));
    res.json(deletedCar);
  } else {
    res.status(404).json({ message: 'Car not found' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
