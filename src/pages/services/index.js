import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useRef, useState, useEffect} from 'react'
import styles from '/src/styles/home.module.sass'
import Intro from '/src/comp/services/intro'
import Summary from '/src/comp/services/summary'
import Process from '/src/comp/services/process'
import FAQ from '/src/comp/services/faq'
import Book from '/src/comp/book/book'
import ScrollNav from '/src/comp/scrollnav/scrollnav'
import SetBg from '/src/lib/utils/setbg'

const loreum1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const loreum2 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const loreum3 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

export default function Service(){

    //Reset Nav and url
    const empty_reset = () => () => {}
    const [reset, setReset] = useState(empty_reset)
    useEffect(() => {reset()},[])

    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBg(elemRef)

    return <>
        <div className={styles.home}>
            <Intro title={intro.title} desc={intro.desc} img={intro.img}/>
            <ScrollNav setReset={setReset}/>
            <Summary imgs={summary.imgs} statements={summary.statements} texts={summary.texts}/>
            <div ref={elemRef}>
                <Process steps={process.steps} imgs={process.imgs} intro={process.intro}/>
                <FAQ intro={faq.intro} questions={faq.questions} answers={faq.answers} />
                <Book services={book.services}/>
            </div>
        </div>
    </>
}

//CONTENT
const intro = {
    title: "Service",
    desc: loreum1,
    img: "/nani.png"
}

const summary = {
    imgs: ['/tree.png', '/tree.png', '/tree.png'],
    statements: ['Lorem ipsum.',  'Dolor sit.', 'Amet consectetur.'] ,
    texts: [`[what is service] ${loreum1}`, `[why service] ${loreum1}`]
}

const process = {
    intro: loreum1,
    steps: [['Step Name', loreum1], ['Step Name', loreum1], ['Step Name', loreum1]],
    imgs: ['/tree.png', '/tree.png', '/tree.png']
}

const faq = {
    intro: loreum1,
    questions: [loreum2, loreum2, loreum2, loreum2, loreum2],
    answers: [loreum3, loreum3, loreum3, loreum3, loreum3]
}

const book = {
    services: ['loreum ipsum', 'loreum ipsum' , 'loreum ipsum']
}
