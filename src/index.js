const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client')

const app = express();
const prisma = new PrismaClient();
const port = 8000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/healthcheck', (_, res) => {
    res.status(200).json('Server OK');
});

app.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany()

    return res.status(200).json(users);
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    return res.status(200).send(user);
})

app.post('/api/users', async (req, res) => {
    const data = req.body

    const createdUser = await prisma.user.create({
        data: {
            fullName: data.fullName,
            address: data.address,
            email: data.email,
            phone: data.phone,
            role: data.role
        }
    })

    return res.status(201).json(createdUser);
});

app.put('/api/users/:id', async (req, res) => {
    const data = req.body;
    const { id } = req.params;

    const updatedUser = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            fullName: data.fullName,
            address: data.address,
            email: data.email,
            phone: data.phone,
            role: data.role
        }
    });

    return res.status(201).json(updatedUser);
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    const deletedUser = await prisma.user.delete({
        where: {
            id: id
        }
    });

    return res.status(201).json(deletedUser);
});

app.listen(port, () => {
    console.log(`App listening at port ${port}`);
});