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


export default function Home(){

  //Reset Nav and url
  const empty_reset = () => () => {}
  const [reset, setReset] = useState(empty_reset)
  useEffect(() => {reset()},[])

  return <>
    <div className={styles.home}>
      <TopBar />
      <Car>{carousel.imgs.map((img, i) =>{return <CarImage img={img} key={i}/>})}</Car>
      <Counters />
      <Services services={services.items} />
      <About />
      <Book services={book.services} />
      <ScrollNav setReset={setReset} />
    </div>
  </>
}

//CONTENT
const carousel = {
  imgs: ["/car2.jpg", "/car1.jpg"]
}

const services = {
  items: [
    ['Service-1', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-2', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-3', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-4', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-5', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-6', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-7', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-8', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-9', 'Description', "/dnt1.jpg", 'inai', '/services'],
  ]
}

const book = {
  services: ['loreum ipsum', 'loreum ipsum' , 'loreum ipsum']
}
