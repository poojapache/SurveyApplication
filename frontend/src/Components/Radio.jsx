import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Radio({quesId, quesNo, ansId, ansNo, ansText, onAnswerSelected})
{
    const decideonAnswerSelected = (e)=>{
        if(onAnswerSelected !== undefined)onAnswerSelected(e.target.checked, quesId, ansId, 'r')
    }
    return(<div><input type='radio' name = {quesNo} value = {ansNo} onChange={(e)=>{decideonAnswerSelected(e)}}/><label className='ms-3'>{ansText}</label></div>);
}