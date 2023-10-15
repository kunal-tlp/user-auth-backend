const db = require("../Config/db")
const mastermodel = require("../Model/MasterModel")

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

exports.getalldetails = async function (req, res) {
    try {
        db.beginTransaction()
        var details = mastermodel.getalldetails(req.body, req.params.id)
        if (details.length > 0) {
            db.commit()
            res.status(200).json({ message: "success", Data: details })
        }
        else {
            db.rollback()
            res.status(404).json({ message: "Error in getting task details" })
        }
    } catch (error) {
        db.rollback()
        res.status(500).json({ message: "rollback error" })
    }
}

exports.updateDetails = async function (req, res) {
    try {
        db.beginTransaction()
        const id = req.params.id
        var update = await mastermodel.updateDetails(req.body, id)
        if (update.affectedRows) {
            db.commit()
            res.status(200).json({ message: "detail has been updated", Data: req.body })
        } else {
            db.rollback()
            res.status(404).json({ message: "Error in updating details" })
        }
    } catch (error) {
        db.rollback()
        res.status(500).json({ message: "rollback error" })
    }
}

exports.removeuser = async function (req, res) {
    try {
        db.beginTransaction()

        var inactive = await mastermodel.removeuser(req.params.id)
        if (inactive.affectedRows) {
            db.commit()
            res.status(200).json({ message: "user is inactive" })
        } else {
            db.rollback()
            res.status(404).json({ message: "Error is getting task details" })
        }
    } catch (error) {
        db.rollback()
        res.status(500).json({ message: "rollback error" })
    }
}
