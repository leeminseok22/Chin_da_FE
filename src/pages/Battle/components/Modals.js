import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Modal from "react-modal";
import JSConfetti from "js-confetti";
import ConfettiCanvas from "react-confetti-canvas";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Modals.css";
import effectSound from "../../../shared/effectSound.js";
import winSound from "../../../audios/WinSE1.mp3";
import loseSound from "../../../audios/LoseSE1.mp3";
import win1Sound from "../../../audios/WinSE2.mp3";
import lose1Sound from "../../../audios/FailSE1.mp3";
import {
  gameSwitch,
  ModalOpen,
  NewQue,
  resModalOpen,
} from "../../../redux/modules/battleFunction.js";

/*QuestionModal*/
export const QuestionModal = () => {
  const resQuest = useSelector((state) => state.battleFunction.resModal.quest);
  const dispatch = useDispatch();
  const queList = useSelector((state) => state.battleFunction.queList);

  const customModalStyles = {
    overlay: {
      background: "#0000006a",
    },
  };

  const allClose = () => {
    dispatch(resModalOpen({ quest: false }));
  };

  return (
    <>
      <Modal className="ModalBox" isOpen={resQuest} style={customModalStyles}>
        <div className="ModalBody">
          <header>
            <h2>Q u e s t i o n</h2>
          </header>
          <div className="ModalContent">
            <div className="qQTitle">{queList.questionTitle}</div>
            <div className="qQue">{queList.question}</div>
          </div>
        </div>
        <img
          className="ExitBtn quest"
          src="/img/X_btn_black_30.svg"
          onClick={() => allClose()}
          alt=""
        />
      </Modal>
    </>
  );
};

export const GameRuleModal = () => {
  const modalRule = useSelector((state) => state.battleFunction.modalOpen.rule);
  const dispatch = useDispatch();
  const customModalStyles = {
    overlay: {
      background: "#0000006a",
    },
  };

  const allClose = () => {
    dispatch(ModalOpen({ rule: false }));
  };

  useEffect(() => {}, [modalRule]);
  return (
     <>
        {modalRule === true && (
           <Modal
              className="ModalBox RuleBox"
              isOpen={modalRule}
              style={customModalStyles}
           >
              <div className="ModalBody">
                 <header className="RuleTitle">
                    <h2>규 칙</h2>
                 </header>
                 <div className="RuleContent">
                    <ol className="RuleList">
                       <li>
                          게임 중 뒤로 가거나 새로 고침 시,
                          <br />
                          방에서 나가지게 되며, 패배처리가 됩니다.
                       </li>
                       <br />
                       <li>제출 가능한 횟수는 총 3번입니다.</li>
                       <br />
                       <li>시간이 끝나면 플레이어 모두 패배처리가 됩니다.</li>
                       <br />
                       <li>
                          코드 작성 시, 기존에 제시한 함수와 변수명을 변경하지
                          마세요. (오답처리가 될 수 있습니다.)
                       </li>
                       <br />
                       <li>
                          출력문을 입력하지 마세요.
                          <p>Python : print()</p>
                          <p>java : System.out.println()</p>

                          <p>javascript : console.log()</p>
                       </li>
                       <br />
                       <p>즐겁게 플레이 해 주세요!</p>
                       <br />
                    </ol>
                 </div>
              </div>
              <img
                 className="RuleExitBtn"
                 src="/img/X_btn_black_30.svg"
                 onClick={() => allClose()}
                 alt=""
              />
           </Modal>
        )}
     </>
  );
};

