import {useEffect} from 'react'


const useToggleScroll = (disableScroll) => {

    useEffect(() => {

        const initial_scroll_y = getComputedStyle(document.body)['overflow-y']
        const inital_scroll_x = getComputedStyle(document.body)['overflow-x']
        const initial_scroll = getComputedStyle(document.body)['overflow']
  
        return () => {
            document.body.style['overflow-y'] = initial_scroll_y
            document.body.style['overflow-x'] = inital_scroll_x
            document.body.style['overflow'] = initial_scroll
        }

    }, []);
    useEffect(() =>{
        if (disableScroll){
            document.body.style['overflow-y'] = 'hidden'
            document.body.style['overflow-x'] = 'hidden'
            document.body.style['overflow'] = 'hidden'
        }
        else {
            document.body.style['overflow-y'] = initial_scroll_y
            document.body.style['overflow-x'] = inital_scroll_x
            document.body.style['overflow'] = initial_scroll
        }
    }, [disableScroll])

}

export default useToggleScroll