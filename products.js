const express = require('express')
const router = express.Router()
const Product = require('./models/products')
const mongoose = require('mongoose')

router.get('/', (req, res, next)=>{
    // res.status(200).json({
    //     message: 'JSON GET'
    // })
    Product.find()
    .select('name, price, _id')
    .exec()
    .then(docs => {
        //second setup
        // console.log(doc)
        // if(doc){
        //     res.status(200).json({
        //         message: doc
        //     })
        // }else{
        //     res.status(404).json({
        //         message: 'Data not found'
        //     })
        // }
        const response = {
           
        }
        res.status(200).json({
            count: docs.length,
            products : docs.map(doc =>{
                return {
                    name : doc.name,
                    price: doc.price,
                    _id : doc._id,
                    request : {
                        type: "GET",
                        url : "http://localhost:3001/products/" + doc._id
                    }
                }
            })
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.post('/', (req, res, next)=>{
    //initial setup
    // const product={
    //     name: req.body.name,
    //     price: req.body.price
    // }
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price: req.body.price
    })
    product.save()
    .then(result=> {
        console.log(result)
            res.status(200).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id :  result._id,
                request :{
                    type: "GET",
                    url : "http://localhost:3001/products/" + result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:  err
        })
        }
    )
    
})

router.get('/:productId', (req, res, next)=>{
    //initial setup
    // const id = req.params.productId
    // if(id =='special'){
    //     res.status(200).json({
    //         messasge: 'JSON GET ID',
    //         id: id
    //     })
    // }else{
    //     res.status(200).json({
    //         message: 'JSON GET ID 2'
    //     })
    // }
     const id = req.params.productId
    Product.findById(id)
    .select('name _id price')
    .exec()
    .then(doc => 
        res.status(200).json({
            message: 'Product found',
            product : {
                _id: doc._id,
                name: doc.name,
                price: doc.price,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                     url : "http://localhost:3001/products/"
                }
            }
        })
    )
        //second setup
        // if(doc){
        //     res.status(200).json({
        //         message: doc
        //     })
        // }else{
        //     res.status(404).json({
        //         message: 'No data found'
        //     })
        // }
    //     }
    // )
    .catch(err => {console.log(err);
        res.status(500).json({
            error: err
        })}
    )
})


router.patch('/:productId',(req, res, next)=>{
    //initial setup
    // res.status(200).json({
    //     message:'JSON UPDATED'
    // })


    // Note: When setting up the data from the webpage 
    // or postman, set it as an iterable object set, 
    // like so: 
    // [
    //     {"propName": "name","value": "Shirt"}
    // ] to edit name to Shirt
    // [
    //     {"propName": "price","value": "20.33"}
    // ] to edit price
    const id = req.params.productId
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product edited successfully',
                request:{
                    type: 'GET',
                    url : "http://localhost:3001/products/" + id
                }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:productId',(req, res, next)=>{
     //initial setup
    // res.status(200).json({
    //     message:'JSON DELETED'
    // })
    const id = req.params.productId
    Product.deleteOne({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product deleted',
            request : {
                type: 'POST',
                url : "http://localhost:3001/products/" + id,
                data: {name: "String", price: 'Number'}
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
    
})
module.exports = router


//60804ec8f762bd169cb6e0c4  product id for item added. Just for anyhow things