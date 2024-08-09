import express , { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { v5 as uuidv5 } from 'uuid';
import { createHash } from 'crypto';
import { getAllzone , getzone } from './zone';
import mysql, { OkPacket } from 'mysql2/promise';

dotenv.config();

const express_port = process.env.SERVER_PORT;
const express_host = process.env.SERVER_HOST;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// mysql 


const pool = mysql.createPool({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT as unknown as number,

});

app.get('/connection', async (req: Request, res: Response) => {

    try {
       
        const connection = await pool.getConnection();
        res.json({ message: 'Connection to the database was successful' });
        connection.release();

    } catch (error) {

        const data = [{
            'text': "connection failed server is down",
            'errno': -111,
            'code': 'ECONNREFUSED',
            'syscall': 'connect',
            'address': process.env.DB_HOST,
	    'user': process.env.DB_USER,
	    'pass': process.env.DB_PASSWORD,
            'port': process.env.DB_PORT,
            'fatal': true
        }]

        res.json(data);

    }

});




app.get("/", async (req,res)=>{

    try{

        res.json({message: "Welcome to APIs and connection db"});

    }catch{
        res.status(500).send({message: "Error"});
    }
})

app.post("/api/token", async (req,res)=>{
    
    try{

        const zone =  getzone( req.body.zone );
        const countries = getAllzone();

        if(countries.TH.toString() == zone.toString()){

             // SETUP 
            const id:any = await req.body.id ;
            const user:any = await req.body.user ;
            const hash_sha256 = createHash('sha256').update(id).digest('hex');
            const api_uid = uuidv5(hash_sha256, uuidv5.URL);

            res.send({
                identifier:  [
                    {
                        "user" : user,
                        "zone" : countries.TH,
                        "encrypt" : {
                            uuid: api_uid,
                            hash: hash_sha256
                        },
                        
                    },
                    
                ]
            });

        }else{
            res.status(404).send('Not found');
        }

    }catch{
        res.status(500).send({message: "Error"});
    }
    
})

app.listen(express_port , () =>{
    console.log("server",`http://${express_host}:${express_port}`)
})
