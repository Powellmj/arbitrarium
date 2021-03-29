const express = require("express");
const router = express.Router();
const Item = require('../models/Item');

router.post("/", (req, res) => {
    const newItem = new Item({
      name: req.body.name,
      notes: req.body.notes,
      expiration: req.body.expiration,
      quantity: req.body.quantity,
      unit: req.body.unit
    });
    newItem.save().then(item => res.json(item));
    return res
  });

router.post("/index/", (req, res) => {
  Item.insertMany(req.body).then(resp => res.json(resp));
  return res
});

router.patch("/update", (req, res) => {
  const filter = { _id: req.body._id };
  const update = req.body;
  Item.findOneAndUpdate(filter, update, { new: true })
    .then(item => res.json(item))
    .catch(err => res.status(400).json({ unableToUpdate: err}))
})

router.patch("/index/", (req, res) => {
  const filter = { _id: { $in: req.body.updateIds } }
  const update = req.body.updatedItems;
  Item.updateMany(filter, update, { new: true })
    .then(item => res.json(item))
    .catch(err => res.status(400).json({ unableToUpdate: err }))
})

router.get("/index/", (req, res) => {
  Item.find()
    .then(items => res.json(items))
    .catch(err => res.status(404).json({ noItemsFound: err }))
});

router.get("/show/:itemId", (req, res) => {
  Item.findOne({ "_id": `${req.params.itemId}` })
    .then(item => res.json(item))
    .catch(err => res.status(404).json({ noItemsFound: err }))
});

router.delete("/:id", (req, res) => {
  const filter = { "_id": `${req.params.id}` };
  Item.deleteOne(filter)
    .then(response => { console.log(`Deleted ${response.deletedCount} item.`); res.json(response.deletedCount)})
    .catch(err => console.error(`Delete failed with error: ${err}`))
  return req.params.name
});

module.exports = router