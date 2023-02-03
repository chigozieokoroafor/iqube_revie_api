const express = require("express");
//const Joi = require("joi");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config()

app.use(express.json()) // this tells express to parse as json
app.use(cors())

let jwtKey = process.env.JWT_SECRET_KEY

const users = [
    {user_id:1,
    email:"okoroaforc14@gmail.com",
    password:"password",
    username: "chigozie"}
]

const Apartment = [
    
]

const Landlord = [
    
]

app.get('/', (req, res) => {
    res.send(Apartment)
});




app.get("/api/reviews/apartment/:id", (req, res) => {
    const appartment_review = Apartment.find(i => i.id === parseInt(req.params.id));
    if (!appartment_review){
        res.status(404).send({
            "message":"review not available"
        })
    } else {
        const landlord_review = Landlord.find(i => i.apartment_id === parseInt(req.params.id))
        appartment_review.landlord_review = landlord_review || {}
        res.status(200).send(appartment_review)
    }
})

app.post("/api/upload/landlord_review/:apartment_id", (req, res) => {
    //console.log(req.body)
    //console.log(typeof(req.body.name))
    if (!token){
        res.status(400).send({message:"jwt key missing", success:false})
    } // create a token expiry check here

    else {
        jwt.verify(token, jwtKey, (error, decoded) => {
            if(error){
                res.send(error).status(400)
            } else {
                const appartment_review = Apartment.find(i => i.ar_id === parseInt(req.params.apartment_id));
                if (!appartment_review){
                    res.status(404).send({
                        "message":"apartment with apartment_id passed not available"
                    })
                } 
                else{    
                    if (!req.body.name){
                        res.status(400).send({message:"name is requred", success:false});
                    }else if (!req.body.scale){
                        res.status(400).send({message:"scale is required", success:false});
                    }else if (!req.body.review){
                        res.status(400).send({message:"review is required", success:false});
                    } 

                    const rev = {
                        lr_id : Landlord.length + 1,
                        scale : req.body.scale,
                        review : req.body.review,
                        name : req.body.name,
                        apartment_id:parseInt(req.params.apartment_id),
                        timestamp: Date.now()
                    }
                    Landlord.push(rev)
                    
                    res.status(200).send({message:"landlord review updated", success:true})
                }
            }
        })
    }
        
})

app.post("/api/upload/apartment_review", (req, res) => {
    //var check = false;
    const token =  req.headers.jwt;

    if (!token){
        res.status(400).send({message:"jwt key missing", success:false})
    } // create a token expiry check here

    else {
        jwt.verify(token, jwtKey, (error, decoded) => {
            if(error){
                res.send(error).status(400)
            } else {
                if (!req.body.address){
                    res.status(400).send({message:"address is requred", success:false}); //.header({"Content-Type":"application/json"});
                }         
                else if (!req.body.scale){
                    res.status(400).send({message:"scale is required", success:false});
                }
                else if (!req.body.review){
                    res.status(400).send({message:"review is required", success:false});
                } 
        
        
                rev = {
                    ar_id : Apartment.length + 1,
                    url : req.body.url || "",
                    url_type: req.body.url_type || "",
                    address : req.body.address,
                    scale : req.body.scale,
                    timestamp : Date.now(),
                    review : req.body.review
                }
        
                Apartment.push (rev);
                res.status(200).send({message:"review added", success:true});
            }
        })
        //console.log(check)
        
        /* else {
            res.status(400).send({message:'invalid token', success:false});
        }*/
    }
    
    
})

app.post("/signup", (req, res) => {
    email = req.body.email
    password = req.body.password
    username = req.body.name
    console.log(password == undefined)
    if (typeof(email) != "string" || email == undefined ){
        res.status(400).send({message: "email is meant to be a string", success:false})
    } else if (email.includes(".com") != true ){
        res.status(400).send({message:"invalid email", success:false})
    }
    const user = users.find(i => i.email == email);
    if (!user){
        if (password == undefined || password.length < 8) {
            res.status(400).send({message:"password must not be less than 8 characters", success:false})
        }

        acc = {
            email:email,
            password:password,
            username:username,
            id : users.length + 1
        }

        users.push(acc)
        res.status(200).send({message:"account created", success:true})
    } else {
        res.status(400).send({message:"user with email exists", success:false})
    }



    //if (email.includes("@gmail.com") || email.includes("@yahoo.com"))

})


app.post("/signin", (req, res) => {
    const email =  req.body.email
    const password = req.body.password

    const user = users.find(i => i.email === email)
    if (!user){
        res.status(404).send({message:"user not found", success:false})
    }

    if (password != user.password){
        res.status(400).send({message:"incorrect password", success: false})
    }

    
    let data = {
        exp : Math.floor(Date.now() / 1000) + (10 * 60),
        id: user.id
    }
    const token = jwt.sign(data, jwtKey)
    res.status(200).send({token:token, success:true})
})

app.get("/getUsers", (req, res) => {
    res.status(200).send(users)
})

let PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})