import styles from './ProgressBar.module.sass'

export default function ProgressBar({progress}){
    let [loaded, total] = progress
    let unit = ''
    const mb = 1000000
    const kb = 1000

    if (total>100*kb){ loaded = (loaded/mb).toFixed(2); total = (total/mb).toFixed(2); unit = 'mb'; }
    else if(total>kb) { loaded = (loaded/kb).toFixed(2); total = (total/kb).toFixed(2); unit = 'kb'; }
    else{ loaded = (loaded).toFixed(0); total = (total).toFixed(0); unit = 'bytes'; }

    return <>
        <div className={styles['progress-uploading']}>
            <Bar progress={Math.floor((loaded*100)/total)} />
            <div>{`${loaded}/${total} ${unit}`}</div>
        </div>
    </>
}

function Bar({progress}){
    return <>
        <div style={{
            height: '5px', 
            width: '200px',
            backgroundColor: 'black',
            borderRadius: '20px',
            border: '1px solid white'
        }}>
            <div style={{
                height: '100%', 
                width: `${progress}%`,
                backgroundColor: 'white',
                borderRadius: '20px'
            }}>

            </div>
        </div>
    </>
}