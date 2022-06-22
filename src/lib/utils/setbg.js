import {useEffect} from 'react'
export const setBgCol = (val) => {


        if (val){
            // console.log("vis")
            document.body.style.background = "#fff"
            document.body.style.setProperty("--scroll-col", "#0000004b")
            document.body.style.setProperty("--scroll-hover-col", "black")
        }
        else {
            // console.log("not vis")
            document.body.style.background = "#000"
            document.body.style.setProperty("--scroll-col", "#ffffff3d")
            document.body.style.setProperty("--scroll-hover-col", "#ffffffc1")
        }

}

const SetBg = (elemRef) => {

    useEffect(() => {

        const initial_bg = getComputedStyle(document.body).background
        const initial_scroll_col = getComputedStyle(document.body).getPropertyValue("--scroll-col")
        const initial_scroll_hover_col = getComputedStyle(document.body).getPropertyValue("--scroll-hover-col")

        let obsElemRef;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {setBgCol(entry.isIntersecting)})
        }, {threshold: 0.05})
        
        if (elemRef.current){
            obsElemRef = elemRef.current
            observer.observe(elemRef.current)
        }
  
        return () => {
            if(obsElemRef && observer){observer.unobserve(obsElemRef)}
            document.body.style.background = initial_bg
            document.body.style.setProperty("--scroll-col", initial_scroll_col)
            document.body.style.setProperty("--scroll-hover-col", initial_scroll_hover_col)
        }

    }, []);
    

}
export const SetBgInv = (elemRef) => {

    useEffect(() => {

        const initial_bg = 'white'
        const initial_scroll_col = getComputedStyle(document.body).getPropertyValue("--scroll-col")
        const initial_scroll_hover_col = "black"

        let obsElemRef;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {setBgCol(!entry.isIntersecting)})
        })
        
        if (elemRef.current){
            obsElemRef = elemRef.current
            observer.observe(elemRef.current)
        }
  
        return () => {
            if(obsElemRef && observer){observer.unobserve(obsElemRef)}
            document.body.style.background = initial_bg
            document.body.style.setProperty("--scroll-col", initial_scroll_col)
            document.body.style.setProperty("--scroll-hover-col", initial_scroll_hover_col)
        }

    }, []);
    

}
export default SetBg