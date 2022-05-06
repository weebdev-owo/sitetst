export default function Test({}){
    return <>
        <Dynamic>
            <div>Omnom</div>
            <div>Omnom</div>
            <div>Omnom</div>
            {() =>{ console.log('reeeee')}}
        </Dynamic>
    </>
}

function Dynamic({children}){
    console.log(children)
    console.log(children[3])
    children[3]()
    return <>
        {children}
        {children[3]}
    </>
}