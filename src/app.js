import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

//configure cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

// alag alag jagah se data accept
app.use(express.json({limit:"20kb"})); //json data ko accept
app.use(express.urlencoded({extended:true,limit:"16kb"})); //url data ko accept
app.use(express.static("public")); //assets jaise img  ko accept p.s public foder ka naam h jo hamne banaya tha starting mein

//configure cookies
app.use(cookieParser());

export { app }