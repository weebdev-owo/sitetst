import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useState, useRef, useEffect} from 'react'
import TopBar from '/src/comp/topbar/topbar'
import Car from '/src/comp/carousel/small_car'
import CarImage from "/src/comp/carousel/carimage"
import styles from '/src/css/home.module.sass'
import Counters from '../comp/counters/counters'
import Services from '../comp/services/services'
import About from '../comp/about/about'
import FadeUp from '/src/lib/fadeup'
import Book from '/src/comp/book/book'
import ScrollNav from '/src/comp/scrollnav/scrollnav'

const imgs = ["/car2.jpg", "/car1.jpg"]
const empty_reset = () => () => {}
export default function Home(){
  const [reset, setReset] = useState(empty_reset)
  useEffect(() => {reset()},[reset])
  return <>
    <div className={styles.home}>
      <TopBar />
      <Car >
        {imgs.map((img, i) =>{return <CarImage img={img} key={i}/>})}
      </Car>
      <Counters />
      <Services />
      <About />
      <Book />
      <ScrollNav setReset={setReset}/>
    </div>
  </>
}

