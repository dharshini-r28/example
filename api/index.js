const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const Place = require('./models/Place.js');
const Booking=require('./models/Booking.js')
const fs = require('fs');
const path = require('path');


require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34wdfg';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test ok');
});
function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
            if (err) {
                return reject(err);
            }
            resolve(userData);
        });
    });
}

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            });
        } else {
            res.json('pass not ok');
        }
    } else {
        res.status(422).json('not found');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: path.join(__dirname, '/uploads/', newName),
    });
    res.json(newName);
});


const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path: tempPath, originalname } = req.files[i];
        const ext = path.extname(originalname);
        const newName = path.basename(tempPath) + ext;
        const newPath = path.join(__dirname, '/uploads/', newName);
        fs.renameSync(tempPath, newPath);
        uploadedFiles.push(newName);
    }
    res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title,
            address,
            photos:addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,price,
        });
        res.json(placeDoc);
    });
});
// app.get('/places',(req,res)=>{
//     const { token } = req.cookies;
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }

//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//         if (err) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const { id } = userData;
//         try {
//             const places = await Place.find({ owner: id });
//             res.json(places);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: "Internal Server Error" });
//         }
//     });
// });
app.get('/User-places',(req,res)=>{
    const{token}=req.cookies;
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
        if (err) {
            console.error(err);
            return res.status(401).json({ message: "Unauthorized" });
        }
        const {id}=userData;
        res.json(await Place.find({owner:id}))
    })
})
app.get('/places/:id',async(req,res)=>{
    // res.json(req.params)
    const {id}=req.params;
    res.json(await Place.findById(id))
})
app.get('/places',async(req,res)=>{
    res.json(await Place.find())
})

app.put('/places',async(req,res)=>{
    
    const { token } = req.cookies;
    const { id,title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price } = req.body; 
    
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
        if (err) throw err;
        const placeDoc=await Place.findById(id)
        if(userData.id===placeDoc.owner.toString()){
            console.log({price})
           placeDoc.set({
            owner: userData.id,
            title,
            address,
            photos:addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,price
           })
          await placeDoc.save()
           res.json('ok');
        }
    })
})

app.post('/bookings',async(req,res)=>{
    const userData=await getUserDataFromReq(req)
    const {place,checkIn,checkOut,numberOfGuest,name,phone,price}=req.body;
    Booking.create({
        place,checkIn,checkOut,numberOfGuest,name,phone,price,
        user:userData.id,
    }).then((doc)=>{
        
        res.json(doc);
    }).catch((err)=>{
           throw err;
    })
})


app.get('/bookings',async(req,res)=>{
  const userData= await getUserDataFromReq(req);
  res.json(await Booking.find({user:userData.id}).populate('place'))
})
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
