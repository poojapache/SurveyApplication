import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import Answer from './Answer';

export default function Question({quesData, onDelete, showMod})
{
    const [option, showOption] = useState(false);

    const handleView = ()=>{
        showOption(!option);
    }
    const handleDelete = ()=>{
        const value = [quesData.quesId];
        showMod(value);
        // const value = [quesData.quesId];
        // axios.post('http://localhost:8081/deleteQues', value)
        // .then((res)=>{
        //     alert("Succesfully Deleted");
        //     onDelete();
        // }).catch((err)=>console.log(err));
    }
    return(
        <tr>
            <td><label>{quesData.quesNo}</label></td>
            <td className='d-flex flex-column'>
                <div className='d-flex flex-row justify-content-between align-items-end'>
                    <div className='w-100'>
                        <p>{quesData.quesText}</p>
                    </div>
                    <div className='w-100 d-flex justify-content-end'>
                        <button onClick={handleView} className='btn btn-warning me-2' style={{width:'80px'}}>View</button>
                        <Link to={`/edit/${quesData.quesNo}`} state={{ quesData }} className='btn btn-primary me-2' style={{width:'80px'}}><button className='btn btn-primary'>Edit</button></Link>
                        <button onClick={handleDelete} className='btn btn-danger me-2' style={{width:'80px'}}>Delete</button>
                    </div>
                </div>
                <div className={`${option?'d-flex flex-column justify-content-start align-items-start pe-2':'d-none'}`}>
                    <ul className='w-100 d-flex flex-column justify-content-start align-items-start list-unstyled'>
                        {quesData.answerList.map((element, index)=>(<li key = {index}><Answer quesId = {quesData.quesId} quesType = {quesData.quesType} quesNo = {quesData.quesNo} ansId = {element.ansId} ansNo = {element.ansNo} ansText = {element.ansText} /></li>))}
                    </ul>
                </div>
            </td>
        </tr>
    );
}