//frontend
import Head from 'next/head'
import {useState, useRef, useEffect} from 'react'
import TopBar from '/src/comp/topbar/topbar'
import Car from '/src/comp/home/carousel/small_car'
import CarImage from "/src/comp/home/carousel/carimage"
import Counters from '/src/comp/home/counters/counters'
import Services from '/src/comp/home/services/services'
import About from '/src/comp/home/about/about'
import Book from '/src/comp/book/book'
import ScrollNav from '/src/comp/scrollnav/scrollnav'
import { setBgCol } from '/src/lib/utils/setbg'
//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Service from '/src/cms/data/services/model'

export default function Home({services}){
  //Reset Nav and url
  const empty_reset = () => () => {}
  const [reset, setReset] = useState(empty_reset)
    useEffect(() => {
        reset()
        setBgCol(true)
    },[])

  const service_tiles = services.map((service) =>{
    return [service.name, service.desc, service.img.url, service.img.alt, `http://localhost:3000/services/${service.url}`]
  })
  
    return <>
        <div className={'page'}>
            <TopBar />
            <ScrollNav setReset={setReset} />
            <Car>{carousel.imgs.map((img, i) =>{return <CarImage img={img} key={i}/>})}</Car>
            <Counters />
            <Services services={service_tiles} />
            <About />
            <Book services={book.services} />
        </div>
    </>
}

//CONTENT
const carousel = {
  // imgs: ["/car2.jpg", "/car1.jpg"]
  imgs: ["/tree.png", "/nani.png"]
}

const book = {
  services: ['loreum ipsum', 'loreum ipsum' , 'loreum ipsum']
}

export async function getStaticProps(){
  let services = []
  let data = false
  try {
      const connection = await dbConnect()
      data = await Service.find()
          .select(['data.url', 'data.enabled', 'data.services.tile'])
          .where('data.enabled').eq(true)
          .sort({'data.services.tile.order':1})
      services = data.map((service, i) => {
          return {...service.data.services.tile, url: service.data.url}
      })
      // console.log('inside static props', services, JSON.parse(JSON.stringify(services)))
      return {
          props: {
              services: JSON.parse(JSON.stringify(services))
          }
      }
  } 
  catch (error) {
      console.log('inside static props error', error)
      return {notFound: true}
  }
}

