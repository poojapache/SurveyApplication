import React from 'react'


export default function AnswerEdit({ansNo, ansText, handleChange})
{
    return(
        <div className='w-100 pt-2'>
            <label className="pe-2">{'Option '+ansNo}</label>
            <input type="text" defaultValue={ansText} onChange={(e) => handleChange(ansNo, e.target.value)}></input>
        </div>
    );
}