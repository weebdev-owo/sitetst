import {useState, useEffect} from 'react'

function useMobileWidth(mw){
    const [isMobileWidth, setIsMobileWidth] = useState(undefined)
    const checkWidth = () => {
        // console.log('resizeu',window.innerWidth, window.innerWidth <= mw); 
        setIsMobileWidth(window.innerWidth <= mw)
    }
    useEffect(() => {
        checkWidth()
        window.addEventListener('resize', checkWidth)
        return () => {window.removeEventListener('resize', checkWidth)}
    }, [])
    return isMobileWidth
}

export default useMobileWidth