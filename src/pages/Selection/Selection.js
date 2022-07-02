import React from "react";
import styled from "styled-components"
import Language from "./components/Language";
import Level from "./components/Level";
import Room from "./components/Room"
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

const Selection = () => {
    const [language, setLanguage] = React.useState("");
    const [level, setLevel] = React.useState("");

    const [lanOn, setLanOn] = React.useState(true);
    const [levOn, setLevOn] = React.useState(false);
    const [roomOn, setRoomOn] = React.useState(false);


    return (
       <>
          <RoundContainer>
             <Round1 />
             <Round2 />
          </RoundContainer>
          <Body>
             {lanOn ? (
                <Language
                   setLanguage={setLanguage}
                   setLanOn={setLanOn}
                   setLevOn={setLevOn}
                />
             ) : null}
             {levOn ? (
                <Level
                   language={language}
                   setLevel={setLevel}
                   setLanOn={setLanOn}
                   setLevOn={setLevOn}
                   setRoomOn={setRoomOn}
                />
             ) : null}
             {roomOn ? (
                <Room
                   language={language}
                   level={level}
                   setLanOn={setLanOn}
                   setLevOn={setLevOn}
                   setRoomOn={setRoomOn}
                />
             ) : null}
          </Body>
       </>
    );
}

const RoundContainer = styled.div`
   overflow-x: hidden;
   overflow-y: hidden;
`;

const Round1 = styled.div`
   position: absolute;
   top: 5%;
   left: 20%;
   width: 12em;
   height: 12em;
   border-radius: 50%;
   box-shadow: 0 0 40px #d84869;
   background: linear-gradient(-26deg, #d84869, #f46641);
   animation: cloudOrbit1 50s linear infinite;
`;

const Round2 = styled.div`
   position: absolute;
   top: 40%;
   right: 15%;
   width: 20em;
   height: 20em;
   border-radius: 50%;
   box-shadow: 0 0 50px #5622ff;
   background: linear-gradient(-180deg, #5622ff, #4190fd);
   animation: cloudOrbit2 90s linear infinite;
   overflow-x: hidden;
   overflow-y: hidden;
`;

const Body = styled.div`
width: 100vw;
height: 100vh;
display: flex;
flex-direction: column;
`;


export default Selection;