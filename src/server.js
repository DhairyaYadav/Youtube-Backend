// require('dotenv').config({path:'./env'});
import connectDB from './DB/db.index.js';


connectDB();








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