import styles from './Home.module.css'
import { Link } from 'react-router-dom'
import  Button  from '@mui/material/Button'
const Home = () => {
   
    return (
        <div className={styles.pageContainer}>
            
            <section className={styles.hero}>
                <h1>A streamlined invoicing system tailored to the needs of healthcare professionals:</h1>
                <div className={styles.paragraph}>
                   
                    <p>including Personal Support Workers (P.S.W), Developmental Support Workers (D.S.W), and similar professions.</p>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    MarginTop: '2rem',
                
                }}>
                    <Button variant="contained" color="primary" size="large" component={Link} to="/signup">Get Started</Button>
                </div>
            </section>
        </div>
    )
}

export default Home