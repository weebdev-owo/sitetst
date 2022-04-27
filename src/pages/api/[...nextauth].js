import NextAuth from "next-auth/next";
import Providers from 'next-auth/providers'

export default NextAuth({
    database: process.env.DB_URL, 
    seesion: {
        jwt: true
    },
    jwt: {
        secret: 'veuribuidrbgwi4rbi5eug'
    }
})