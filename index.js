import express from "express"
import mysql from 'mysql2/promise'
import { configDB } from "./configDB.js"

const PORT=8000
let connection

try {
    connection=await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
    
}

const app=express()
app.use(express.json())

app.get('/todos',async (req,resp)=>{
    try {
        const sql='SELECT * FROM todo ORDER BY TIMESTAMP DESC'
        const [rows,fields]=await connection.execute(sql)
        console.log(rows);
        resp.send(rows)
    } catch (error) {
        console.log(error);
        
    }
})
app.post('/todos',async (req,resp)=>{
    const{task}=req.body
    if(!task) return resp.status(400).json({msg:'hianyos adatok!'})

    try {
        const sql='INSERT INTO todo (task) VALUES (?);'
        const values=[task]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);
        resp.status(200).json({msg:'sikeres adat beiras'})
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:`server error: ${error}`})
    }
})

app.delete('/todos/:id',async (req,resp)=>{
    const{id}=req.params
    
    try {
        const sql='DELETE FROM TODO WHERE id=?'
        const values=[id]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);
        resp.status(200).json({msg:'sikeres adat torles'})
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:`server error: ${error}`})
    }
})

app.put('/todos/:id',async (req,resp)=>{
    const{id}=req.params
    
    try {
        const sql='UPDATE todo SET completed=NOT completed WHERE id=? '
        const values=[id]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);
        resp.status(200).json({msg:'sikeres adat frissites'})
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:`server error: ${error}`})
    }
})

app.put('/todos/task/:id',async (req,resp)=>{
    const{id}=req.params
    const{task}=req.body

    
    try {
        const sql='UPDATE todo SET task=? WHERE id = ?'
        const values=[task,id]
        const [rows,fields]=await connection.execute(sql,values)
        console.log(rows);
        resp.status(200).json({msg:'sikeres adat frissites'})
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:`server error: ${error}`})
    }
})




app.listen(PORT,()=>console.log(`server is Listnening on ${PORT}`))