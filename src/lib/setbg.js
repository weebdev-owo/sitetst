import {useRef, useState, useEffect} from 'react'
const setBgCol = (val) => {
    if (val){
        // console.log("vis")
        document.body.style.background = "#fff"
    }
    else {
        // console.log("not vis")
        document.body.style.background = "#000"
    }
}

const SetBg = (elemRef) => {

    useEffect(() => {
        let initial;
        if(document){initial=getComputedStyle(document.body).background}
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
            document.body.style.background = initial
        }

    }, []);
    

}

export default SetBg