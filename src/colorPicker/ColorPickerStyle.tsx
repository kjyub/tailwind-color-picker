import tw from 'tailwind-styled-components'
import ColorPickerMain from './ColorPickerMain';

export const ColorPickerMainLayout = tw.div`
flex flex-col w-full h-full bg-black
`

export const ColorPickerControlBox = tw.div`
flex justify-between items-center
w-full h-12 px-1
border-b-2 border-white
text-white
`

interface IColorFilterModeButton{
    is_filter: boolean
}
export const ColorFilterModeButton = tw.button`
flex flex-center
px-2 py-1 border border-white
${(props: IColorFilterModeButton) => props.is_filter ? "bg-white text-black":"bg-black text-white"}
`
export const ColorFilterEditorButton = tw.button`
flex flex-center mr-2
px-2 py-0.5 rounded-lg border border-white
`

export const ColorTableLayout = tw.div`
flex flex-col
w-full h-full
overflow-y-auto scroll-transparent scroll-overlay
`

export const ColorRowLayout = tw.div`
flex flex-shrink-0
w-full h-24 text-white
`

export const ColorRowHeaderBox = tw.div`
flex flex-col flex-shrink-0
w-40
border-r border-white
`
export const ColorRowName = tw.div`
flex flex-center
w-full h-full
[&>span]:text-lg [&>span]:text-white [&>span]:font-bold
`
export const ColorRowControlBox = tw.div`
flex flex-shrink-0
w-full h-8 p-1
border-b border-white
`
export const ColorRowControlButton = tw.button`
px-2 mr-1
rounded-md border border-white
text-sm
`

export const ColorListContainer = tw.div`
flex w-full
overflow-x-auto scroll-transparent scroll-overlay
`
export const ColorListBox = tw.div`
flex flex-shrink-0 relative
h-full
`

export const ColorBox = tw.div`
h-full
`
interface IColorInfo {
    black: boolean
}
export const ColorInfo = tw.div`
flex flex-col
text-xs
${(props: IColorInfo) => props.black ? "text-black" : "text-white"}
`