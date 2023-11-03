import styles from './Home.module.css'
const Home = () => {
   
    return (
        <div className={styles.pageContainer}>
            
            <section className={styles.hero}>
                <h1>A streamlined invoicing system tailored to the needs of healthcare professionals:</h1>
                <div className={styles.paragraph}>
                   
                    <p>including Personal Support Workers (P.S.W), Developmental Support Workers (D.S.W), and similar professions.</p>
                </div>
                <div className={styles.imgContainer}>
                    <img src="https://res.cloudinary.com/almpo/image/upload/v1637241441/special/banner_izy4xm.png" alt="invoicing-app"/>
                </div>
            </section>
        </div>
    )
}

export default Home