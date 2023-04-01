import React, {useState, useEffect} from 'react';
import { BLACK_COLOR_BRIGHTNESS, COLOR_TABLE_MIN_WIDTH } from '../constants/Parameters';
import { useGettingWidth } from '../hooks/useGettingWidth';
import { ColorPalette, Colors } from '../types/ColorPalette';
import { Dictionary } from '../types/Dictionary';
import { ColorBox, ColorInfo, ColorListBox, ColorListContainer, ColorRowControlBox, ColorRowControlButton, ColorRowHeaderBox, ColorRowLayout, ColorRowName, ColorTableLayout } from './ColorPickerStyle';

interface IFilterColor {
    filterColor: Dictionary<string, number>
    handleFilter: (colorName: string) => void
}

interface IColorTable extends IFilterColor {
    colorData: ColorPalette
    addColorBrightness: (colorName: string, brightness: number) => void
}
const ColorTable = ({colorData, addColorBrightness, filterColor, handleFilter}: IColorTable) => {
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
                    />
                )
            ))}
        </ColorTableLayout>
    )
}
export default ColorTable

interface IColorRow extends IFilterColor {
    colorName: string
    colors: Colors
    addColorBrightness: (colorName: string, brightness: number) => void
}
const ColorRow = ({colorName, colors, filterColor, handleFilter, addColorBrightness}: IColorRow) => {
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
                        <ColorCell color={colors} index={0} brightness={"0"} />
                    ) : (
                        Object.keys(colors).map((cb, index) => (
                            <ColorCell color={colors[cb]} index={index} brightness={cb} />
                        ))
                    )}
                </ColorListBox>
            </ColorListContainer>
        </ColorRowLayout>
    )
}

interface IColorCell {
    color: string
    index: number
    brightness?: string
}
const ColorCell = ({color, index, brightness=""}: IColorCell) => {
    const brightness_value = Number.isNaN(brightness) || index === 0 ? 0 : Number(brightness) * 0.1

    return (
        <ColorBox className='absolute right-0' style={{width: `calc(100% - ${brightness_value}%)`, marginLeft:"auto"}}>
            <div className={`w-full h-full border-r border-black`} style={{backgroundColor: color}}>
                <ColorInfo black={Number(brightness) <= BLACK_COLOR_BRIGHTNESS}>
                    <span>{color}</span>
                    <span>{brightness}</span>
                </ColorInfo>
            </div>
        </ColorBox>
    )
}