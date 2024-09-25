import React,{useEffect, useRef, useState} from 'react'
import { useParams, useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import AnswerEdit from '../Components/AnswerEdit';

export default function EditPage(){

    const navigate = useNavigate();
    //const { quesNo } = useParams();
    const location = useLocation();
    const { quesData } = location.state || {}; // Access the state passed via Link
    const quesNo = useRef(quesData.quesNo);
    const quesText = useRef(quesData.quesText);
    const [quesType, setQuesType] = useState(quesData.quesType);
    const [answerList, setAnswerList] = useState([]);
    console.log(quesData);

    useEffect(() => {
        if (quesData) {
            setAnswerList(quesData.answerList);
        }
    }, [quesData]);

    const handleAnswerChange = (id, ansText) => {
        setAnswerList((prevAnswers) =>
            prevAnswers.map((answer) =>
                answer.ansNo === id ? { ...answer, ansText } : answer
            )
        );
    };


    const handleUpdate = ()=>{
        console.log('In handleUpdate');
        let values = {
            quesId:quesData.quesId,
            quesNo:quesNo.current.value,
            quesText:quesText.current.value,
            quesType:quesType,
            answerList:answerList
        };
        console.log(values);
        axios.post('http://localhost:8081/updateQues', values)
        .then((res)=>{
            console.log(res);
            alert("Question Updated!");
            navigate('/admin');
        })
        .catch((err)=>console.log(err));
    }
  return (
    <div className='w-100 vh-100 d-flex justify-content-center align-items-center p-2'>
    <table className="table table-success w-50 p-5">
        <thead>
            <tr>
                <td colSpan="2"><h1>Edit the table</h1></td>
            </tr>
        </thead>
        <tbody className='p-5'>
            <tr>
                <td>Question No</td>
                <td className='pe-5'><input ref={quesNo} type="text" className="w-100 p-2" defaultValue={quesData.quesNo}></input></td>
            </tr>
            <tr>
                <td>Question Text</td>
                <td className='pe-5'><input ref={quesText} type="text" className="w-100 p-2" defaultValue={quesData.quesText}></input></td>
            </tr>
            <tr>
                <td>Question Type</td>
                <td className='pe-5'>
                    <div className='d-flex gap-3 justify-content-center w-100 p-2'>
                        <input name="quesType" value="R" type="radio" checked={quesType === 'R'} onChange={() => setQuesType('R')}></input><label>Radio</label>
                        <input name="quesType" value="C" type="radio" checked={quesType === 'C'} onChange={() => setQuesType('C')}></input><label>Checkbox</label>
                    </div>
                    {/* <input type="text" className="w-100 p-2" defaultValue={quesData.quesType}></input> */}
                </td>
            </tr>
            <tr>
                <td>Options</td>
                <td>
                    {answerList.map((answer, index)=>(<AnswerEdit key={index} ansNo={answer.ansNo} ansText={answer.ansText} handleChange={handleAnswerChange}/>))}
                </td>
            </tr>
            <tr>
                <td colSpan="2" className='pe-5 ps-5 pb-3 pt-3'><button className='btn btn-success w-100' onClick={handleUpdate}>Update</button></td>
            </tr>
        </tbody>
    </table>
    </div>
    );
}