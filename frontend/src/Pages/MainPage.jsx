import React,{useEffect, useState} from 'react'
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios'
import Question from '../Components/Question';
import NoData from '../Components/NoData';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function MainPage()
{
    const [order,setOrder] = useState(false);
    const [questionData, setQuestionData] = useState([]);
    const [data, setData] = useState();
    const [modal, showModal] = useState(false);
    const[delQuesId, setDelQuesId] = useState(null);

    useEffect(()=>{
        setOrder(false);
        getResults(true);
        getResponseData();
    },[]);

    
    function getResponseData()
    {
        axios.get('http://localhost:8081/getResults')
        .then((res)=>{
            console.log(res);
            let happy_responses = parseInt(res.data[0].happy_cnt);
            let total_responses = parseInt(res.data[0].total_cnt); 
            let unhappy_responses = total_responses - happy_responses;
            setData([
                { id: 0, value: happy_responses, label: 'Happy Customers' , color: 'green'},
                { id: 1, value: unhappy_responses, label: 'Unhappy Customers', color: 'red' },
            ])
        })
        .catch((err)=>console.log(err));
    }

    const showModalBox = (quesId) => 
    {
        showModal(true);
        setDelQuesId(quesId);
    }

    const handleOnClickYes = ()=>
    {
            const value = [delQuesId];
            axios.post('http://localhost:8081/deleteQues', value)
            .then((res)=>{
                console.log(res);
                alert("Succesfully Deleted");
                showModal(false);
                handleDelete();
            }).catch((err)=>console.log(err));
    }

    const handleOnClickCancel = ()=>
    {
        showModal(false);
        setDelQuesId(null);
    }

    const handleDelete = () => {
        getResults(order);  // Toggle refresh state to trigger useEffect
    }

    const toggleOrder = ()=>{
        getResults(order);
        setOrder(!order);
    }

    function getResults(...value)
    {
        axios.post('http://localhost:8081/admin',value)
        .then((res)=>
        {
            console.log(res);
            setQuestionData(res.data);
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    return (
        <>
        {modal?
        <div className='bg-dark w-100 h-100 position-absolute' style={{opacity:'0.9'}}>
            <div className='d-flex justify-content-center align-items-center h-100'>
            <table className='bg-light h-25 p-5'>
                <tr>
                    <td>
                        <h5 className='p-5'>Are you sure you want to delete?</h5>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className='d-flex justify-content-between p-3 gap-2'>
                            <button className='btn btn-danger w-50' onClick={handleOnClickYes}>Yes</button>
                            <button className='btn btn-dark w-50' onClick={handleOnClickCancel}>Cancel</button>
                        </div>
                    </td>
                </tr>
                
                
            </table>
        </div>
        </div>
:''}
        <div className='w-100 d-flex flex-column justify-content-center align-items-center' style={{ marginBottom:"0px"}}>
        <table className="table table-success w-50" style={{marginTop:'100px'}}>
            <thead>
                <tr>
                    <td className='pb-3 pt-4 ps-3'><label className='fw-bolder'>Questions</label></td>
                    <td className='pb-3 pt-4 ps-3'>
                        <div className='d-flex justify-content-end w-100 pe-2'>
                            <Link to="/create"><button className='btn btn-success me-3 w-75'>Create+</button></Link>
                            <button className={`btn ${order?'btn-warning':'btn-dark'}  me-3`} onClick={toggleOrder}>Order</button>
                            <Link to="/results" state={{responseData:data}}><button className='btn btn-primary'>View Results</button></Link>
                            </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                {questionData.length > 0? questionData.map((question, index)=><Question key = {index} quesData={question} onDelete={handleDelete} showMod = {showModalBox}/>): <tr>
        <td colSpan="2"><NoData/></td></tr>}
            </tbody>
        </table>
        <Outlet/>
    </div>
        </>

    );
}