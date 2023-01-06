// all setup and configuration for openai
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import {Configuration, OpenAIApi } from 'openai';


dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
});

// creates body or pauload
app.post('/', async (req, res)=> {
    try{
        const prompt = req.body.prompt; // passws prompt

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,  // model taking risks in answer
            max_tokens: 3000, // length of responses
            top_p: 1,
            frequency_penalty: 0.5, // likelihood to repeat answer
            presence_penalty: 0,
        });
        // communicates to front end
        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error){
        console.log(error);
        res.status(500).send({error })
    }
}) 

// ensures server always listens for request
app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
