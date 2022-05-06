import LogoBar from "./logobar"
import NavBar from "./navbar"
import { useState } from "react"
import styles from './topbar.module.sass'

export default function TopBar(){
    const [selectedNav, setSelectedNav] = useState(null)
    return <div className={styles.topbar}>
        <LogoBar />
        <NavBar selected={selectedNav} setSelected={setSelectedNav}/>
    </div>
}