var express = require('express');
var app = express();
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
const server = require('./server');
const middleware=require('./middleware');
app.use(bodyparser.json());
const MongoClient = require('mongodb');
const url='mongodb://127.0.0.1:27017';
const dbname='name';
let db
MongoClient.connect(url, (err,client)=>{
        if(err) return console.log(err);
        db=client.db(dbname);
});

// READING HOSPITALS DETAILS

app.get('/HospitalDetails',middleware.checkToken,function(req,res){
    console.log("Fetching hospital details......");
    db.collection('hospital').find().toArray(function(err,result)
    {
        if(err) return console.log(err);
        res.send(result);
    });
});

//READING VENTILATORS DETAILS
app.get('/VentilatorDetails',middleware.checkToken,function(req,res){
    console.log("Fetching ventilator details......");
    db.collection('ventilators').find().toArray(function(err,result)
    {
        if(err) return console.log(err);
        res.send(result);
    });
})

//SEARCHING VENTILATOR BY STATUS
app.post('/SearchVentilatorStatus',middleware.checkToken,(req,res)=>
{
    var st = req.body.status;
    console.log(st);
    var VentilatorDetails = db.collection('ventilators').find({"status":st}).toArray(function(err,result){
        if(err) return console.log(err);
        res.json(result);
    });

});

//SEARCHING VENTILATOR BY HOSPITAL NAME
app.post('/Searchventbyname',middleware.checkToken,(req,res)=>{
	var name=req.query.h_name; 
	console.log(name);
	var ventilatordetails = db.collection('ventilators')
    .find({"h_name":name}).toArray(function(err,result)
    {
        if(err) return console.log(err);
        res.send(result);        
    });
});

//SEARCHING HOSPITAL BY NAME
app.post('/Searchhospbyname',middleware.checkToken,(req,res)=>{
	var name=req.body.h_name; 
	console.log(name);
	db.collection('hospital').find({"h_name":name}).toArray(function(err,result)
    {
        if(err) return console.log(err);
        res.send(result);        
    });
});


//UPDATING VENTILATOR DETAILS
app.put('/UpdateVentilator',middleware.checkToken,(req,res)=>
{
    var vent_id={v_id:req.body.v_id};
    console.log(vent_id);
    var updated_data={ $set:{status:req.body.status} };
    db.collection('ventilators').update(vent_id,updated_data,function(err,result)
    {
        if(err) return console.log(err);
        console.log("ventilator updated succesfully..");
        res.send("ventilator updated succesfully..");
    });
});

//ADDING VENTILATOR
app.post('/AddVentilator',middleware.checkToken,(req,res)=>
{
	var h_id=req.body.h_id;
	var v_id=req.body.v_id;
	var st=req.body.status;
	var na=req.body.h_name;
    var v_item={h_id:h_id,v_id:v_id,status:st,h_name:na};
    db.collection("ventilators").insert(v_item,function(err,result)
    {
		if(err) return console.log(err);
		console.log("Ventilator inserted succesfully..");
		res.send("Ventilator inserted succesfully..");        
    });

});

//DELETING VENTILATOR
app.delete('/deleteventilator',middleware.checkToken,(req,res)=>
{
    var d = {v_id:req.body.v_id};
    db.collection('ventilators').deleteOne(d,function(err,result)
    {
		if(err) return console.log(err);
		console.log("Ventilator deleted succesfully..");
		res.send("Ventilator deleted succesfully..");
    });

})

app.listen(3000,function(){
    console.log("started on port : 3000");
})


