// Libraries
const express = require("express");
const multer = require("multer");
const cors = require('cors');
const mysql = require("mysql2");
const { check, checkSchema, validationResult } = require("express-validator");
const connection = require('./model/connection.js');
const dogs = require('./model/dogs.js');

// Setup defaults for script
const app = express();
app.use(cors());
app.use(express.static("public"));

const upload = multer();
const port = 80; // Default port to HTTP server



app.get('/dogs/', upload.none(), async (request, response) => {
  //SELECT statement variables
  
  try{
    let result = await dogs.getAll( request.query);
      console.log({ data: result });
      return response
          .status(200)
          .json({data: result});
  } catch (error) {
      console.log(error);
      return response
          .status(500) //Error code when something goes wrong with the server
          .json({ message: 'Something went wrong with the server.' });
  }
});



app.post('/dogs/', upload.none(),

check("name", "You gotta have a name for your puppo.").isLength({ min: 3 }),
  //breed validation
  check("breed", "Please select a breed for you puppers.").isIn([
    "''", //empty string to prevent default value
    "toy",
    "work",
    "herd",
    "sport",
  ]),
  //fur validation
  check("fur", "Describe your doggos fur.").isIn([
    "''", //empty string to prevent default value
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ]),
  //color validation
  check("color", "Give your puppy some color!").isLength({ min: 3 }),
  //energy validation
  check("energy", "Tell us how jazzed your fluffers is.").isIn([
    "''", //empty string to prevent default value
    "low",
    "med",
    "high",
  ]),
  //size validation
  check("size", "How big or small is the dawg?").isInt({ min: 1, max: 300 }),



  async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        console.log(errors);
        return response
            .status(400)
            .json({
                message: 'Request fields are invalid.',
                errors: errors.array(),
            });
    }

    try{
        await dogs.insert(request.body);
        return response
            .status(200)
            .json({ message: 'Puppy Added!' });
    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });
    }
    //response.json({ message: 'Form submission was succesful!' });
});


//JSON of values from database
app.get('/dogs/:dogId', upload.none(),
    async (request, response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            console.log(errors);
            return response
                .status(400)
                .json({
                    message: 'Request fields are invalid.',
                    errors: errors.array(),
                });
        }
        
        try{
            const result = await dogs.get(request.params.dogId);
            console.log({ data: result });
            return response
                .status(200)
                .json({ data: result });
        }catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });
        }
        //response.json({ data: result });
        //console.log({ data: result });
    });



    app.put('/dogs/:dogId', upload.none(),
    check("name", "You gotta have a name for your puppo.").isLength({ min: 3 }),
  //breed validation
  check("breed", "Please select a breed for you puppers.").isIn([
    "''", //empty string to prevent default value
    "toy",
    "work",
    "herd",
    "sport",
  ]),
  //fur validation
  check("fur", "Describe your doggos fur.").isIn([
    "''", //empty string to prevent default value
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ]),
  //color validation
  check("color", "Give your puppy some color!").isLength({ min: 3 }),
  //energy validation
  check("energy", "Tell us how jazzed your fluffers is.").isIn([
    "''", //empty string to prevent default value
    "low",
    "med",
    "high",
  ]),
  //size validation
  check("size", "How big or small is the dawg?").isInt({ min: 1, max: 300 }),


  
  async (request, response) => {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        console.log(errors);
        return response
            .status(400)
            .setHeader('Access-Control-Allow-Origin', '*')
            .json({
                message: 'Request fields are invalid.',
                errors: errors.array(),
            });
    }
    try{
        request.body.dogId = request.params.dogId;
        await dogs.edit(request.body);
        return response
            .status(200)
            .json({ message: 'Puppy Added!' });
    } catch (error) {
            console.log(error);
            return response
                .status(500) //Error code when something goes wrong with the server
                .setHeader('Access-Control-Allow-Origin', '*') //Prevent CORS error
                .json({ message: 'Something went wrong with the server.' });
    }
    //Default response object
    //response.status(200).json({ message: 'Form submission was succesful!' });
});


app.delete('/dogs/:dogId', async (request, response) => {

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
        console.log(errors);
        return response
            .status(400)
            .setHeader('Access-Control-Allow-Origin', '*')
            .json({
                message: 'Request fields or files are invalid.',
                errors: errors.array(),
            });
    }
    try{
        await dogs.deleteById(request.params.dogId);
        return response
            .status(200)
            .json({ message: 'Puppy Deleted!' });
    } catch (error) {
        console.log(error);
        return response
            .status(500) //Error code when something goes wrong with the server
            .json({ message: 'Something went wrong with the server.' });
    }
    //Default response object
    //response.json({ message: 'Puppy Added!' });
        
});

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`);
})

