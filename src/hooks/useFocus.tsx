import react, {useState, useEffect, useRef} from "react"

export const useFocus = <T extends HTMLElement,>():[React.MutableRefObject<T | null>, boolean] => {
    const ref = useRef<T | null>(null)

    const [isFocus, setFocus] = useState(false)

    const handleMouseOver = () => {setFocus(true)}
    const handleMouseOut = () => {setFocus(false)}

    useEffect(()=>{
        const node = ref.current
        if(node) {
            node.addEventListener("focus", handleMouseOver)
            node.addEventListener("blur", handleMouseOut)

            return () => {
                node.removeEventListener("focus", handleMouseOver)
                node.removeEventListener("blur", handleMouseOut)
            }
        }
    }, [ref.current])

    return [ref, isFocus]
}