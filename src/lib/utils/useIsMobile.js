import {useEffect} from 'react'

const getMobileDetect = (userAgent) => {
    const isAndroid = () => Boolean(userAgent.match(/Android/i));
    const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
    const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
    const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
    const isSSR = () => Boolean(userAgent.match(/SSR/i));

    const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows());
    const isDesktop = () => Boolean(!isMobile() && !isSSR());
    return isMobile()
};

const getMobile = (window) => {
    const userAgent = window?.navigator?.userAgent
    console.log('ree', getMobileDetect(userAgent))
    return userAgent ? getMobileDetect(userAgent): true
};

export default getMobile