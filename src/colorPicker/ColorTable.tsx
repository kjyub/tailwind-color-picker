import React, {useState, useEffect, useRef, useCallback} from 'react';
import { ChromePicker } from 'react-color';
import { BLACK_COLOR_BRIGHTNESS, COLOR_TABLE_MIN_WIDTH } from '../constants/Parameters';
import { useGettingWidth } from '../hooks/useGettingWidth';
import { ColorPalette, Colors } from '../types/ColorPalette';
import { Dictionary } from '../types/Dictionary';
import { Dispatcher } from '../types/Dispatcher';
import { ColorBox, ColorInfo, ColorListBox, ColorListContainer, ColorRowControlBox, ColorRowControlButton, ColorRowHeaderBox, ColorRowLayout, ColorRowName, ColorTableLayout } from './ColorPickerStyle';


interface IFilterColor {
    filterColor: Dictionary<string, number>
    handleFilter: (colorName: string) => void
}

interface IColorTable extends IFilterColor {
    colorData: ColorPalette
    addColorBrightness: (colorName: string, brightness: number) => void
    showColorEditComponent: (left: number, top: number, colorName: string, colorCode: Array<string>) => void
}
const ColorTable = ({colorData, addColorBrightness, filterColor, handleFilter, showColorEditComponent}: IColorTable) => {
    const [colorNames, setColorNames] = useState<Array<string>>([])

    useEffect(()=>{
        setColorNames(Object.keys(colorData))
    }, [colorData])

    return (
        <ColorTableLayout>
            {colorNames.map(colorName => (
                colorData[colorName] !== undefined && (
                    <ColorRow 
                        colorName={colorName} 
                        colors={colorData[colorName]} 
                        filterColor={filterColor}
                        handleFilter={handleFilter}
                        addColorBrightness={addColorBrightness}
                        showColorEditComponent={showColorEditComponent}
                    />
                )
            ))}
            <div className="flex flex-shrink-0 w-full h-72">
                {/* 하단 여백용 */}
            </div>
        </ColorTableLayout>
    )
}
export default ColorTable

interface IColorRow extends IFilterColor {
    colorName: string
    colors: Colors
    addColorBrightness: (colorName: string, brightness: number) => void
    showColorEditComponent: (left: number, top: number, colorName: string, colorCode: Array<string>) => void
}
const ColorRow = ({colorName, colors, filterColor, handleFilter, addColorBrightness, showColorEditComponent}: IColorRow) => {
    const [rowWidth, rowRef] = useGettingWidth()

    const handleAddColorBrightness = () => {
        const value = prompt("추가할 색상의 채도 수치를 입력해주세요.")

        if (value === null) {
            return
        }
        if (value === "") {
            alert("값이 입력되지 않았습니다.")
            return
        }
        const brightness: number = Number(value)
        if (Number.isNaN(brightness)) {
            alert("유효하지않은 값입니다.")
            return
        }

        addColorBrightness(colorName, brightness)
    }

    return (
        <ColorRowLayout ref={rowRef}>
            <ColorRowHeaderBox>
                <ColorRowName>
                    <span>{colorName}</span>
                </ColorRowName>
                <ColorRowControlBox>
                    <ColorRowControlButton onClick={()=>{handleFilter(colorName)}}>
                        {filterColor.contains(colorName) ? "고정 취소" : "고정"}
                    </ColorRowControlButton>
                    <ColorRowControlButton onClick={()=>{handleAddColorBrightness()}}>
                        추가
                    </ColorRowControlButton>
                </ColorRowControlBox>
            </ColorRowHeaderBox>
            <ColorListContainer>
                <ColorListBox style={{width: rowWidth < COLOR_TABLE_MIN_WIDTH ? `${COLOR_TABLE_MIN_WIDTH}px` : "100%"}}>
                    {typeof colors === "string" ? (
                        <ColorCell colorName={colorName} color={colors} index={0} brightness={"0"} showColorEditComponent={showColorEditComponent} />
                    ) : (
                        Object.keys(colors).map((cb, index) => (
                            <ColorCell colorName={colorName} color={colors[cb]} index={index} brightness={cb} key={index} showColorEditComponent={showColorEditComponent} />
                        ))
                    )}
                </ColorListBox>
            </ColorListContainer>
        </ColorRowLayout>
    )
}

interface IColorCell {
    colorName: string
    color: string
    index: number
    showColorEditComponent: (left: number, top: number, colorName: string, colorCode: Array<string>) => void
    brightness?: string
}
const ColorCell = ({colorName, color, index, brightness="", showColorEditComponent}: IColorCell) => {
    const brightness_value = Number.isNaN(brightness) || index === 0 ? 0 : Number(brightness) * 0.1

    const [colorValue, setColorValue] = useState("")
    const [showColorEdit, setShowColorEdit] = useState(false)

    const ref = useRef(null)

    useEffect(()=>{
        setColorValue(color)
    }, [color])

    const handleShowColorEdit = (e: any) => {
        const absoluteLeft = window.pageXOffset + e.target.getBoundingClientRect().left - 52;
        const absoluteTop = window.pageYOffset + e.target.getBoundingClientRect().top + 72;

        // showColorEditComponent(!showColorEdit ? (
        //     <div className='absolute' style={{left: absoluteLeft, top: absoluteTop}}>
        //         <ChromePicker color={colorValue} onChange={(_color) => setColorValue(_color.hex)} />
        //     </div>
        // ) : (null))
        
        showColorEditComponent(absoluteLeft, absoluteTop, colorValue, [colorName, brightness])

        setShowColorEdit(!showColorEdit)
    }

    return (
        <ColorBox className='absolute top-0 right-0' style={{width: `calc(100% - ${brightness_value}%)`, marginLeft:"auto"}} ref={ref}>
            <div className={`w-full h-full`} style={{backgroundColor: colorValue}}>
                <ColorInfo black={Number(brightness) <= BLACK_COLOR_BRIGHTNESS}>
                    <span>{brightness}</span>
                    <span onClick={(e)=>{handleShowColorEdit(e)}} className="hover:border-b border-white cursor-pointer">{color}</span>
                </ColorInfo>
            </div>
            {/* {showColorEdit && (
                <div className='absolute w-32 h-32 bg-red-500' style={{top:"100%", left:0}}>
                    <ChromePicker color={"#F0F0F0"} />
                </div>
            )} */}
        </ColorBox>
    )
}