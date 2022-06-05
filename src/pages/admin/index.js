import {useState, useRef} from 'react'
import styles from '/src/styles/admin/home.module.sass'
import {SetBgInv} from '/src/lib/utils/setbg'


function AdminHome({services}){

    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBgInv(elemRef)

    return <>
        <div className={styles['home']} ref={elemRef}>
            <div className={styles['heading']}>Home</div>
            <Services services={services}/>
        </div>
    </>
}

//url, enabled, booking
function Services({services}){
    console.log('inside component', services)
    return <>
        <div className={styles['heading']}>Services</div>
        <div className={styles['services-table']}>
            <div className={styles['services-table-headings']}>
                <div className={styles['services-table-row-start']}>service url</div>
                <div className={styles['services-table-row-item']}>enabled</div>
                <div className={styles['services-table-row-start']}>booking</div>
                <div className={styles['services-table-row-end']}>Edit</div>
            </div>
            {services.map((service, i) => 
                <div className={styles['services-table-row']} key={i} >
                    <div className={styles['services-table-row-start']}>{`${service.url}`}</div>
                    <div className={styles['services-table-row-item']}>{`${service.enabled}`}</div>
                    <div className={styles['services-table-row-start']}>{`${service.booking}`}</div>
                    <div className={styles['services-table-row-end']}>Edit</div>
                </div>
            )}
        </div>
        
    </>
}

import dbConnect from '/src/lib/api/db/mongoose_connect'
import Service from '/src/lib/api/db/models/service'
import axios from 'axios'

export async function getStaticProps(context) {
    let services = []
    let data = false
    try {
        const connection = await dbConnect()
        data = await Service.find().select(['data.url', 'data.enabled', 'data.booking'])
        services = data.map((service, i) => {
            return service.data
        })
        console.log('inside static props', typeof services, typeof JSON.parse(JSON.stringify(services)))
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