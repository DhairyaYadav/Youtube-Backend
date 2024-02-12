// require('dotenv').config({path:'./env'});
import connectDB from './DB/db.index.js';
import { app } from './app.js';


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000,() => {
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed",err);
})








// import express from 'express';
// const app = express();
// ;( async () => { // starting mein semicolon
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error) => {
//             console.log("ERROR: ",error);
//         })

//         app.listen(process.env.PORT,() => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("ERROR: ",error)
//         throw err
//     }
// })() // iffi approach funtion is called imidiately after declaring