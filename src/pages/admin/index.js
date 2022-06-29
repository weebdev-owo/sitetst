//frontend
import {useState, useRef, useEffect} from 'react'
import styles from '/src/cms/lib/menu/menu.module.sass'
import {setBgCol} from '/src/lib/utils/setbg'
import Link from 'next/link'
import Table from '/src/cms/lib/menu/table'
import {Title, Nav} from '/src/cms/lib/menu/primitives'

function AdminHome({}){

    //Change body background and scroll when ref onscreen
    useEffect(() =>{setBgCol(false)}, [])

    return <>
        <div className={styles['home']} >
            <Home />
            <Services />
            <About />
        </div>
    </>
}

function Home({}){
    return <>
        <Title>Home</Title>
        <Table 
            layout={[
                ['title', 'title'],
                ['Order', 'order'],
                ['Enabled', 'enabled'],
            ]}
            options={{
                'title': 'Landing Slides',
                'model_path': 'home/landing',
                'id_path': 'order',
                'edit': ['/admin/home/landing/edit/', 'use id'],
                'view': ['/'],
                'order': 'order',
            }}
        />
        <Nav link={'/admin/home/landing/create'}>Create Slide</Nav>
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
                ['Name', 'services.tile.name'],
                ['Enabled', 'enabled'],
                ['Booking', 'booking'],
            ]}
            options={{
                'model_path': 'services',
                'id_path': 'url',
                'edit': ['/admin', '/services', '/edit/', 'use id'],
                'view': ['/services/', 'use id'],
                'order': 'services.tile.order',
            }}
        />
        <Nav link={'/admin/services/create'}>Create New Service</Nav>
        
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