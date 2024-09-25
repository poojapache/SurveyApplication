import React from 'react';

function AnswerAdd({ ansNo, handleChange })
{
return(
                                <tr>
                                    <td>
                                        <label className='w-100'>{`Answer ${ansNo}`}</label>
                                    </td>
                                    <td><input type='text' onChange={(e) => handleChange(ansNo, e.target.value)}/></td>
                                </tr>
);
}
export default AnswerAdd;