import React, { useState, useEffect } from 'react';
import { ModalContainer } from '../components/ModalContainer';
import { STORAGE_BASE_COLORS, STORAGE_EXTEND_COLORS } from '../components/Storage';
import DEFAULT_COLOR from '../constants/DefaultColor';
import { ColorPalette } from '../types/ColorPalette';
import { Dictionary } from '../types/Dictionary';
import ColorDataEditor from './ColorDataEditor';
import { ColorFilterEditorButton, ColorFilterModeButton, ColorPickerControlBox, ColorPickerMainLayout, ColorRowControlButton, ColorSaveButton } from './ColorPickerStyle';
import ColorTable from './ColorTable';
import _ from "lodash"
import { BLACK_COLOR_BRIGHTNESS } from '../constants/Parameters';
import ColorEditor from './ColorEditor';
import { Dispatcher } from '../types/Dispatcher';

const getStorageBaseColor = (): ColorPalette => {
    let color: ColorPalette = {}
    const baseColor = localStorage.getItem(STORAGE_BASE_COLORS)

    if (baseColor === null || baseColor === undefined) {
        color = DEFAULT_COLOR
    } else {
        color = JSON.parse(baseColor)
    }

    return color
}

const getStorageExtendColor = (): ColorPalette => {
    let color: ColorPalette = {}
    const baseColor = localStorage.getItem(STORAGE_EXTEND_COLORS)

    if (baseColor === null || baseColor === undefined) {
        color = {}
    } else {
        color = JSON.parse(baseColor)
    }

    return color
}

const mergeColor = (baseColor: ColorPalette, extendColor: ColorPalette): ColorPalette => {
    console.log(baseColor["gray"], extendColor["gray"])
    let merged = _.cloneDeep(baseColor)

    Object.keys(baseColor).map(baseColorName => {
        const extendColorValue = extendColor[baseColorName]

        if (extendColorValue !== undefined) {
            if (typeof extendColorValue === "string") {
                merged[baseColorName] = extendColorValue
            } else {
                _.merge(merged[baseColorName], extendColorValue)
            }
        }
    })
    Object.keys(extendColor).map(extendColorName => {
        const baseColorValue = baseColor[extendColorName]

        if (baseColorValue === undefined) {
            merged[extendColorName] = extendColor[extendColorName]
        } else {
            _.merge(merged[extendColorName], extendColor[extendColorName])
        }
    })

    return merged
}

const saveLocalStorage = (storageKey: string, colorPalette: ColorPalette): boolean => {
    let bResult = false
    try {
        localStorage.setItem(storageKey, JSON.stringify(colorPalette))
        bResult = true
    } catch {

    }

    return bResult
}

