const express = require("express");
const indexwebrouter = require("./Router/index")
const app = express();

const port = 4000;
app.use(express.json())

app.use('/api',indexwebrouter)

// app.get("/",function(res){
//     res.send("Hello connection done")
// })


app.listen(port, function(){
    console.log(`listenig on the Port ${port}`)
})
