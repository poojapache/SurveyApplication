import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import QuestionRetrieve from '../Components/QuestionRetrieve';
import { v4 as uuid } from "uuid";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import NoData from '../Components/NoData';

export default function UserPage() {
    const [itemList, setItemList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    let userResponseList = [];
    let sliderRef = useRef(null);

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        const value = true;
        axios.post('http://localhost:8081/admin', value)
            .then((res) => {
                const questions = res.data;
                console.log(questions);
                setItemList(res.data);
            })
            .catch((err) => console.log(err));
    }

    const onAnswerSelected = (checked, quesId, ansId, ansType) => {
        let index = userResponseList.findIndex((e) => e.quesId === quesId);
        if (checked) {
            if (ansType === 'r' && userResponseList.length > 0 && index > -1) userResponseList.splice(index, 1);
            userResponseList.push({ quesId, ansId });
        } else userResponseList.splice(index, 1);
    }

    const onClickSubmit = () => {
        // New unique id
        const unique_id = uuid();
        // Get first 8 characters using slice
        const user_id = unique_id.slice(0, 8);

        let values = [];
        userResponseList.map((e) => {
            values.push({
                userId: user_id,
                quesId: e.quesId,
                ansId: e.ansId,
            });
        });

        axios.post('http://localhost:8081/insertResponse', values)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.log(err));
        setItemList([]);
        getData();
        setRefresh(!refresh);
    }

    const next = () => {
        sliderRef.slickNext();
    };

    const previous = () => {
        sliderRef.slickPrev();
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current) => setCurrentSlide(current)
    };

    const userForm = (<div className='d-flex justify-content-between align-items-center flex-column w-100 p-5'>
    <h1>Please answer the following questions</h1>
    <Slider ref={slider => { sliderRef = slider }} {...settings} className='w-100 h-100'>
        {itemList.map((element, index) => (
            <div key={index} className='bg-success rounded p-5 bg-opacity-50 mb-3'>
                <QuestionRetrieve 
                    quesId={element.quesId} 
                    quesNo={element.quesNo} 
                    quesText={element.quesText} 
                    quesType={element.quesType} 
                    answerList={element.answerList} 
                    onAnswerSelected={onAnswerSelected}
                />
            </div>
        ))}
    </Slider>
    <div className="w-100 d-flex justify-content-between m-5" style={{ textAlign: "center" }}>
        <button 
            className={`btn ${currentSlide === 0 ? 'btn-dark' : 'btn-success'} w-25`} 
            onClick={previous} 
            disabled={currentSlide === 0}>
            Previous
        </button>
        <button 
            className={`btn ${currentSlide === itemList.length - 1 ? 'btn-dark' : 'btn-success'} w-25`} 
            onClick={next} 
            disabled={currentSlide === itemList.length - 1}>
            Next
        </button>
    </div>
    <button className='btn btn-outline-success w-50 m-5 p-2' onClick={onClickSubmit}>Submit</button>
</div>);
    return itemList.length > 0?  userForm : <NoData/>
}
