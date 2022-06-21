//frontend
import {useState, useRef} from 'react'
import styles from '/src/cms/lib/menu/menu.module.sass'
import {SetBgInv} from '/src/lib/utils/setbg'
import Link from 'next/link'
import Table from '/src/cms/lib/menu/table'
import {Title, Nav} from '/src/cms/lib/menu/primitives'

function AdminHome({}){

    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBgInv(elemRef)

    return <>
        <div className={styles['home']} ref={elemRef}>
            <Home />
            <Services />
            <About />
        </div>
    </>
}

function Home({}){
    return <>
        <Title>Home</Title>
        <Nav link={'/admin/home'}>Edit Intro</Nav>
    </>
}

//url, enabled, booking
function Services({}){
    return <>
        <Title>Services</Title>
        <Table 
            layout={[
                ['Url Name', 'url'],
                ['Order', 'services.tile.order'],
                ['Enabled', 'enabled'],
                ['Booking', 'booking'],
            ]}
            options={{
                'model_path': 'service',
                'id_path': 'url',
                'edit': ['/admin', '/service', '/edit/', 'use id'],
                'view': ['/services/', 'use id'],
                'order': 'services.tile.order',
            }}
        />
        <Nav link={'/admin/service/create'}>Create New Service</Nav>
        
    </>
}



function About(){
    return <>
        <Title>About</Title>
        <Nav link={'/admin/about/edit-intro'}>Edit Intro</Nav>
        <Nav link={'/admin/about/edit-locations'}>Edit Locations</Nav>
        <Nav link={'/admin/about/edit-team'}>Edit Team</Nav>
    </>
}

export default AdminHome