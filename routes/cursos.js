const express = require('express');
const enrutadorCursos = express.Router();
const sql = require('mssql')

//Base de datos
const sqlConfig = {
    user: 'sanusuario',
    password: 'Lucero15',
    server: "servprac123.database.windows.net",
    database: 'Universidad',
    options: {
        encrypt: true, 
        trustServerCertificate: false 
    }
}

enrutadorCursos.get('/', async (req,res) => {
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request().query("SELECT * FROM cursos");
    // console.log(result["recordset"])
    res.render("cursos.html", {
        datos: result["recordset"],
    });

})

enrutadorCursos.post('/agregar', async (req,res) => {
    const curso = req.body;
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request()
    .input('codigo', sql.Char, curso.codigo)
    .input('nombre', sql.Char, curso.nombre)
    .input('credito', sql.Char, curso.credito)
    .query("INSERT INTO cursos (codcur, nomcur, credito) VALUES (@codigo, @nombre, @credito)");
    res.redirect('/cursos');
})

enrutadorCursos.get('/editar/:id', async (req,res) => {
    const id = req.params.id;
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request().input('input_parameter', sql.Char, id).query("SELECT * FROM cursos WHERE codcur = @input_parameter");
    // console.log(result["recordset"])
    res.render("actualizar-cursos.html", {
        curso: result["recordset"],
    });
})

enrutadorCursos.post('/act/:id', async (req,res) => {
    const id = req.params.id;
    const curso = req.body;
    const pool = await sql.connect(sqlConfig);
    const result  = await pool.request()
        .input('codigo', sql.Char, id)
        .input('nombre', sql.Char, curso.nombre)
        .input('credito', sql.Char, curso.credito)
        .query("UPDATE cursos SET nomcur = @nombre, credito = @credito WHERE codcur = @codigo");

    res.redirect('/cursos');
})

enrutadorCursos.get("/borrar/:id", async (req,res) =>{
    const id = req.params.id;
    const pool = await sql.connect(sqlConfig);
    const result  = await pool.request()
        .input('codigo', sql.Char, id)
        .query("DELETE FROM cursos WHERE codcur = @codigo");
    res.redirect('/cursos');
});

module.exports = enrutadorCursos;