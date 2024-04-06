const express = require("express");
const router = express.Router();
const Contact = require('../models/Contact');
const { PowerShell } = require('node-powershell');
const path = require('path')

router.post("/", (req, res) => {
    const newItem = new Contact({
      hostname: req.body.hostname,
      ip_address: req.body.ip_address,
      mac_address: req.body.mac_address,
      description: req.body.description,
    });
    newItem.save().then(item => res.json(item));
    return res
  });

router.post("/index/", (req, res) => {
  Contact.insertMany(JSON.parse(req.body.entries)).then(resp => res.json(resp));
  return res
});

router.patch("/update", (req, res) => {
  const filter = { _id: req.body._id };
  const update = {...req.body};
  Contact.findOneAndUpdate(filter, update, { new: true })
    .then(item => res.json(item))
    .catch(err => res.status(400).json({ unableToUpdate: err}))
})

router.patch("/index/", (req, res) => {
  const filter = { _id: { $in: req.body.updateIds } }
  const update = req.body.updatedItems;
  Contact.updateMany(filter, update, { new: true })
    .then(item => res.json(item))
    .catch(err => res.status(400).json({ unableToUpdate: err }))
})

router.get("/index/", (req, res) => {
  Contact.find()
    .then(items => res.json(items))
    .catch(err => res.status(404).json({ noItemsFound: err }))
});

router.post("/push-config/", (req, res) => {
  Contact.find()
    .then(async items => {
      let ps = new PowerShell({
        executionPolicy: 'Bypass',
        noProfile: true,
      })
      try {
        const pushConfigCommand = PowerShell.command`. ./scripts/pushConfig.ps1 -jsonObject ${JSON.stringify(items)}`;

        await ps.invoke(pushConfigCommand);
      } catch (error) {
        console.error(error);
      } finally {
        await ps.dispose();
      }
      return res.json(items)
    })
    .catch(err => res.status(404).json({ noItemsFound: err }))
});

router.get("/show/:itemId", (req, res) => {
  Contact.findOne({ "_id": `${req.params.itemId}` })
    .then(item => res.json(item))
    .catch(err => res.status(404).json({ noItemsFound: err }))
});

router.delete("/:id", (req, res) => {
  const filter = { "_id": `${req.params.id}` };
  Contact.deleteOne(filter)
    .then(response => { console.log(`Deleted ${response.deletedCount} item.`); res.json(response.deletedCount)})
    .catch(err => console.error(`Delete failed with error: ${err}`))
  return req.params.id
});

module.exports = router