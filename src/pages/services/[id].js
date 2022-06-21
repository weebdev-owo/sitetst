//frontend
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useRef, useState, useEffect} from 'react'
import Intro from '/src/comp/services/intro'
import Summary from '/src/comp/services/summary'
import Process from '/src/comp/services/process'
import FAQ from '/src/comp/services/faq'
import Book from '/src/comp/book/book'
import ScrollNav from '/src/comp/scrollnav/scrollnav'
import SetBg from '/src/lib/utils/setbg'
//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Service from '/src/cms/data/service/model'

const loreum1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const loreum2 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const loreum3 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

export default function ServicePage({service, failed}){

    //Reset Nav and url
    const empty_reset = () => () => {}
    const [reset, setReset] = useState(empty_reset)
    useEffect(() => {reset()},[])

    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBg(elemRef)

    if(service){
        const intro = {
            title: service.intro.name,
            desc: service.intro.desc,
            img: service.intro.img.url
        }
        
        const summary = {
            imgs: [service.summary.img1.url, service.summary.img2.url, service.summary.img3.url],
            statements: [service.summary.s1,  service.summary.s2, service.summary.s3] ,
            texts: [service.summary.what, service.summary.why]
        }
        
        const process = {
            intro: service.process.intro,
            steps: service.process.steps.map((step)=>[step.name, step.desc]),
            imgs: service.process.steps.map((step)=>step.img.url)
        }
        
        const faq = {
            intro: service.faq.intro,
            questions: service.faq.items.map((item)=>item.question),
            answers: service.faq.items.map((item)=>item.answer),
        }
        
        const book = {
            services: ['loreum ipsum', 'loreum ipsum' , 'loreum ipsum']
        }
        console.log('DOOO DISSSSS:', service, intro)

        return <>
            <div className='page'>
                <Intro title={intro.title} desc={intro.desc} img={intro.img}/>
                <ScrollNav setReset={setReset}/>
                <Summary imgs={summary.imgs} statements={summary.statements} texts={summary.texts}/>
                <div ref={elemRef}>
                    <Process steps={process.steps} imgs={process.imgs} intro={process.intro}/>
                    <FAQ intro={faq.intro} questions={faq.questions} answers={faq.answers} />
                    {/* <Book services={book.services}/> */}
                </div>
            </div>

        </>
    }
    if(failed){
        return <>
            <div>DOES NOT EXIST</div>
        </>
    }
    return <>
        <div>LOADING</div>
    </>
    
}

ServicePage.defaultProps = {
    service: false,
    failed: false
}

export async function getStaticProps(context){
const id = context.params.id
  let services = []
  let data = false
  try {
        const connection = await dbConnect()
        data = await Service.find()
            .select(['data.service'])
            .where('data.url').eq(id)
        if (data.length !== 1){throw 'Invalid number of objects matching this id'}
        // console.log('inside static props', data[0].data.service)
        return {
            props: {
                service: JSON.parse(JSON.stringify(data[0].data.service)),
                failed: true
            }
        }
  } 
  catch (error) {
        console.log('inside static props error', error)
        return {
            props: {
                service: false,
                failed: true
            }
        }
  }
}

export async function getStaticPaths() {
    let services = []
    let data = false
    try {
        const connection = await dbConnect()
        data = await Service.find()
            .select(['data.url'])
        services = data.map((service, i) => {
            return {
                params: {id: service.data.url}
            }
        })
        // console.log('inside static paths', services, JSON.parse(JSON.stringify(services)))
        return {
            paths: JSON.parse(JSON.stringify(services)),
            fallback: true
        }
  } 
  catch (error) {
        console.log('inside static paths error', error)
        return {
            paths: JSON.parse(JSON.stringify([])),
            fallback: true
        }
  }
}

