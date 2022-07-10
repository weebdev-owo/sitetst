import {useRef, useEffect, useContext} from 'react'
import {useFormikContext} from 'formik'
import {getByPath} from '/src/cms/lib/utils/byPath'
import {useFormContext} from '/src/cms/lib/utils/FormContext'

export default function useErrorScroll(name, meta, isErr=null){

    const elemRef = useRef(null)
    const {errorScroll, setErrorScroll} = useFormContext()
    const errors = errorScroll.errors
    const error = isErr == null ? errors[name]:isErr

    useEffect(() => {
        if (errorScroll.submitFailed && error) setErrorScroll(['resolve', {top: elemRef.current.getBoundingClientRect().y, elemRef}])
    }, [errorScroll.submitFailed])

    return elemRef
}