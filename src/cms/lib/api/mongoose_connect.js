import mongoose from 'mongoose'

const MONGODB_URI = process.env.CONTENT_DB_URI



/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect () {
    const MONGODB_URI = process.env.CONTENT_DB_URI

    if (!MONGODB_URI) {throw new Error('Please define the MONGODB_URI environment variable inside .env.local')}
    
    if (cached.conn) {return cached.conn}

    if (!cached.promise) {
        cached.promise = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
        })
    }

    try{
        cached.conn = await cached.promise
        return cached.conn
    }
    catch (error){
        cached.conn = false
        throw error
    }
}

async function dbConnectCms(){
    try{
        return await dbConnect()
    }
    catch (error){
        const formated_error = {
            errors: [
                {properties: {reason: 'ServerConnection', message: error.message}}
            ]
        }
        throw formated_error
    }
}

export default dbConnectCms
