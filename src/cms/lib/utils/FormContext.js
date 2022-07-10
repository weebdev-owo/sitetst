import React, {memo, useRef, useState, useCallback, useEffect, useReducer, useMemo, createContext, useContext} from 'react'
import {useFormikContext} from 'formik'
import flatten from '/src/cms/lib/utils/flattenFormErrors'

const FormContext = createContext()

const initialErrorScroll = {
    submitFailed: false,
    heights: [],
    element: null,
    num_resolved: 0,
    num_to_resolve: 0,
    errors: {}
}

function errorScrollReducer(state, data){
    const assign = typeof data === 'string'
    const action = assign ? data:data[0]
    const value = assign ? null:data[1]

    switch (action){
        case 'reset': return JSON.parse(JSON.stringify(initialErrorScroll))

        case 'submitFailed': {
            const new_state = JSON.parse(JSON.stringify(initialErrorScroll))
            new_state.submitFailed = true
            new_state.errors = value
            new_state.heights = []
            new_state.num_to_resolve = Object.keys(new_state.errors).length
            return new_state
        }

        case 'resolve':{
            const new_state = Object.assign({}, state)
            // console.log('ADDING HEIGHT', value.top, new_state.heights)
            new_state.heights.push(value)
            new_state.num_resolved += 1
            console.log('num resolved', new_state.num_resolved, new_state.num_to_resolve)
            // console.log(new_state.errors)
            if(new_state.num_resolved === new_state.num_to_resolve){
                console.log('RESOLVED', new_state.heights.length)
                let elem = null; let top = Infinity
                for (const item of new_state.heights){if (item.top < top){elem = item.elemRef; top = item.top}}
                elem.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                return JSON.parse(JSON.stringify(initialErrorScroll))
            }
            else return new_state
        }
    }
}

function FormContextProvider({children}){
    //Error scroll position
    const {submitCount, isSubmitting, isValidating, errors, values} = useFormikContext()
    const [errorScroll, setErrorScroll] = useReducer(errorScrollReducer, JSON.parse(JSON.stringify(initialErrorScroll)))
    useEffect(() =>{
        if (submitCount && !isValidating && isSubmitting && Object.keys(errors).length ) {
            setErrorScroll(['submitFailed', flatten(errors)])
        }
    }, [isSubmitting, isValidating, submitCount])

    // useEffect(() =>{
    //     if(errorScroll.submitFailed) console.log('Submit Failed', values, errorScroll, flatten(errors))
    // }, [errorScroll.submitFailed])

    useEffect(() =>{setErrorScroll('reset')},[submitCount])

    return <>
        <FormContext.Provider value={{errorScroll, setErrorScroll}}>
            {children}
        </FormContext.Provider>
    </>
}

function useFormContext(){
    return useContext(FormContext)
}

export {useFormContext, FormContextProvider}
export default FormContext