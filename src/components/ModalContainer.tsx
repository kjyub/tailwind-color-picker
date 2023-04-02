import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import tw from "tailwind-styled-components"
import { Dispatcher } from '../types/Dispatcher';

const ShowBackGroundAnimationDuration = 100
const ShowChildAnimationDuration = 200

interface IModalDiv {
    scrollY: number
    visibility?: boolean
}

export interface IModalContainer {
    children: any,
    visibility?: boolean,
    setVisibility: Dispatcher<boolean> | null
    isBackground?: boolean
}
export interface IModalComponent {
    visibility?: boolean,
    setVisibility: Dispatcher<boolean>
}

const ModalDiv = styled.div<IModalDiv>`
    position: fixed;
    top: ${(props:any) => (props.scrollY)};
    width: 100vw;
    height: 100vh;
    left: 0;
    z-index: 10;
    overflow-y: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    
    ::-webkit-scrollbar {
        width:0px;
    }
    
    // Animation
    visibility: ${(props:any) => !props.visibility ? "hidden" : "visible"};
    opacity: ${(props:any) => !props.visibility ? "0" : "100"};
    transition: visibility ${ShowBackGroundAnimationDuration}ms linear, opacity ${ShowBackGroundAnimationDuration}ms linear;
`
const ModalDivBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    overflow: hidden;
`
const ModalDivBackgroundBlur = styled(ModalDivBackground)`
    background-color: rgba(0,0,0,0.25);
    backdrop-filter: blur(3px);
`
const ModalDivBackgroundTransparent = styled(ModalDivBackground)`
`
const ModalDivComponent = styled.div<IModalDiv>`
    z-index: 12;
    overflow: hidden;

    // Animation
    visibility: ${(props:any) => !props.visibility ? "hidden" : "visible"};
    opacity: ${(props:any) => !props.visibility ? "0" : "100"};
    transition: visibility ${ShowChildAnimationDuration}ms linear, opacity ${ShowChildAnimationDuration}ms linear;
`

export const ModalDivContainer = styled.div`    
    max-height: 90vh;

    overflow-y: auto;
`

export const ModalContainer: React.FC<IModalContainer> = ({children, visibility, setVisibility, isBackground=true}) => {
    const [bodyScrollY, setBodyScrollY] = useState(0)
    const [isMounted, setIsMounted] = useState(false)
    const setCloseModal = () => {
        if (setVisibility != null) {
            setVisibility(false)
        }
    }

    useEffect(() => {
        const documentTop:number = parseInt(document.body.style.top.replace("px","")) * -1

        if (visibility) {
            setBodyScrollY(documentTop > 0 ? documentTop : 0)
            // 뒤에있는 스크롤 방지
            // overflow-y 로 바꾸면 Modal On 시 스크롤 막대 생성
            document.body.style.cssText = `
                position: fixed; 
                top: -${window.scrollY}px;
                overflow-y: hidden;
                width: 100%;
            `

            setIsMounted(true)
        }
        else {
            document.body.style.cssText = '';
            // 값이 없는 경우 스크롤이 위로 올라가는것 방지
            if (documentTop > 0) {
                window.scrollTo(0, documentTop);
            }

            // 다시 visibility를 On 했을 때는 Mount를 해준 상태여야한다.
            setTimeout(()=>{},ShowChildAnimationDuration)
            if (!visibility){
                setIsMounted(false)
            }
        }
    }, [visibility]);


    return (
        <ModalDiv scrollY={bodyScrollY} visibility={visibility}>
            <ModalDivComponent scrollY={bodyScrollY} visibility={visibility}>
                {isMounted && children}
            </ModalDivComponent>
            {isBackground ? (
                <ModalDivBackgroundBlur onClick={()=>{setCloseModal()}} />
            ) : (
                <ModalDivBackgroundTransparent onClick={()=>{setCloseModal()}} />
            )}
        </ModalDiv>
    )
}