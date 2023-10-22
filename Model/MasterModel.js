const db = require("../Config/db");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendmail = require("../Config/common")
const salt = 10;
const JWT_SECRET = 'my-secret-app';


var User = function (data) {

}

User.signupDetails = async function (postdata) {
    // console.log("data1", postdata)
    return new Promise(async function (resolve, reject) {
        // var nowDateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        // console.log(nowDateTime);
        let hashedPassword = await bcrypt.hash(postdata.password, 8);
        var insertData = {
            firstname: postdata.firstname ? postdata.firstname : "",
            lastname: postdata.lastname ? postdata.lastname : "",
            email: postdata.email ? postdata.email : "",
            password: hashedPassword ? hashedPassword : "",
            status: postdata.status ? postdata.status : ""
        }
        // console.log("insertdata", insertData)
        var queryinsert = "insert into ps_sign set ?"
        db.query(queryinsert, insertData, function (err, res) {
            if (err) {
                return reject(err)
            } else {
                console.log("res", res)
                return resolve(res)
            }
        })
    })
};

User.login = async function (postdata) {
    return new Promise((resolve, reject) => {
        var queryinsert = "SELECT * FROM ps_sign WHERE email = ?";
        var filter = [postdata.email];
        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                console.log("retry", err);
                return reject(err);
            } else {
                if (res.length === 0) {
                    return resolve(null);
                }
                const userData = res[0];
                bcrypt.compare(
                    postdata.password,
                    userData.password,
                    function (bcryptErr, bcryptRes) {
                        if (bcryptErr) {
                            console.log("bcrypt Error", bcryptErr);
                            return reject(bcryptErr);
                        } else if (bcryptRes) {
                            return resolve(userData);
                        } else {
                            return resolve(null);
                        }
                    });
            }
        });
    });
}

User.sessionToken = async (data) => {
    return new Promise((resolve, reject) => {
        var tokenData = { id: data.id, email: data.email, password: data.password };
        var token = jwt.sign(
            { tokenData },
            "HELLOBHAIKYAHALCHALHAIORSABBADHIYAHAINABHEEDULOG",
            { algorithm: "HS256" }
        );
        data.token = token;
        var queryinsert = `UPDATE ps_sign SET token = ? WHERE id = '${data.id}'`;
        var filter = [data.token];
        console.log(filter, 234567);
        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                console.log("retry", err);
                return reject(err);
            } else {
                return resolve(res);
            }
        });
    })
}

User.verifyEmail = function (postData) {
    return new Promise(function (resolve, reject) {
        var queryinsert = "SELECT email FROM ps_sign WHERE email = ?";
        var filter = [postData.email];
        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                console.log("errr", err);
                return reject(err);
            } else {
                var data = {}
                if (res.length > 0) {
                    data = res[0]
                }
                return resolve(data);
            }
        })
    })
}

User.insertOtp = function (postData) {
    console.log("postdate:-", postData)
    return new Promise(function (resolve, reject) {
        const queryinsert = "UPDATE ps_sign SET otp = ? WHERE email = ?";
        var filter = [postData.otp, postData.email];
        console.log("filter", filter)

        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                return reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

User.verifyOtp = function (postData) {
    return new Promise(function (resolve, reject) {
        const queryinsert = "SELECT password FROM ps_sign WHERE otp = ?";
        var filter = [postData.otp];

        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                return reject(err);
            } else {
                var data = {}
                if (res.length > 0) {
                    data = res[0]
                }
                return resolve(data);
            }
        })
    })
}

User.changePassword = function (postData) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(postData.password, salt, (err, hash) => {
            const queryinsert = "UPDATE ps_sign SET password = ? where otp = ?";
            var filter = [hash, postData.otp];
            console.log(hash);
            db.query(queryinsert, filter, function (err, res) {
                if (err) {
                    return reject(err)
                } else {
                    resolve(res);
                }
            })
        })
    })
}

User.logout = async function (postdata) {
    return new Promise((resolve, reject) => {
        if (!postdata || !postdata.token) {
            return reject("Authorization token is mission");
        }
        // console.log("tokenn---", postdata.token)

        var token = postdata.token;
        var queryinsert = `SELECT * FROM ps_sign WHERE token = ?`;
        console.log(queryinsert)
        var filter = token;

        db.query(queryinsert, [filter], (error, results) => {
            if (error) {
                console.error("Error logging out user:", error);
                return reject(error);
            } else {
                if (results.affectedRows === 0) {
                    return reject("Invaild token or user not found");
                }
                return resolve(results);
            }
        });
    });
}

User.logOutUserData = async function (postdata) {
    return new Promise((resolve, reject) => {
        if (!postdata || !postdata.id) {
            return reject("User ID is missing");
        }
        const userId = postdata.id;
        const queryinsert = "UPDATE ps_sign SET token = NULL WHERE id = ?";
        const filter = [userId];

        db.query(queryinsert, filter, function (err, res) {
            if (err) {
                console.log("Error loggin out user:", err)
                return reject(err);
            } else {
                if (res.affectedRows === 0) {
                    return reject("User not found");
                }
                return resolve({ message: "User logged out successfully.." })
            }
        })
    })
}

// User.passwordChange = async function (postdata) {
//     return new Promise(async (reject, resolve) => {
//         const userEmail = postdata.email;
//         const userPswd = postdata.password;
//         const queryinsert =  "UPDATE ps_sign SET password = ? WHERE email = ?";
//         const hashedPassword = await bcrypt.hash(userPswd, 12);

//         const filter = [hashedPassword, userEmail];
//         db.query(queryinsert, filter, function (err, res) {
//             if (err) {
//                 console.log("Wrong OTP:", err)
//                 return reject(err);
//             } else {
//                 console.log("Resp:", res)
//                 return resolve(res);
//             }
//         });
//     });
// }
// User.getalldetails = async function (postdata, id) {
//     return new Promise(function (resolve, reject) {
//         var queryinsert = `select * from ps_sign where status = ? and id = ?`
//         var filter = [postdata.status, id]
//         db.query(queryinsert, filter, function (err, res) {
//             if (err) {
//                 console.log(" error", err)
//                 return reject(err)
//             } else {
//                 var data = {}
//                 if (res.length > 0) {
//                     data = res[0]
//                 }
//                 return resolve(data)
//             }
//         })
//     })
// }

// User.updateDetails = async function (postdata, id) {
//     console.log("id", id)
//     console.log("postdata:-", postdata)
//     return new Promise(function (resolve, reject) {

//         var updatedValues = {
//             firstname: postdata.firstname ? postdata.firstname : "",
//             lastname: postdata.lastname ? postdata.lastname : "",
//             email: postdata.email ? postdata.email : "",
//             password: postdata.password ? postdata.password : ""
//         }

//         var queryinsert = `update ps_sign set ? where id = ?`
//         var filter = [updatedValues, id]
//         console.log("filter", filter)
//         db.query(queryinsert, filter, function (err, res) {
//             if (err) {
//                 console.log("err", err)
//                 return reject(err)
//             } else {
//                 return resolve(res)
//             }
//         })
//     })
// }

// User.removeuser = async function (postdata) {
//     console.log("postdata:-", postdata)
//     return new Promise(function (resolve, reject) {

//         var queryinsert = `delete from ps_signup set status = "0" where id = ?`
//         var filter = [postdata]
//         console.log("filter", filter)
//         db.query(queryinsert, filter, function (err, res) {
//             if (err) {
//                 console.log("err", err)
//                 return reject(err)
//             } else {
//                 return resolve(res)
//             }
//         })

//     })
// }

module.exports = User
