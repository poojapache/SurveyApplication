import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
const PORT = 8081;
const DATABASE = 'surveyapp';

//DB creation

const dbconnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:DATABASE,
    port:5306
})

//API to seed the database
app.post('/seedQues',(req, res)=>{
let values = [];
req.body.data.map((quesObj)=>{
values.push(
        [
            quesObj.quesNo,
            quesObj.quesText,
            quesObj.quesType
        ]
    )
});
const sql = 'INSERT INTO QUESTIONS(ques_no, ques_text, ques_type) VALUES ?';
dbconnection.query(sql, [values], (err, result)=>{
    if(err)
    {
        console.log(err);
        return res.json({"Message":"Error on server side"});
    }
    return res.json(result);
});

});

//API to insert question into DB
app.post('/insertQues',(req, res)=>{
    const values = [
        req.body.quesNo,
        req.body.quesText,
        req.body.quesType
    ]
    const sql = 'INSERT INTO QUESTIONS(ques_no, ques_text, ques_type) VALUES (?)';
    dbconnection.query(sql, [values], (err, result)=>{
        if(err)
        {
            console.log(err);
            return res.json({"Message":"Error on server side"});
        }
        return res.json(result);
    });
    
    });

//API to insert answer options into database
app.post('/insertAns',(req, res)=>{
    let values = [];
    const quesId = req.body.quesId;
    console.log(req.body.data);
    req.body.optionList.map((ansObj)=>{
    values.push(
            [
                ansObj.ansNo,
                ansObj.ansText,
                quesId
            ]
        )
    });
    const sql = 'INSERT INTO OPTIONS(ans_no, ans_text, ques_id) VALUES ?';
    dbconnection.query(sql, [values], (err, result)=>{
        if(err)
        {
            console.log(err);
            return res.json({"Message":"Error on server side"});
        }
        return res.json(result);
    });
    
    });

//APIt to delete initial questions before seeding
app.get('/deleteInitialSeed',(req, res)=>{
    const sql = 'DELETE FROM QUESTIONS';
    dbconnection.query(sql, (err, result)=>{
        if(err)return res.json({"Message":"Error o server side"});
        return res.json(result);
    })
});

//API to fetch all questions from database
app.post('/admin',(req, res)=>{
    let order = false;
    console.log(req.body);
    if(req.body.length > 0)order = req.body[0];
    let sql = '';
    if(order===false)sql = 'SELECT a.id quesId, a.ques_no, a.ques_text, a.ques_type, b.id ansId, b.ans_no, b.ans_text, b.ques_id FROM questions a, options b WHERE a.id = b.ques_id ORDER BY ques_no';
    else sql = 'SELECT a.id quesId, a.ques_no, a.ques_text, a.ques_type, b.id ansId, b.ans_no, b.ans_text, b.ques_id FROM questions a, options b WHERE a.id = b.ques_id';
    console.log(sql);
    dbconnection.query(sql, (err, result)=>{
        if(err)return res.json({"Message":"Error on server side"});
        //console.log(result);
        let options = [];
        let questions = [];
        result.map((element)=>{
            let index = questions.findIndex((e3)=>e3.quesId == element.quesId)
            console.log(index);
            if(index <= -1)
            {
                questions.push({
                    quesId:element.quesId,
                    quesNo:element.ques_no,
                    quesText:element.ques_text,
                    quesType:element.ques_type,
                    answerList:[{
                            ansId:element.ansId,
                            ansNo:element.ans_no,
                            ansText:element.ans_text
                        }]
                })
            }
            else{
                questions[index].answerList.push({
                    ansId:element.ansId,
                    ansNo:element.ans_no,
                    ansText:element.ans_text
                });
            }
            
        console.log(options);
        });
        console.log(questions);
        return res.json(questions);
    })
});

//API to retrieve questions and corresponding options
// app.get('/getQues',(req,res)=>{
//     const sql = 'SELECT a.id quesId, a.ques_no, a.ques_text, a.ques_type, b.id ansId, b.ans_no, b.ans_text, b.ques_id FROM questions a, options b WHERE a.id = b.ques_id ORDER BY ques_no';
//     dbconnection.query(sql, (err, result)=>{
//         if(err)return res.json({"Message":"Error on Server side"});
//         return res.json(result);
//     })
//     });

