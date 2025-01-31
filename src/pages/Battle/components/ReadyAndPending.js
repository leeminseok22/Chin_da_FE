import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css, keyframes } from "styled-components";
import {
  alreadyUser,
  setPending,
} from "../../../redux/modules/battleFunction.js";
import effectSound from "../../../shared/effectSound.js";
import readySound from "../../../audios/ready.mp3";

export const ReadyUser = ({ sendReady }) => {
  const userReady = useSelector((state) => state.battleFunction.already.user);
  const opp = useSelector((state) => state.battleFunction.newOpp);
  const dispatch = useDispatch();
  const userSound = useSelector((state) => state.user.sound);
  const readyEs = effectSound(readySound, userSound.es);

  const setReady = () => {
    readyEs.play();
    sendReady();
    userReady === false && dispatch(alreadyUser({ user: true }));
  };

  const noClick = () => {
    if (opp !== undefined && userReady === false) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <UserContainer wait={userReady}>
      <ReadyBtn disabled={noClick()} onClick={setReady} />
    </UserContainer>
  );
};

export const ReadyOpp = () => {
  const oppReady = useSelector((state) => state.battleFunction.already.opp);
  const userSound = useSelector((state) => state.user.sound);
  const readyEs = effectSound(readySound, userSound.es);
  const oppName = useSelector((state) => state.battleFunction.newOpp);

  useEffect(() => { }, [oppName]);
  
  useEffect(()=>{
    if (oppReady === true){
      readyEs();
    }
  },[oppReady])

  return (
    <OppContainer>
      <OppDiv wait={oppReady}>
        {oppName && (
          <OppLogo disabled="false">
            <p>{oppName} 대기 중</p>
          </OppLogo>
        )}
      </OppDiv>
    </OppContainer>
  );
};

export const GameGo = ({sendStart}) => {
  const Game = useSelector((state) => state.battleFunction.already.gbtn);
  let dispatch = useDispatch();

  const GS = () =>{
    dispatch(alreadyUser({gbtn:false}))
    sendStart();
  }

  return (
    <>
      {Game === true && <GameGoBtn onClick={GS}>
        GAME START
      </GameGoBtn>
      }
    </>
  )
}

const GameStartAni = keyframes`
0%{
  filter: drop-shadow(0 0 0.75rem crimson);
}
25%{
  filter: drop-shadow(0 0 0.75rem #3a798f);
}
50%{
  filter: none
}
75%{
  filter: drop-shadow(0 0 0.75rem #4444dd);
}
100%{
  filter: drop-shadow(0 0 0.75rem crimson);
}
`;

const GameGoBtn = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 8;
  width: 30%;
  min-width: 200px;
  min-height: 50px;
  height: 15%;
  border-radius: 10px;
  background-color: crimson;
  mix-blend-mode: hard-light;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:0;
  margin:0;
  transform: translate(-50%, -50%);
  color: white;
  filter: drop-shadow(0 0 0.75rem crimson);
  font-size: calc((10vw + 5vh) / 3 );
  font-family: Neo;
  animation: ${GameStartAni} 1s infinite;
  &:hover{
    mix-blend-mode: normal;
  }
`;



export const UserSubmitPending = () => {
  const run = useSelector((state) => state.battleFunction.pendingRun.user);
  const dispatch = useDispatch();
  const setRun = (a) => dispatch(setPending(a));
  const onPending = () => {
    const count = setInterval(() => {
      if (run === true) {
        setRun({ user: false });
        clearInterval(count);
      }
    }, 2500);
    return () => clearInterval(count);
  };
  useEffect(() => {
    onPending();
  }, [run]);
  return (
    <>
      {run === true && (
        <UserContainer>
          <Pending />
        </UserContainer>
      )}
    </>
  );
};

export const OppSubmitPending = () => {
  const run = useSelector((state) => state.battleFunction.pendingRun.opp);
  const dispatch = useDispatch();
  const setRun = (a) => dispatch(setPending(a));
  const onPending = () => {
    const count = setInterval(() => {
      if (run === true) {
        setRun({ opp: false });
        clearInterval(count);
      }
    }, 1000);
    return () => clearInterval(count);
  };
  useEffect(() => {
    onPending();
  }, [run]);
  return (
    <>
      {run === true && (
        <>
          <OppContainer>
            <OppDiv>
              <Pending />
            </OppDiv>
          </OppContainer>
        </>
      )}
    </>
  );
};

const UserContainer = styled.div`
  display: flex;
  position: absolute;
  width: 49.59vw;
  height: 83.63vh;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  ${(props) =>
    props.wait === true &&
    css`
      & button {
        background: url("/img/already.svg") center no-repeat;
        background-size: 100% 100%;
      }
    `}
  z-index: 5;
`;

const OppContainer = styled.div`
  display: flex;
  position: absolute;
  width: 42.13vw;
  height: inherit;
  justify-content: center;
  align-items: center;
`;

const OppDiv = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 92%;
  justify-content: center;
  background-color: rgba(0, 0, 255, 0.3);
  align-items: center;
  ${(props) =>
    props.wait === true &&
    css`
      & button {
        background: url("/img/already.svg") center no-repeat;
        background-size: 100% 100%;
      }
    `}
  z-index: 5;
`;

const ReadyBtn = styled.button`
  display: flex;
  position: relative;
  width: 14.0625vw;
  height: 3.125vw;
  background: url("/img/ready.svg") center no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  z-index: 1;
  border: none;
`;

const OppLogo = styled(ReadyBtn)`
  background-image: url("/img/oppLogo.svg");
  width: 20vw;

  & p {
    margin: auto;
    color: black;
    font-size: calc((5vw + 5vh) / 6);
    font-family: Neo;
  }
`;

const FillCircle = keyframes`

12.5%{
  border-top-color: white;
}
25%{
  border-right-color: white;
}
37.5%{
  border-bottom-color: white;
}
50%{
  border-left-color: white;
}
62.5%{
  border-top-color:black;
}
75%{
  border-right-color: black;
}
87.5%{
  border-bottom-color: black;
}
100%{
  border-left-color: black;
}


`;

const Pending = styled.span`
  width: 7.5vw;
  height: 7.5vw;
  border: 0.75vw solid white;
  border-top-color: black;
  border-right-color: black;
  border-bottom-color: black;
  border-left-color: black;
  border-radius: 50%;
  border-top-right-radius: -50%;

  animation: ${FillCircle} 0.5s infinite ease-in;
`;
