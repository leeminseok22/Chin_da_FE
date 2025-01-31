import React, { useEffect } from "react"
import styled from "styled-components"
import Tutorial from "./Tutorial.js"
import effectSound from "../../shared/effectSound.js"
import hoverSound from "../../audios/BtnHoverSE1.mp3"
import { useSelector } from "react-redux"

const TutorialBtn = () => {
    const userSound = useSelector((state) => state.user.sound);
    const newuser = sessionStorage.getItem("newUser");
    const [tutoOpen, setTutoOpen] = React.useState(false);
    const open = () => {
        setTutoOpen(true);
    }
    useEffect(() => {
        if (newuser !== null) {
            const stringNewUser = newuser.toString();
            console.log(stringNewUser)
            if (stringNewUser === "true") {
                open();
            }
        }
    },[])
   const hoverEs = effectSound(hoverSound, userSound.es)



    return (
        <div>
            {tutoOpen ? (<Tutorial setTutoOpen={setTutoOpen} />) : (
                <TutoBtn src="/img/question_btn_black.svg" onClick={open} onMouseOver={() => hoverEs.play()} />
            )}
        </div>
    )
}

const TutoBtn = styled.img`
position: fixed;
right: 0.5vw;
bottom: 1vh;
width: calc(1vh + 1vw);
height: calc(1vh + 1vw);
z-index: 10;
&:hover{
    content: url(/img/question_btn_white.svg);
}
`;

export default TutorialBtn