//API to update the given question
app.post('/updateQues',(req, res)=>{
    // const values = [
    //     req.body.quesNo,
    //     req.body.quesText,
    //     req.body.quesType,
    //     req.body.quesId,
    //     req.body.answerList
    // ];
    // const sql = 'UPDATE QUESTIONS SET ques_no = ?, ques_text = ?, ques_type = ? WHERE id = ?';
    // dbconnection.query(sql, values, (err, result)=>{
    //     if(err)
    //     {
    //         console.log(err);
    //         return res.json({"Message":"Error on server side"});
    //     }
    //     return res.json(result);
    // });

    console.log('In server....request');
    console.log(req.body);
    const values =  {
        "quesId":parseInt(req.body.quesId,10),
        "quesNo":parseInt(req.body.quesNo, 10),
        "quesText":req.body.quesText,
        "quesType":req.body.quesType,
        "optionList":req.body.answerList
    }
    console.log(values);
    const jsonData = JSON.stringify(values);
    const sql = 'SELECT UpdateQuestionsAndAnswers(?) AS resp';

    dbconnection.query(sql, [jsonData], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ "Message": "Error on server side" });
        }
        const resp = result[0].resp;
        if (resp === 0) {
            return res.json({ "Message": "Question updated successfully" });
        } else {
            return res.json({ "Message": "Failed to update the question" });
        }
    });
});

    //API to delete the question
    app.post('/deleteQues',(req,res)=>{
        const values = req.body;
        console.log('Request for delete');
        console.log(req.body);
        const sql = 'DELETE FROM QUESTIONS WHERE id = ?';
        dbconnection.query(sql, values, (err, result)=>{
            if(err)
            {
                console.log(err);
                return res.json({"Message":"Error on server side"});
            }
            return res.json(result);
    })
    });

    // API to insert question and answer both to the table
    app.post('/insertQuesAns',(req, res)=>{
        
        const values =  {
            "quesNo":parseInt(req.body.quesNo, 10),
            "quesText":req.body.quesText,
            "quesType":req.body.quesType,
            "optionList":req.body.optionList
        }
        console.log(values);
        const jsonData = JSON.stringify(values);
        const sql = 'SELECT InsertQuestionsAndAnswers(?) AS result';
    
        dbconnection.query(sql, [jsonData], (err, result) => {
            console.log(result);

            if (result && result[0] && result[0].result === 1) {
                return res.json({"retCode":1, "Message": "Insert successful"});
            } else {
                console.log(result);
                return res.json({"retCode":0, "Message": "Failed to insert"});
            }
            // console.log(result[0].result.status);
            //return res.json({"retCode":result[0].result.error_code,"Message":result[0].result.error_message});
        });
    });


    // app.post('/insertQuesAns', (req, res) => {
    //     const values = {
    //         "quesNo": parseInt(req.body.quesNo, 10),
    //         "quesText": req.body.quesText,
    //         "quesType": req.body.quesType,
    //         "optionList": req.body.optionList
    //     };
    //     console.log(values);
    //     const jsonData = JSON.stringify(values);
    //     const sql = 'CALL InsertQuestionsAndAnswersTransaction(?, @result)';
    
    //     dbconnection.query(sql, [jsonData], (err, result) => {
    //         console.log(err);
    //         console.log('**********************************');
    //         console.log(result);
    //         console.log('-------------------------------------');
    //         // if (err) {
    //         //     console.log(err);
    //         //     return res.json({ "retCode": 0, "Message": "Failed to insert" });
    //         // }
    
    //         // Fetch the result from the session variable
    //         dbconnection.query('SELECT @result AS result', (err, rows) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.json({ "retCode": 0, "Message": "Failed to insert" });
    //             }
    //             console.log(rows);
    
    //             const procedureResult = JSON.parse(rows[0].result);
    //             console.log(procedureResult);
    //             if (procedureResult.status === 'error') {
    //                 return res.json({ "retCode": 1, "Message": procedureResult.error_message });
    //             } else {
    //                 return res.json({ "retCode": 0, "Message": "Insert successful" });
    //             }
    //         });
    //     });
    // });
    

    //API to insert user response
    app.post('/insertResponse', (req, res)=>{
        let values = [];
        req.body.map((responseObj)=>{
            values.push(
                [
                    responseObj.userId,
                    responseObj.quesId,
                    responseObj.ansId
                ]
            )
        });
        console.log(values);
        const sql = 'INSERT INTO response(user_id, ques_id,ans_id) VALUES ?';
        dbconnection.query(sql, [values],(err, result)=>{
            if(err){
                console.log(err);
                return res.json({"Message":"Error on server side"});
            }
            return res.json(result);
        })
    });

    app.get('/getResults',(req, res)=>{
        console.log('In server');
        const sql = `SELECT COUNT(*) AS total_cnt, SUM(
            CASE WHEN TRIM(b.ques_text) = ? AND TRIM(c.ans_text) = ? THEN 1
            ELSE 0
            END
            ) AS happy_cnt
            FROM response a, questions b, options c
            WHERE a.ques_id = b.id
            AND a.ans_id = c.id;`;
            dbconnection.query(sql,['How was your day?','Good'],(err, result)=>{
                if(err)
                    {
                        console.log(err);
                        return res.json({"Message":"Error on server side"});
                    }
                    return res.json(result);
            })
    });
    
    app.listen(PORT,()=>{
    console.log('Server Listening');    
    });