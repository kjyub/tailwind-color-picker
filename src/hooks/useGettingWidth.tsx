import react, {useState, useEffect, useCallback} from "react"

export const useGettingWidth = ():[number, any] => {
    const [width, setWidth] = useState<number>(0)

    const ref = useCallback((node: any) => {
        if (node !== null) {
            setWidth(node.getBoundingClientRect().width)
        }
    }, [])

    useEffect(()=>{
    }, [])

    return [width, ref]
}