import dotenv from 'dotenv';
import app from './app.js';
import { connect } from './db/connect.js';

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 8000; 

// console.log(process.env.MONGOURI);

connect()
.then(() => {
        app.listen(port , () =>{
            console.log(`Server Listening at PORT : ${port}`)
        })
    }
).catch((err) => {
    console.log(`Mongo Connection failed : `, err)
})

