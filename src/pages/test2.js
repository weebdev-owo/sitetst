

export default function Test(){

    return <>
        <Inner1 >
            <div>Inside Test</div>
        </Inner1>
    </>
}

function Inner1({children}){
    console.log('inner1 called')
    return <>
        <Inner2 >
            {children}
        </Inner2>
    </>
}

function Inner2({children}){
    return <>
        {children}
    </>
}