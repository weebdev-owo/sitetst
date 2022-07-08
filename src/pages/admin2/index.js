//frontend
import {useState, useRef, useEffect} from 'react'
import styles from '/src/cms/lib/menu/menu.module.sass'
import {setBgCol} from '/src/lib/utils/setbg'
import Link from 'next/link'
import Table from '/src/cms/lib/menu/table'
import {Title, Nav} from '/src/cms/lib/menu/primitives'
import  TabNav  from '/src/comp/tabnav/tabnav';

function AdminHome({}){

    //Change body background and scroll when ref onscreen
    useEffect(() =>{setBgCol(false)}, [])

    return <>
        <div className={styles['home']} >
            <TabNav>
                <Home label={'Home'}/>
                <Services label={'Services'}/>
                <About label={'About'}/>
                <News label={'News'}/>
                <Book label={'Book'}/>
            </TabNav>
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
                'model_path': 'home_landing',
                'id_path': 'order',
                'edit': ['/admin/home/landing/edit/', 'use id'],
                'view': ['/'],
                'order': 'order',
            }}
        />
        <Nav link={'/admin/home/landing/create'}>Create New Slide</Nav>
        <Table 
            layout={[
                ['Url Name', 'url'],
                ['Order', 'home.tile.order'],
                ['Enabled', 'enabled'],
                ['Home', 'home.tile.enabled'],
            ]}
            options={{
                'title': 'Services',
                'model_path': 'service',
                'id_path': 'url',
                'edit': ['/admin/service/edit/', 'use id'],
                'view': ['/service/', 'use id'],
                'order': 'home.tile.order',
            }}
        />
        <Nav link={'/admin/service/create'}>Create New Service</Nav>
    </>
}

//url, enabled, booking
function Services({}){
    return <>
        <Title>Services</Title>
        <Nav link={'/admin/PageData/services/intro'}>Edit Intro</Nav>
        <Table 
            layout={[
                ['Url Name', 'url'],
                ['Order', 'services.tile.order'],
                ['Enabled', 'enabled'],
                ['Booking', 'booking'],
            ]}
            options={{
                'title': 'Services',
                'model_path': 'service',
                'id_path': 'url',
                'edit': ['/admin', '/service', '/edit/', 'use id'],
                'view': ['/service/', 'use id'],
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

function News({}){
    return <>
    
    </>
}

function Book({}){
    return <>
    
    </>
}

export default AdminHome