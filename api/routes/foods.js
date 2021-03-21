const express = require("express");
const router = express.Router();
const Food = require('../models/Food');

router.post("/", (req, res) => {
    const newFood = new Food({
      name: req.body.name,
      notes: req.body.notes,
      expiration: req.body.expiration,
      quantity: req.body.quantity,
      unit: req.body.unit
    });
    newFood.save().then(food => res.json(food));
    return res
  });

router.post("/index/", (req, res) => {
  Food.insertMany(req.body).then(resp => res.json(resp));
  return res
});

router.patch("/update", (req, res) => {
  const filter = { _id: req.body._id };
  const update = req.body;
  Food.findOneAndUpdate(filter, update, { new: true })
    .then(food => res.json(food))
    .catch(err => res.status(400).json({ unableToUpdate: err}))
})

router.get("/index/", (req, res) => {
  Food.find()
    .then(foods => res.json(foods))
    .catch(err => res.status(404).json({ noFoodsFound: err }))
});

router.get("/show/:foodId", (req, res) => {
  Food.findOne({ "_id": `${req.params.foodId}` })
    .then(food => res.json(food))
    .catch(err => res.status(404).json({ noFoodsFound: err }))
});

router.delete("/:id", (req, res) => {
  console.log(req.params.id)
  const filter = { "_id": `${req.params.id}` };
  Food.deleteOne(filter)
    .then(response => { console.log(`Deleted ${response.deletedCount} item.`); res.json(response.deletedCount)})
  .catch(err => console.error(`Delete failed with error: ${err}`))
  return req.params.id
});

module.exports = router