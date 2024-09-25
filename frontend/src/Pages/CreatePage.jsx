import React,{useEffect, useState} from 'react'
import axios from 'axios';
import AnswerAdd from '../Components/AnswerAdd'
import { useNavigate } from 'react-router-dom';

export default function CreatePage()
{
    const navigate = useNavigate();
    const [answerList, setAnswerList] = useState([]);
    const [disableAdd, setDisableAdd] = useState(false);
    const [disableDelete, setDisableDelete] = useState(false);
    const [values,setValues] = useState({
        quesId:'',
        quesNo:'',
        quesText:'',
        quesType:'',
        optionList:[]
    })

    useEffect(() => {
        addAnswer();
      }, []);

    const addAnswer = () => {
        const newAnswer = { id: answerList.length + 1, ansText: '' };
        setAnswerList([...answerList, newAnswer]);
      };

    const handleAnswerChange = (id, ansText) => {
        setAnswerList(
          answerList.map((answer) => (answer.id === id ? { ...answer, ansText } : answer))
        );
      };

    const addBtnOnClick = (e)=>{
        e.preventDefault();
        console.log(answerList.length);
        if(answerList.length < 4 )
        {
            setDisableAdd(false);
            addAnswer();
            if(answerList.length == 3)setDisableAdd(!disableAdd);
            if(answerList.length >= 1)setDisableDelete(true);
            else setDisableDelete(false);
        }
        
    }
    const deleteBtnOnClick = (e)=>{
        e.preventDefault();
        if(answerList.length > 1)
        {
            setDisableDelete(true);
            setAnswerList(answerList.slice(0, answerList.length - 1));
            if(answerList.length == 2)setDisableDelete(false);
            if(answerList.length <= 4)setDisableAdd(false);
        }
        else{
            setDisableDelete(false);
        }
        
    }

    const onClickSubmit = (e)=>{
        e.preventDefault();
        values.optionList = answerList;
        console.log(values);
        axios.post('http://localhost:8081/insertQuesAns', values)
        .then((res)=>{
                setValues({
                    quesId:'',
                    quesNo:'',
                    quesText:'',
                    quesType:'',
                    optionList:[]});
            console.log("Question and Answers successfully created");
            console.log(res);
            if(res.data.retCode !== 0) alert(res.data.Message);
            else alert("Data inserted successfully")
            navigate('/admin');

        })
        .catch((err)=>console.log(err));
    }

    return(
        <div className='w-100 vh-100 d-flex justify-content-center align-items-center p-2'>
            <table className="table table-success w-50 p-5">
                <thead>
                    <tr>
                        <td colSpan="2"><h1>Add new question</h1></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <label>Question No</label>
                        </td>
                        <td><input type="text" onChange={(e)=>setValues({...values, quesNo:e.target.value})}></input></td>
                    </tr>
                    <tr>
                        <td>
                            <label>Question Text</label>
                        </td>
                        <td><input type="text" onChange={(e)=>setValues({...values, quesText:e.target.value})}></input></td>
                    </tr>
                    <tr>
                        <td>
                            <label>Question Type</label>
                        </td>
                        <td>
                            <div className='d-flex gap-3 justify-content-center'>
                                <input name="quesType" value="R" type="radio" onChange={(e)=>setValues({...values, quesType:e.target.value})}></input><label>Radio</label>
                                <input name="quesType" value="C" type="radio" onChange={(e)=>setValues({...values, quesType:e.target.value})}></input><label>Checkbox</label>
                            </div>
                        </td>
                        {/* <td><input type="text" onChange={(e)=>setValues({...values, quesType:e.target.value})}></input></td> */}
                    </tr>
                            {
                                answerList.map
                                (
                                    (answer, index) => (
                                        <AnswerAdd
                                        key={index}
                                        ansNo={answer.id}
                                        handleChange={handleAnswerChange}/>
                                    )
                                )
                            }
                    <tr>
                        <td colSpan="2">
                            <div className='d-flex justify-content-between ps-5 pe-5'>
                                    <button className={`btn ${disableDelete?'btn-danger':'btn-dark'} w-25`} onClick={deleteBtnOnClick}>Delete</button>
                                    <button className={`btn ${!disableAdd?'btn-success':'btn-dark'} w-25`} onClick={addBtnOnClick}>Add</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2"><button className='btn btn-success' onClick={onClickSubmit}>Submit</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}