/*SuccessModal*/
export const SuccessModal = ({ setBbmute }) => {
  const resSuc = useSelector((state) => state.battleFunction.resModal.success);

  const userSound = useSelector((state) => state.user.sound);
  const winEs = effectSound(winSound, userSound.es);

  const dispatch = useDispatch();

  const allClose = () => {
    dispatch(resModalOpen({ success: false, res: true }));
  };

  const muteBb = () => {
    setBbmute(true);
    winEs.play();
    dispatch(gameSwitch(false));

    setTimeout(() => {
      allClose();
    }, 4000);
  };

  React.useEffect(() => {
    resSuc === true && muteBb();
  }, [resSuc]);

  const customModalStyles = {
    overlay: {
      background: "#0000009a",
    },
    content: {
      background: "transparent",
      border: "transparent",
      borderRadius: "5px",
      overflow: "hidden",
    },
  };
  return (
    <>
      <Modal isOpen={resSuc} style={customModalStyles}>
        <img
          className="ExitBtn"
          src="/img/X_btn_black_30.svg"
          onClick={() => {
            allClose();
          }}
          alt=""
        />
        <div className="ConfettiTxt">
          <img src="/img/W.svg" alt="" />
          <img src="/img/I.svg" alt="" />
          <img src="/img/N.svg" alt="" />
        </div>
        <ConfettiCanvas ribbonParticleMass={1} />
        <ConfettiCanvas ribbonParticleDrag={0.05} />
      </Modal>
    </>
  );
};

/*FailModal*/
export const FailModal = ({ setBbmute }) => {
  const userSound = useSelector((state) => state.user.sound);
  const loseEs = effectSound(loseSound, userSound.es);

  const resFail = useSelector((state) => state.battleFunction.resModal.fail);

  const dispatch = useDispatch();

  const allClose = () => {
    dispatch(resModalOpen({ fail: false, res: false }));
  };

  const confetti = new JSConfetti();
  const confettiList = () => {
    confetti.addConfetti({
      emojis: ["😭", "😥"],
      emojiSize: 90,
      confettiNumber: 70,
    });
  };
  const muteBb = () => {
    loseEs.play();
    setBbmute(true);
    dispatch(gameSwitch(false));
    confettiList();
    setTimeout(() => {
      allClose();
    }, 4000);
  };

  React.useEffect(() => {
    resFail === true && muteBb();
  }, [resFail]);

  const customModalStyles = {
    overlay: {
      background: "#0000009a",
    },
    content: {
      background: "transparent",
      border: "transparent",
      borderRadius: "5px",
      overflow: "hidden",
      color: "#fff",
    },
  };

  return (
    <>
      <Modal isOpen={resFail} style={customModalStyles}>
        <img
          className="ExitBtn"
          src="/img/X_btn_black_30.svg"
          onClick={() => {
            allClose();
          }}
          alt=""
        />
        <div className="ConfettiTxt">
          <img src="/img/L.svg" alt="" />
          <img src="/img/O.svg" alt="" />
          <img src="/img/S.svg" alt="" />
          <img src="/img/E.svg" alt="" />
        </div>
      </Modal>
    </>
  );
};

/*Result Modal*/
export const Result = (props) => {
  const userSound = useSelector((state) => state.user.sound);
  const winEs = effectSound(win1Sound, userSound.es);
  const loseEs = effectSound(lose1Sound, userSound.es);
  const { setMbmute, codeRef, opCode } = props;
  const result = useSelector((state) => state.battleFunction.resModal.res);
  const allClose = () => {
    dispatch(ModalOpen({ chat: true, que: false }));
    dispatch(NewQue({ question: "", questionTitle: "", template: "" }));
    codeRef.current = "";
    opCode.current = "";
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (result !== "") {
      if (result === true) {
        winEs.play();
        allClose();
      } else {
        loseEs.play();
        allClose();
      }
    }
  }, [result]);
  const navigate = useNavigate();
  const player = sessionStorage.getItem("username");
  const GoBackMain = () => {
    setMbmute(false);
    navigate("/Selection");
    dispatch(resModalOpen({ res: "" }));
  };
  return (
    <>
      {result !== "" && (
        <>
          <ResultBackground />
          <ResultDiv>
            <SettingWord>RESULT</SettingWord>
            <BlackDiv>
              <ResultEle>{player} 승리</ResultEle>
              {result === true ? (
                <ResultLetterDiv>
                  <LetterNoAni src={"/img/W.svg"} alt="" />
                  <LetterAni src={"/img/I.svg"} alt="" />
                  <LetterNoAni src={"/img/N.svg"} alt="" />
                </ResultLetterDiv>
              ) : (
                <ResultLetterDiv>
                  <LetterNoAni src={"/img/L.svg"} alt="" />
                  <LetterNoAni src={"/img/O.svg"} alt="" />
                  <LetterNoAni src={"/img/S.svg"} alt="" />
                  <LetterSlopeAni src={"/img/E.svg"} alt="" />
                </ResultLetterDiv>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0",
                }}
              >
                <ResultElement>한판 더 하시겠습니까?</ResultElement>
                <h4>게임의 성장을 위해 설문 부탁드립니다!</h4>
                <Link
                  href="https://forms.gle/T3b1j35AW4bcsMJT7"
                  target="_blank"
                >
                  설문조사하러가기
                </Link>
              </div>
              <ReDiv>
                <ResultBtn
                  onClick={() => {
                    dispatch(resModalOpen({ res: "" }));
                    setMbmute(false);
                  }}
                >
                  Yes
                </ResultBtn>
                <ResultBtn onClick={GoBackMain}>No</ResultBtn>
              </ReDiv>
            </BlackDiv>
          </ResultDiv>
        </>
      )}
    </>
  );
};

