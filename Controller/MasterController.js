const db = require("../Config/db")
const mastermodel = require("../Model/MasterModel");
const Mail = require("../Config/common")
require("dotenv").config({ path: "./.env" });
const otpGenerator = require('otp-generator')

exports.signupDetails = async function (req, res) {
    try {
        db.beginTransaction()
        var details = await mastermodel.signupDetails(req.body)
        if (details) {
            db.commit()
            res.status(200).json({ message: "Data inserted successfully", Data: req.body })
        }
        else {
            db.rollback()
            res.status(404).json({ message: "Error in inserted task details" })
        }
    } catch (error) {
        db.rollback()
        res.status(500).json({ message: "rollback error" })
    }
}

exports.login = async function (req, res) {
    try {
        db.beginTransaction();
        var loginData = await mastermodel.login(req.body)

        if (loginData != undefined) {
            var generateToken = mastermodel.sessionToken(loginData);
            // console.log(generateToken, "dfghjkl");
            db.commit();
            res.json({ message: "User Login Successfull", UserData: loginData })
        } else {
            db.rollback();
            res.status(401).json({ error: "Data Error" })
        }
    } catch (error) {
        db.rollback();
        res.status(401).json({ error: "Data Error" })
    }
}

exports.resetPassword = async function (req, res) {
    try {
        db.beginTransaction();
        var verifyUser = await mastermodel.verifyEmail(req.body);

        if (verifyUser.email) {
            const otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false, digits: true, lowerCaseAlphabets: false
            });
            req.body.otp = otp;
            var insertOtp = await mastermodel.insertOtp(req.body);
            console.log("insertOtp", insertOtp);
            if (insertOtp.affectedRows) {
                db.commit();
                const sendEmail = await Mail(req.body.email, "OTP verification", req.body.otp);
                console.log(sendEmail);
                res.status(200).json({ message: "success", data: req.body })
            } else {
                res.status(200).json({ message: "Failed" })
            }
            //    console.log(insertOtp);
            // res.status(200).json({message : ""})
        } else {
            res.status(200).json({ message: "Incorrect email id" });
        }


    } catch (e) {
        db.rollback();
        console.log("error", e);
    }
};

exports.verifyOtp = async function (req, res) {
    try {
        db.beginTransaction();
        var verifyOtp = await mastermodel.verifyOtp(req.body);
        if (verifyOtp.password) {
            var password = Math.random().toString(36).slice(-8);
            req.body.password = password;
            var changePassword = await mastermodel.changePassword(req.body);
            if (changePassword.affectedRows) {
                res.status(200).json({ message: "Your new passwprd", password: password });
            }
        } else {
            res.status(200).json({ message: "Otp is inCorrect" });
        }
    } catch (e) {
        db.rollback();
        res.status(200).json({ message: e });
        console.log("error", e);
    }
}

exports.logOutData = async (req, res) => {
    try {
        db.beginTransaction();
        var loginData = await mastermodel.logout(req.headers);
        const loginDataValue = loginData[0];

        if (loginDataValue) {
            var logoutUser = await mastermodel.logOutUserData(loginDataValue);
            db.commit();
            res.status(200).json({ message: "User Successfull", logoutUser })
        } else {
            db.rollback();
            res.status(401).json({ Data: "Data Errorrss" })

        }
    } catch (error) {
        db.rollback();
        res.status(500).json({ error: "Data Error" });
    }
}

// exports.changePassword = async (req, res) => {
//     try {
//         db.beginTransaction();
//         var changePswd = await mastermodel.passwordChange(req.body);
//         if (changePswd) {
//             db.commit();
//             res.send(200).json({ message: "Password change has been successfully" })
//         } else {
//             db.rollback();
//             res.send(401).json({ message: "Email is not found:" })
//         }
//     } catch (error) {
//         db.rollback();
//         res.send().json({ message: "Data Error" })
//     }
// }

// exports.getalldetails = async function (req, res) {
//     try {
//         db.beginTransaction()
//         var details = mastermodel.getalldetails(req.body, req.params.id)
//         if (details.length > 0) {
//             db.commit()
//             res.status(200).json({ message: "success", Data: details })
//         }
//         else {
//             db.rollback()
//             res.status(404).json({ message: "Error in getting task details" })
//         }
//     } catch (error) {
//         db.rollback()
//         res.status(500).json({ message: "rollback error" })
//     }
// }

// exports.updateDetails = async function (req, res) {
//     try {
//         db.beginTransaction()
//         const id = req.params.id
//         var update = await mastermodel.updateDetails(req.body, id)
//         if (update.affectedRows) {
//             db.commit()
//             res.status(200).json({ message: "detail has been updated", Data: req.body })
//         } else {
//             db.rollback()
//             res.status(404).json({ message: "Error in updating details" })
//         }
//     } catch (error) {
//         db.rollback()
//         res.status(500).json({ message: "rollback error" })
//     }
// }

// exports.removeuser = async function (req, res) {
//     try {
//         db.beginTransaction()

//         var inactive = await mastermodel.removeuser(req.params.id)
//         if (inactive.affectedRows) {
//             db.commit()
//             res.status(200).json({ message: "user is inactive" })
//         } else {
//             db.rollback()
//             res.status(404).json({ message: "Error is getting task details" })
//         }
//     } catch (error) {
//         db.rollback()
//         res.status(500).json({ message: "rollback error" })
//     }
// }