const ColorPickerMain = () => {
    const [baseColorData, setBaseColorData] = useState<ColorPalette>({})
    const [extendColorData, setExtendColorData] = useState<ColorPalette>({})
    const [colorData, setColorData] = useState<ColorPalette>({})

    const [filterColor, setFilterColor] = useState(new Dictionary<string, number>())

    const [isFilterMode, setFilterMode] = useState(false)

    const [showBaseColorEditor, setShowBaseColorEditor] = useState(false)
    const [showExtendColorEditor, setShowExtendColorEditor] = useState(false)

    const [showEditorComponent, setShowEditorComponent] = useState(false)
    const [colorEditorLeft, setColorEditorLeft] = useState(0)
    const [colorEditorTop, setColorEditorTop] = useState(0)
    const [colorEditorColor, setColorEditorColor] = useState("")
    const [colorEditorColorCode, setColorEditorColorCode] = useState<Array<string>>([])

    useEffect(()=>{
        loadColorStorage()
    }, [])

    useEffect(()=>{
        setColorData(mergeColor(baseColorData, extendColorData))
    }, [baseColorData, extendColorData])

    const loadColorStorage = () => {
        const base = getStorageBaseColor()
        const extend = getStorageExtendColor()

        setBaseColorData(base)
        setExtendColorData(extend)
    }

    const handleFilter = (colorName: string) => {
        const newFilter = filterColor.copy()

        if (filterColor.contains(colorName)) {
            newFilter.delete(colorName)
        } else {
            newFilter.push(colorName, 0)
        }

        setFilterColor(newFilter)
    }

    const handleAddColorBrigtness = (colorName: string, brightness: number) => {
        let newExtendColorData:ColorPalette | any = _.cloneDeep(extendColorData)

        if (newExtendColorData[colorName] === undefined) {
            newExtendColorData[colorName] = {}
        } else if (typeof newExtendColorData[colorName] === "string") {
            newExtendColorData[colorName]["1"] = newExtendColorData[colorName]
        }
        newExtendColorData[colorName][String(brightness)] = brightness <= BLACK_COLOR_BRIGHTNESS ? "#FFFFFF" : "#000000" 

        setExtendColorData(newExtendColorData)

        const json = JSON.stringify(newExtendColorData)
        localStorage.setItem(STORAGE_EXTEND_COLORS, json)
    }

    const handleColorEditComponent = (left: number, top: number, color: string, colorCode: Array<string>) => {
        setColorEditorLeft(left)
        setColorEditorTop(top)
        setColorEditorColor(color)
        setColorEditorColorCode(colorCode)
        setShowEditorComponent(true)
    }

    const handleSaveStorage = () => {
        if (!saveLocalStorage(STORAGE_BASE_COLORS, baseColorData)) {
            alert("기본 색상 저장에 실패했습니다.")
            return
        }
        if (!saveLocalStorage(STORAGE_EXTEND_COLORS, extendColorData)) {
            alert("확장 색상 저장에 실패했습니다.")
            return
        }
        
        alert("저장되었습니다.")
    }

    const handleRestore = () => {
        loadColorStorage()
        alert("저장된 값을 불러왔습니다.")
    }

    return (
        <ColorPickerMainLayout>
            <ColorPickerControlBox>
                <div className='flex'>
                    <ColorFilterEditorButton onClick={()=>{setShowBaseColorEditor(true)}}>기본 색상 설정</ColorFilterEditorButton>
                    <ColorFilterEditorButton onClick={()=>{setShowExtendColorEditor(true)}}>확장(커스텀) 색상 설정</ColorFilterEditorButton>
                    <ColorSaveButton onClick={()=>{handleSaveStorage()}}>저장</ColorSaveButton>
                    <ColorSaveButton onClick={()=>{handleRestore()}}>되돌리기</ColorSaveButton>
                </div>
                <div className='flex'>
                    <ColorFilterModeButton is_filter={!isFilterMode} onClick={()=>{setFilterMode(false)}}>
                        모든 색상
                    </ColorFilterModeButton>
                    <ColorFilterModeButton is_filter={isFilterMode} onClick={()=>{setFilterMode(true)}}>
                        고정 색상
                    </ColorFilterModeButton>
                </div>
            </ColorPickerControlBox>
            <ColorTable 
                colorData={colorData}
                filterColor={filterColor}
                handleFilter={handleFilter} 
                addColorBrightness={handleAddColorBrigtness}
                showColorEditComponent={handleColorEditComponent}
            />

            <ModalContainer visibility={showBaseColorEditor} setVisibility={setShowBaseColorEditor}>
                <ColorDataEditor 
                    colorPalette={baseColorData} 
                    setColorPalette={setBaseColorData} 
                    storageKey={STORAGE_BASE_COLORS} 
                    setVisibility={setShowBaseColorEditor} 
                    initColor={DEFAULT_COLOR}
                />
            </ModalContainer>

            <ModalContainer visibility={showExtendColorEditor} setVisibility={setShowExtendColorEditor}>
                <ColorDataEditor 
                    colorPalette={extendColorData} 
                    setColorPalette={setExtendColorData} 
                    storageKey={STORAGE_EXTEND_COLORS} 
                    setVisibility={setShowExtendColorEditor} 
                    initColor={{}}
                />
            </ModalContainer>

            <ModalContainer visibility={showEditorComponent} setVisibility={setShowEditorComponent} isBackground={false}>
                <ColorEditor
                    left={colorEditorLeft}
                    top={colorEditorTop}
                    color={colorEditorColor}
                    colorCode={colorEditorColorCode}

                    baseColorPalette={baseColorData} 
                    setBaseColorPalette={setBaseColorData} 
                    extendColorPalette={extendColorData} 
                    setExtendColorPalette={setExtendColorData} 

                    setVisibility={setShowEditorComponent}
                />
            </ModalContainer>
        </ColorPickerMainLayout>
    )
}

export default ColorPickerMain