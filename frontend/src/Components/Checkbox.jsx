import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Checkbox({quesId, quesNo, ansNo, ansId, ansText, onAnswerSelected})
{
    const decideonAnswerSelected = (e)=>{
        if(onAnswerSelected !== undefined)onAnswerSelected(e.target.checked, quesId, ansId, 'r')
    }
    return(<div><input type='checkbox' name = {quesNo} value = {ansNo} onChange={(e)=>{decideonAnswerSelected(e)}}/><label className='ms-3'>{ansText}</label></div>);
}