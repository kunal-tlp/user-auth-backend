const express = require("express")
const router = express.Router()
const masterController = require('../Controller/MasterController')


router.post('/signupDetails', masterController.signupDetails)

router.post('/login', masterController.login);

// router.post('/change-password', masterController.changePassword);
router.post('/resetPassword', masterController.resetPassword);

router.post('/verifyOtp', masterController.verifyOtp);

router.post('/log-out', masterController.logOutData);

// router.get('/getalldetails/:id', masterController.getalldetails)

// router.post('/updateDetails/:id', masterController.updateDetails)

// router.post("/removeuser/:id", masterController.removeuser)





module.exports = router
