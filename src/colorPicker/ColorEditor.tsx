import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { IModalComponent } from '../components/ModalContainer';
import { ColorPalette } from '../types/ColorPalette';
import { Dispatcher } from '../types/Dispatcher';
import _ from "lodash"

interface IColorEditor extends IModalComponent{
    left: number
    top: number
    color: string
    colorCode: Array<string>
    baseColorPalette: ColorPalette
    setBaseColorPalette: Dispatcher<ColorPalette>
    extendColorPalette: ColorPalette
    setExtendColorPalette: Dispatcher<ColorPalette>
}
const ColorEditor = ({left, top, color, colorCode, baseColorPalette, setBaseColorPalette, extendColorPalette, setExtendColorPalette, setVisibility}: IColorEditor) => {
    const [editorColor, setEditorColor] = useState("")

    useEffect(()=>{
        setEditorColor(color)
    }, [color])

    const handleColorChange = (newColor: string) => {
        setEditorColor(newColor)

        const newExtendColorPalette = _.cloneDeep(extendColorPalette)
        let newExtendColor = newExtendColorPalette[colorCode[0]]
        if (colorCode[1] === "0") {
            newExtendColor = newColor
        } else if (typeof newExtendColor === "object") {
            newExtendColor[colorCode[1]] = newColor
        }

        setExtendColorPalette(newExtendColorPalette)
    }

    return (
        <div className='absolute' style={{left: left, top: top}}>
            <ChromePicker 
                color={editorColor} 
                onChange={(_color) => handleColorChange(_color.hex)} 
            />
        </div>
    )
}

export default ColorEditor