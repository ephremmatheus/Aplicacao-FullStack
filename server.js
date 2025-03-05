import express from 'express';
import { PrismaClient } from '@prisma/client'
import { ObjectId } from 'mongodb';

const prisma = new PrismaClient()

const app = express();

app.set('view engine', 'ejs')


app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/usuarios', async function(req, res) {
    try{
        await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: parseInt(req.body.age, 10)
            }
        })
        res.status(201).send('Usuário criado!')
    } catch(e){
        if(e.code == 'P2002'){
            res.status(400).send('Email já existe')
        }
        res.status(500).send('Erro ao criar usuário, tente novamente mais tarde.')
    }    
})

app.get('/usuarios', async function(req, res) {
    let users = []
    if(req.query){
       users = await prisma.user.findMany({
        where: {
            email: req.query.email ? req.query.email: undefined,
            name: req.query.name ? req.query.name: undefined,
            age: req.query.age ? parseInt(req.query.age, 10): undefined
        }
       }) 
    } else{
        users = await prisma.user.findMany()
    }
    res.status(200).json(users);
})

app.put('/usuarios/:id', async function(req, res) {
    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: parseInt(req.body.age, 10)
        }
    })
    res.status(200).send('Usuário editado!')
})

app.delete('/usuarios/:id', async function(req, res) {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).send('Usuário deletado!')
})

// app.listen(3000, () => {
//     console.log('http://localhost:3000')
//     console.log('escutando a 3000')
// })
