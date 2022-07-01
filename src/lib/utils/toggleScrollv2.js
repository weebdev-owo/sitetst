import {useEffect, useContext, createContext, useRef} from 'react'
import ToggleScrollContext from '/src/lib/utils/toggleScrollContext'

let initial_scroll_y
let inital_scroll_x
let initial_scroll

// export const ToggleScrollContext = createContext()

const useToggleScroll = (disableScroll) => {
    const {ScrollDisableCount, setScrollDisableCount} =  useContext(ToggleScrollContext)

    const prev_disableScroll = useRef(false)
    useEffect(() => {

        initial_scroll_y = getComputedStyle(document.body)['overflow-y']
        inital_scroll_x = getComputedStyle(document.body)['overflow-x']
        initial_scroll = getComputedStyle(document.body)['overflow']
  
        return () => {
            document.body.style['overflow-y'] = initial_scroll_y
            document.body.style['overflow-x'] = inital_scroll_x
            document.body.style['overflow'] = initial_scroll
        }

    }, []);
    useEffect(() =>{
        console.log(ScrollDisableCount)
        if (ScrollDisableCount>0){
            document.body.style['overflow-y'] = 'hidden'
            document.body.style['overflow-x'] = 'hidden'
            document.body.style['overflow'] = 'hidden'
        }
        else {
            document.body.style['overflow-y'] = initial_scroll_y
            document.body.style['overflow-x'] = inital_scroll_x
            document.body.style['overflow'] = initial_scroll
        }
    }, [ScrollDisableCount])

    useEffect(() =>{
        console.log('REEE', prev_disableScroll.current, disableScroll)
        if(disableScroll != prev_disableScroll.current){
            console.log('HERER')
            if(disableScroll) setScrollDisableCount( cnt => cnt+1 )
            else setScrollDisableCount( cnt => cnt-1 )
        }
        prev_disableScroll.current = disableScroll
    }, [disableScroll])

}

export default useToggleScroll