const Link = styled.a`
  color: darkred;

  &:visited {
    color: darkgoldenrod;
  }
  &:hover {
    color: red;
  }
  &:active {
    color: darkcyan;
  }
`;

const ResultBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.5;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  z-index: 12;
`;
const SettingWord = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc((2vw + 2vh) / 2);
  z-index: 12;
  color: white;
  font-weight: 600;
  width: calc(100% - 5px);
  height: 10%;
  background-color: #5777ce;
  border-top: 2px solid #c0cfff;
  border-left: 2px solid #c0cfff;
  border-right: 2px solid #c0cfff;
  border-bottom: 5px solid black;
`;

const ResultDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 12;
  width: 30vw;
  height: 58vh;
  border: 5px solid black;
  color: white;
`;

const BlackDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: 5%;
  width: calc(100% - 5px);
  height: 100%;
  border-left: 2px solid #fffae3;
  border-right: 2px solid #c1b78e;
  border-bottom: 2px solid #a0935c;
  background-color: #0c1119;
`;

const ResultEle = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  line-height: 7vh;
  font-size: calc((3vw + 3vh) / 2);
  font-weight: 600;
  text-align: center;
`;

const ResultLetterDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10%;
  justify-content: center;
`;

const ReDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5%;
  width: 100%;
  height: 10%;
`;

const ResultElement = styled.div`
  position: relative;
  width: 100%;
  font-size: calc((3vw + 3vh) / 2 - 10px);
  font-weight: 600;
  padding: 10px;
  text-align: center;
`;

const ResultBtn = styled.div`
  position: relative;
  width: 20%;
  font-size: calc((3vw + 3vh) / 2 - 10px);
  font-weight: 600;
  text-align: center;
  padding: 10px;
  :hover {
    background-color: white;
    color: #0c1119;
    border: 2px solid #a0935c;
    border-radius: 5px;
    width: calc(20% - 4px);
  }
`;

const LetterNoAni = styled.img`
  width: calc((5vw + 5vh) / 2);
  height: calc((5vw + 5vh) / 2);
`;

const LetterRotate = keyframes`
0%{
    transform: translateY(0) rotate(0);
}
30%{
    transform: translateY(-20px) rotate(0);
}
40%{
    transform: translateY(-20px) rotate(180deg);
}
50%{
    transform: translateY(-20px) rotate(360deg);
}
80%{
    transform: translateY(0) rotate(360deg);
}
100%{
    transform: translateY(0) rotate(360deg);
}
`;

const LetterAni = styled.img`
  width: calc((5vw + 5vh) / 2);
  height: calc((5vw + 5vh) / 2);
  animation: ${LetterRotate} 2s linear infinite;
`;

const LetterSlope = keyframes`
0%{
    transform-origin: bottom left;
    transform: translateY(5px) rotate(10deg);
}
40%{
    transform-origin: bottom left;
    transform: translateY(5px) rotate(20deg);
}
60%{
    transform-origin: bottom left;
    transform: translateY(5px) rotate(30deg);
}
80%{
    transform-origin: bottom left;
    transform: translateY(5px) rotate(20deg);
}
100%{
    transform-origin: bottom left;
    transform: translateY(5px) rotate(10deg);
}
`;

const LetterSlopeAni = styled.img`
  width: calc((5vw + 5vh) / 2);
  height: calc((5vw + 5vh) / 2);
  animation: ${LetterSlope} 2s linear infinite;
`;
