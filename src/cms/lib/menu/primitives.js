import styles from './menu.module.sass'
import Link from 'next/link'

function Nav({link, children}){
    return <>
        <div className={styles["create-service-cont"]}>
            <Link href={link}>
                <a className={styles["create-service"]}>{children}</a> 
            </Link>     
        </div>
    </>
}

function Title({children}){
    return <>
        <div className={styles['heading']}>{children}</div>
    </>
}

export {Nav, Title}