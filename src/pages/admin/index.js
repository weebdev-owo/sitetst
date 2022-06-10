import {useState, useRef} from 'react'
import styles from '/src/styles/admin/home.module.sass'
import {SetBgInv} from '/src/lib/utils/setbg'
import Link from 'next/link'

function AdminHome({services}){

    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBgInv(elemRef)

    return <>
        <div className={styles['home']} ref={elemRef}>
            <Home />
            <Services services={services}/>
            <About />
        </div>
    </>
}

function Home({}){
    return <>
    <div className={styles['heading']}>Home</div>
    <div className={styles["create-service-cont"]}>
        <Link href={'http://localhost:3000/admin/home'}>
            <a className={styles["create-service"]}>Edit Intro</a> 
        </Link>     
    </div>
    </>
}

//url, enabled, booking
function Services({services}){
    console.log('inside component', services)
    return <>
        <div className={styles['heading']}>Services</div>
        <div className={styles['services-table']}>
            <div className={styles['services-table-item']}>Url Name</div>
            <div className={styles['services-table-item']}>Order</div>
            <div className={styles['services-table-item']}>Enabled</div>
            <div className={styles['services-table-item']}>Booking</div>
            <div className={styles['services-table-item']}>Edit</div>
            <div className={styles['services-table-item']}>View</div>

            {services.map((service, i) => 
                <>
                    <div className={styles['services-table-item']} >{`${service.url}`}</div>
                    <div className={styles['services-table-item']} >{service['services']['tile']['order']}</div>
                    {service.enabled ? <Tick />:<Cross />}
                    {service.booking ? <Tick />:<Cross />}
                    <Link href={`http://localhost:3000/admin/services/${service.url}`}>
                        <a className={styles['services-table-item']}>✎</a> 
                    </Link>  
                    <Link href={`http://localhost:3000/services/${service.url}`}>
                        <a className={styles['services-table-item']}>→</a> 
                    </Link>     

                    {/* <a className={styles['services-table-item']} >→</a> */}

                </>
            )}
        </div>
        <div className={styles["create-service-cont"]}>
            <Link href={'http://localhost:3000/admin/services/create'}>
                <a className={styles["create-service"]}>Create New Service</a> 
            </Link>     
        </div>
        
    </>
}

function Tick(){
    return <>
        <div className={styles['services-table-item']+' '+styles['tick']}>✔</div>
    </>
}

function Cross(){
    return <>
        <div className={styles['services-table-item']+' '+styles['cross']}>✗</div>
    </>
}

function About(){
    return <>
        <div className={styles['heading']}>About</div>
        <div className={styles["create-service-cont"]}>
            <Link href={'http://localhost:3000/admin/about/locations'}>
                <a className={styles["create-service"]}>Edit Locations</a> 
            </Link>     
        </div>
        <div className={styles["create-service-cont"]}>
            <Link href={'http://localhost:3000/admin/about/team'}>
                <a className={styles["create-service"]}>Edit Team</a> 
            </Link>     
        </div>
    </>
}

import dbConnect from '/src/lib/api/db/mongoose_connect'
import Service from '/src/lib/api/db/models/service'

export async function getStaticProps(context) {
    let services = []
    let data = false
    try {
        const connection = await dbConnect()
        data = await Service.find()
            .select(['data.url', 'data.enabled', 'data.booking', 'data.services.tile.order'])
            .sort({'data.services.tile.order':1})
        services = data.map((service, i) => service.data)
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

  export default AdminHome