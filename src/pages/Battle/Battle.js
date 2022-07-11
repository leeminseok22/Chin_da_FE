import React from "react";
import styled, { css, keyframes } from "styled-components";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/*COMPONENTS*/
import AceEditorPlayer from "./components/AceEditorPlayer";
import AceEditorOpp from "./components/AceEditorOpp";
import Control from "./Control";
import ChatBox from "./components/ChatBox";
import ProgressBar from "./components/ProgressBar";
import Alert from "./components/Alert";
import Result from "./components/Result";
// import CountDown from './components/CountDown';
// import Accordion from './components/Accordion';
import { QuestionModal, SuccessModal, FailModal } from "./components/Modals";

import Peer from "peerjs";


Modal.setAppElement("#root");

const Battle = () => {
  const selected = useSelector((state) => state.user.selected)
  const navigate = useNavigate();
  const [showQuestionModal, setShowQuestionModal] = React.useState();
  const [showSuccessModal, setShowSuccessModal] = React.useState();
  const [showFailModal, setShowFailModal] = React.useState();

  const [mode, setMode] = React.useState("java");
  const [theme, setTheme] = React.useState("monokai");
  const [startTemp, setStartTemp] = React.useState("");

  //timer,progressBar
  const [runTimer, setRunTimer] = React.useState("false");
  const [timeSetting, setTimeSetting] = React.useState(300);
  const timerValue = {
    Time: timeSetting,
    Active: runTimer,
  };

  const SetTime = () => {
    if (selected.level === "0") {
      setTimeSetting(300);
    } else if (selected.level === "1") {
      setTimeSetting(600);
    } else if (selected.level === "2") {
      setTimeSetting(900);
    } else {
      setTimeSetting(300);
    }
  }
  React.useEffect(() => {
    SetTime();
  }, [])

  //toastify alert
  const [runAlert, setRunAlert] = React.useState(false);
  const [mesAlert, setMesAlert] = React.useState("FAIL")

  //서버에서 받아오는 기본 형태들
  //    const JsDefault = `function solution(num) {
  //    var answer = '';
  //       return answer;
  // }`;
  //    const JavaDefault = `public String solution(int num) {
  //    String answer = '';
  //       return answer;
  // }`
  //    const PythonDefault = `def solution(num):
  //    answer = ''
  //    return answer`;
  //    const DefaultTemp = "//함수와 변수를 임의로 변경하지 마세요" + `\n` + JavaDefault;
  //    const DefaultTempTwo = "//함수와 변수를 임의로 변경하지 마세요" + `\n` + JavaDefault;

  //카메라 창 열고 닫기
  const [userCamSlide, setUserCamSlide] = React.useState(true);
  const [opCamSlide, setOpCamSlide] = React.useState(true);

  const openUserCam = () => {
    if (userCamSlide) {
      setUserCamSlide(false);
    } else {
      setUserCamSlide(true);
    }
  };
  const openOpCam = () => {
    if (opCamSlide) {
      setOpCamSlide(false);
    } else {
      setOpCamSlide(true);
    }
  };

  //채팅 열고 닫기
  const [chatOpen, setChatOpen] = React.useState(false);
  const openChat = () => {
    if (chatOpen) {
      setChatOpen(false);
    } else {
      setChatOpen(true);
    }
  };

  //문제 열고 닫기
  const [queOpen, setQueOpen] = React.useState(true);
  const openQue = () => {
    if (queOpen) {
      setQueOpen(false);
    } else {
      setQueOpen(true);
    }
  };

  //결과창 열기
  const [rOpen, setROpen] = React.useState(false);

  const BackToMain = () => {
    navigate(`/Main`)
  }

  //아이템 사용 불가 메세지
  const NoItemSys = () => {
    setMesAlert("아직 패치 중")
    setRunAlert(true)
  }

  //Peer
  const [peerId, setPeerId] = React.useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = React.useState("");
  const remoteVideoRef = React.useRef(null);
  const peerInstance = React.useRef(null);
  const currentUserVideoRef = React.useRef(null);

  React.useEffect(() => {
    const peer = new Peer();
    //제일 처음 peer가 만들어지면서 랜덤한 id가 만들어짐
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({/*audio: true,*/ video: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      })
    })

    peerInstance.current = peer;
    //외부로 peer 선언해주려고
  }, [])

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({/*audio: true,*/ video: true }, (mediaStream) => {
      //현재 내 화면
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        // Show stream in some video/canvas element.
        // 상대방 영상 받아오는 부분
        // 두개 같이 써줘야 작동함
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    })
  }

  console.log(peerId)

  return (
    <Container>
      <Alert runAlert={runAlert} setRunAlert={setRunAlert} mesAlert={mesAlert} />
      <HeadPart>
        <TimerDiv>
          <ProgressBar value={timerValue} />
        </TimerDiv>
        <BtnDiv>
          <BtnOnOff onClick={openQue} change={queOpen}>문제</BtnOnOff>
          <BtnOnOff onClick={openChat} change={chatOpen}>채팅</BtnOnOff>
          <BtnOnOff onClick={NoItemSys}>아이템</BtnOnOff>
          <ExitBtn onClick={BackToMain}>나가기</ExitBtn>
        </BtnDiv>
      </HeadPart>
      <BodyPart>
        <UserDiv>
          <AceEditorPlayer mode={mode} theme={theme} />
          <UserCamDiv>
            <CamBar>
              <span>Player1</span>
              <CamIcon src={"/img/camIcon.svg"} alt="" onClick={openUserCam} />
            </CamBar>
            {userCamSlide && <Cam>
              <video style={{width:"100%", maxWidth:"100%", height:"auto"}} ref={currentUserVideoRef} />
            </Cam>
            }
          </UserCamDiv>
          <SubmitBtn>제&nbsp;&nbsp;&nbsp;&nbsp;출</SubmitBtn>
        </UserDiv>
        <OpponentDiv>
          {queOpen && (
            <QueDiv queOpen={queOpen} chatOpen={chatOpen}>
              <QueHead>Question</QueHead>
              <QueBox></QueBox>
            </QueDiv>
          )}
          {chatOpen && (
            <ChatingDiv>
              <ChatHead>Chatting</ChatHead>
              <ChatBox
              // id={channelId}
              />
            </ChatingDiv>
          )}
          <CodeDiv queOpen={queOpen} chatOpen={chatOpen}>
            <AceEditorOpp mode={mode} theme={theme} />
          </CodeDiv>
          <OpCamDiv>
            <CamBar>
              <span>Player2</span>
              <CamIcon src={"/img/camIcon.svg"} alt="" onClick={openOpCam} />
            </CamBar>
            {opCamSlide && <Cam>
              <video style={{width:"100%", maxWidth:"100%", height:"auto"}} ref={remoteVideoRef} />
            </Cam>
            }
          </OpCamDiv>
        </OpponentDiv>
      </BodyPart>
      {showQuestionModal && <QuestionModal />}
      {showSuccessModal && <SuccessModal />}
      {showFailModal && <FailModal />}
      {rOpen && <Result setROpen={setROpen} />}

      <Control
        setRunTimer={setRunTimer}
        setTimeSetting={setTimeSetting}
        setShowQuestionModal={setShowQuestionModal}
        setShowSuccessModal={setShowSuccessModal}
        setShowFailModal={setShowFailModal}
        setRunAlert={setRunAlert}
        setROpen={setROpen}
        setMesAlert={setMesAlert}
        remotePeerIdValue={remotePeerIdValue}
        setRemotePeerIdValue={setRemotePeerIdValue}
        call={call}
        peerId={peerId}
      />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  width: 94vw;
  height: 92vh;
`;

const HeadPart = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 7vh;
`;

const TimerDiv = styled.div`
  width: 54vw;
  height: 100%;
  margin-right: 1.875vw;
`;

const BtnDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
height: 100%;
width: 45.125vw;
`;

const BattleBtnAni = keyframes`
0% {
  transform: translateY(0);
}
25%{
  transform: translateY(-5px);
}
50%{
  transform: translateY(0);
}
75%{
  transform: translateY(5px);
}
100% {
  transform: translateY(0px);
}
`

const BtnOnOff = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-size: calc((3vh + 3vw)/4);
color : white;
width: 13.5%;
height: 100%;
${(props) => {
    if (props.change) {
      return css`
        background-image: url(/img/questionBtnBlack.svg);
        border: 2px inset #C1B78E;
        border-radius: 10px;
      `;
    }
    return css`
      background-image: url(/img/questionBtnBlue.svg);
      border: 2px inset #5777CE;
      border-radius: 10px;
    `;
  }}
background-position: center;
background-repeat: no-repeat;
background-size: contain;
animation: ${BattleBtnAni} 3s 0.5s linear infinite;
`;

const ExitBtn = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-size: calc((3vh + 3vw)/4);
color : white;
width: 30%;
height: 100%;
background-image: url(/img/ExitBattleBtn.svg);
background-position: center;
background-repeat: no-repeat;
background-size: contain;
animation: ${BattleBtnAni} 3s linear infinite;
border: 2px inset #5777CE;
border-radius: 10px;
`;

const BodyPart = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 2vh;
  width: 100%;
  height: 100%;
`;

const UserDiv = styled.div`
  width: 56.5%;
  height: 100%;
  margin-right: 1.875vw;
  border-radius: 5px;
  border-top: 7px solid #FFFAE3;
  border-left: 7px solid #FFFAE3;
  border-right: 7px solid #C1B78E;
  border-bottom: 7px solid #A0935C;
`;

const UserCamDiv = styled.div`
  position: absolute;
  left: 37.6vw;
  top: 9.1vh;
  height: 22.6vh;
  width: 14vw;
`;

const OpCamDiv = styled.div`
  position: absolute;
  right: -2.1vw;
  top: 8.9vh;
  height: 22.6vh;
  width: 14vw;
`;
const CamBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 30%;
  width: 85%;
  height: 20%;
  background-color: #5777CE;
  color: white;
  font-size: calc((2vh + 2vw) / 2);
  opacity: 0.8;
  border: 3px solid black;
`;

const CamIcon = styled.img`
  width: calc((2vh + 2vw) / 2);
  height: calc((2vh + 2vw) / 2);
`;

const Cam = styled.div`
  display: flex;
  width: 85%;
  height: 80%;
  background-color: white;
  border-left: 3px solid black;
  border-right: 3px solid black;
  border-bottom: 3px solid black;
`;

const SubmitBtn = styled.button`
  width: 100%;
  height: 7%;
  font-size: calc((5vh + 5vw) / 4);
  font-weight: 500;
  font-family: "Neo";
  background-color: #5777CE;
  opacity: 1;
  color: white;
  z-index: 4;
  border-top: 3px solid #C0CFFF;
  border-left: 3px solid #C0CFFF;
  border-right: 5px solid #A2B7ED;
  border-bottom: 4px solid #A2B7ED;
`;

const OpponentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 102.1%;
  width: 45.125vw;
  margin : 0;
  padding: 0;
`;

const ChatingDiv = styled.div`
  width: 100%;
  height: 36%;
  border: 5px solid black;
`;
const ChatHead = styled.div`
  display: flex;
  align-items: center;
  width: 98%;
  height: 15%;
  color: white;
  font-size: calc(((2vh + 2vw) / 2.5));
  padding-left: 10px;
  background-color: #5777CE;
  border-top: 4px solid #C0CFFF;
  border-left: 6px solid #C0CFFF;
  border-bottom: 4px solid black;
`;
const QueDiv = styled.div`
  width: 100%;
  ${(props) => {
    if (props.queOpen && !props.chatOpen) {
      return css`
        height: 60%;
      `;
    } else if (props.queOpen && props.chatOpen) {
      return css`
          height: 36%;
        `;
    }
  }}
  margin-bottom: 2vh;
  border: 5px solid black;

`;
const QueHead = styled.div`
  display: flex;
  align-items: center;
  width: 98%;
  height: 4.4vh;
  color: white;
  font-size: calc(((2vh + 2vw) / 2.5));
  padding-left: 10px;
  background-color: #5777CE;
  border-top: 4px solid #C0CFFF;
  border-left: 6px solid #C0CFFF;
  border-bottom: 4px solid black;
`;
const QueBox = styled.div`
width: 98.5%;
height: 88%;
margin: 0;
background-color: #111823;
border-right: 6px solid #A0935C;
border-left: 6px solid #FFFAE3;
border-bottom: 6px solid #A0935C;
`;

const CodeDiv = styled.div`
width: 99%;
${(props) => {
    if (props.queOpen && !props.chatOpen) {
      return css`
        height: 35.5%;
      `;
    } else if (props.queOpen && props.chatOpen) {
      return css`
          height: 19.5%;
        `;
    } else if (!props.queOpen && props.chatOpen) {
      return css`
          height: 60%;
        `;
    } else {
      return css`
      height: 100%;
    `;
    }
  }}
display: flex;
justify-content: center;
align-items: center;
border-radius: 0 0 5px 5px;
border-top: 7px solid #FFFAE3;
border-left: 7px solid #FFFAE3;
border-right: 7px solid #C1B78E;
border-bottom: 7px solid #A0935C;
`;

export default Battle;