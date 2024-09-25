import './App.css';
import React,{useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom' 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import MainPage from './Pages/MainPage';
import data from './Data/questionData.json'
import CreatePage from './Pages/CreatePage';
import EditPage from './Pages/EditPage';
import ResultPage from './Pages/ResultPage';
import UserPage from './Pages/UserPage';

function App() {
  console.log(data);
  let initialQuestions = {
    data:data
  };
  console.log(initialQuestions);

  useEffect(()=>{
    axios.get('http://localhost:8081/deleteInitialSeed')
    .then((res)=>{
      console.log('Successfuly deleted');
    })
    .catch((err)=>console.log(err));

    axios.post('http://localhost:8081/seedQues', initialQuestions)
    .then((res)=>{
      console.log(res);
    })
    .catch((error)=>{
      console.log(error);
    })
  },[]);
  return (
    <div className="App w-100">
    <BrowserRouter>
    <Routes>
      <Route path='/admin' element = {<MainPage/>}></Route>
      <Route path='create' element = {<CreatePage/>}></Route>
      <Route path='results' element = {<ResultPage/>}></Route>
      <Route path='edit/:quesNo' element = {<EditPage/>}></Route>
      <Route path='/user' element = {<UserPage/>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
