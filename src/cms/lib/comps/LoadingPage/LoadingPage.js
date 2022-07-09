import styles from './LoadingPage.module.sass'
import Spinner from '/src/cms/lib/comps/spinner/spinner'

function LoadingPage({content}){
    return <>
        <div className={styles['loading-initial-data-cont']}>
            <div className={styles['loading-initial-data']}>
                <p>{content}</p>    
                <Spinner h={'8vw'}/>
            </div>
        </div>
    </>
}

LoadingPage.defaultProps = {
    content: 'LOADING DATA'
}
export default LoadingPage;