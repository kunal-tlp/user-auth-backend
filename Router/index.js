const express = require("express")
const router = express.Router()
const masterController = require('../Controller/MasterController')


router.post('/signupDetails', masterController.signupDetails)

router.get('/getalldetails/:id', masterController.getalldetails)

router.post('/updateDetails/:id', masterController.updateDetails)

router.post("/removeuser/:id", masterController.removeuser)





module.exports = router
