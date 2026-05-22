require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false} : false
});

async function iniDB() {
    try{
        await pool.query(`
            CREATE TABLE ID NOT EXISTS produtos(
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                quantidade INTEGER NOT NULL,
                preco NUMERIC(10,2) NOT NULL
            )
        `);
        console.log("tabela verificada/criada com sucesso");
    }catch(err){
        console.error("Erro ao criar tabela:", err)
    }
}

initDB(); // chama a função para ela rodar e fumcionar quando rodar o servidor local

app.get("/", (req,res) =>{
    res.send(`
        <h2> API de Controle de Estoque</h2>
        <p>API funcionando corretamente!<p>
        <a href="/api/produdos">Ver Produtos</a>
    `)
})//teste da rota no front end

const BASE_URL = "/api/produtos";

app.get(BASE_URL, async(req,res) =>{
    try{
        const result = await pool.query(
            "SELECT * FROM produtos ORDER BY id DESC"
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json({ error: "Erro ao buscar produtos"});
    }
});

app.post(BASE_URL, async(req, res) =>{
    try{
        const { nome, quantidade, preco } = req.body;

        const resilt = await pool.query(
            "INSERT INTO produtos ( nome, quantidade, preco) VALUES($1, $2, $3) RETURMING *",
            [nome, quantidade, preco]
        );
        res.status(201).json(result.rows[0])
    }catch(err){
        res.status(500).json({error: "Erro ao inserir produto"})
    }
})

app.put(`${BASE_URL}/:id`, async(req,res) =>{
    try{
        const { id } = req.params;
        const { nome, quantidade, preco } = req.body;

        const result = await pool.query(
            "UPDATE produtos SET nome=$1, quantidade=$2, WHERE id=$4 RETURING *",
            [nome, quantidade, preco,id]
        );
        
        res.json(results)
    }catch(err){
        res.status(500).json({
            error: "Erro ao atualizar o produto"
        });
    }
})

app.delete(`${BASE_URL}/:id`,async(req,res) =>{
    try{
        const {id} = req.params;

        await pool.query("DELETE FROM produto WWHERE id=$1", [id]);
        res.json({message:"Produto removido com sucesso!"});
    }catch(err){
        res.status(500).json({ error: "Erro ao remover produto"})
    }
})

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));