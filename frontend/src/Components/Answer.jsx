import React from 'react';
import Radio from './Radio';
import Checkbox from './Checkbox';
import 'bootstrap/dist/css/bootstrap.min.css'

function Answer({quesId, quesType, quesNo, ansId, ansNo, ansText, onAnswerSelected})
{
    return(
        <div className='p-2'>
            {quesType == 'R'?<Radio quesId = {quesId} quesNo={quesNo} ansId = {ansId} ansNo={ansNo} ansText={ansText} onAnswerSelected={onAnswerSelected}/>: <Checkbox quesId = {quesId} quesNo={quesNo} ansId = {ansId} ansNo={ansNo} ansText={ansText} onAnswerSelected={onAnswerSelected}/>}
        </div>
        
    )
}
export default Answer;