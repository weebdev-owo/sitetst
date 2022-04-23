import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useRef, useState, useEffect} from 'react'
import styles from '/src/css/home.module.sass'
import Intro from '/src/comp/service/intro'
import Summary from '/src/comp/service/summary'
import Description from '/src/comp/service/description'
import FAQ from '/src/comp/service/faq'
import Book from '/src/comp/book/book'
import ScrollNav from '/src/comp/scrollnav/scrollnav'
import SetBg from '/src/lib/setbg'

const empty_reset = () => () => {console.log('reset not set')}
export default function Service(){
    const elemRef = useRef(null)
    SetBg(elemRef)
    const [reset, setReset] = useState(empty_reset)
    useEffect(() => {reset()},[])
    return <>
        <div className={styles.home}>
            <Intro />
            <ScrollNav setReset={setReset}/>
            <Summary />
            <div ref={elemRef}>
                <Description />
                <FAQ />
                <Book />
            </div>
        </div>
    </>
}



