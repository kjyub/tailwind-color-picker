import React, {useState, useEffect} from 'react';
import { IModalComponent } from '../components/ModalContainer';

import tw from 'tailwind-styled-components'
import { useFocus } from '../hooks/useFocus';
import { ColorPalette } from '../types/ColorPalette';
import { Dispatcher } from '../types/Dispatcher';

const Layout = tw.div`
flex flex-col w-192 h-256 p-4 bg-zinc-800 shadow-lg
`
interface ITextArea{
    is_focused: boolean
}
const TextArea = tw.textarea`
w-full h-full p-2 bg-zinc-700 rounded-lg text-white scroll-transparent scroll-overlay
${(props:ITextArea) => props.is_focused && "ring-2 ring-zinc-500"} duration-200
`

const ControlBox = tw.div`
    flex justify-between items-center w-full h-16
`
const ControlButton = tw.button`
    px-4 py-2 text-zinc-100 font-medium
`

const tryParseJson = (value: string): ColorPalette | null => {
    let result = null

    try {
        result = JSON.parse(value)
    } catch {
        result = null
        alert("Json 변환에 실패했습니다.")
    }

    return result
}

interface IColorDataEditor extends IModalComponent {
    colorPalette: ColorPalette
    setColorPalette: Dispatcher<ColorPalette>
    storageKey: string
    initColor: ColorPalette
}
const ColorDataEditor = ({colorPalette, setColorPalette, storageKey, initColor, setVisibility}: IColorDataEditor) => {
    const [textFocusRef, textFocus] = useFocus<HTMLTextAreaElement>()

    const [value, setValue] = useState("")

    useEffect(()=>{
        if (Object.keys(colorPalette).length > 0) {
            setValue(JSON.stringify(colorPalette, null, 4))
        } else {
            setValue("{\n}")
        }
    }, [colorPalette])

    const save = () => {
        const newColorPalette = tryParseJson(value)

        if (newColorPalette !== null && Object.keys(newColorPalette).length > 0) {
            const json = JSON.stringify(newColorPalette)
            localStorage.setItem(storageKey, json)
            
            setColorPalette(newColorPalette)
            setVisibility(false)
        }
        
    }

    const reset = () => {
        setColorPalette(initColor)
        localStorage.setItem(storageKey, JSON.stringify(initColor))
        setVisibility(false)
    }

    const lint = () => {
        const jsonValue = tryParseJson(value)
        if (jsonValue !== null) {
            setValue(JSON.stringify(jsonValue, null, 4))
        }
    }

    return (
        <Layout>
            <TextArea
                ref={textFocusRef}
                is_focused={textFocus}
                value={value}
                onChange={(e)=>{setValue(e.target.value)}}
                spellCheck={false}
            />
            <ControlBox>
                <ControlButton onClick={()=>{reset()}}>초기화</ControlButton>
                <ControlButton onClick={()=>{lint()}}>정렬</ControlButton>
                <ControlButton onClick={()=>{save()}}>저장</ControlButton>
            </ControlBox>
        </Layout>
    )
}
export default ColorDataEditor