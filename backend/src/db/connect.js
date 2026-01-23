import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js';

const connect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGOURI}/${DB_NAME}`);
        console.log(`Mongo Connected Successfully. \ndatavase Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Mongo Connection Failed.`);
        process.exit(1);
    }
}

export { connect }