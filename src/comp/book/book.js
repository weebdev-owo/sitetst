import {memo} from 'react'
import styles from './book.module.sass'

const services = ["loreum ipsum", "loreum ipsum", "loreum ipsum", "loreum ipsum"]

function Book({services}){

    const addBooking = event => {
        event.preventDefault() 
    }

    return <>
        <div id={'Book'} className={styles["booking"]}>
            <div className={styles["heading"]}>.Book.</div>

            <form className={styles["form"]} onSubmit={addBooking}>

                <div className={styles["section"]}>
                    <select id="services" className={styles["select"]} name="services">
                        <option value="service" selected disabled hidden className={styles['option']}>{'service'}</option>
                        {services.map((service, i) => {return <option value={service} className={styles['option']} key={i}>{service}</option>})}
                    </select>
                </div>

                <div className={styles["section"]}>
                    <label className={styles["label"]} htmlFor="date">Date</label>
                    <input id="date" className={styles["input"]} type="datetime-local"  min="2022-01-01" max="2023-12-31" required/>
                </div>

                <div className={styles["section"]}>
                    <label className={styles["label"]} htmlFor="name">Name</label>
                    <input id="name" className={styles["input"]} type="text" required />       
                </div>

                <div className={styles["section"]}>
                    <label className={styles["label"]} htmlFor="email">Email</label>
                    <input id="email" className={styles["input"]} type="email" required />    
                </div>

                <div className={styles["section"]}>
                    <label className={styles["label"]} htmlFor="tel">Mobile Number</label>
                    <input id="tel" className={styles["input"]} type="tel" required />    
                </div>

                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>.Submit.</button>   
                </div>

            </form>
        </div>

    </>
}

Book = memo(Book)
Book.defaultProps = {
    services: services
}
export default Book