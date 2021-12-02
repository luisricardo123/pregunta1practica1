const express = require('express');
const enrutadorAluCur = express.Router();
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

enrutadorAluCur.get('/', async (req,res) => {
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request().query("SELECT * FROM alucur");
    // console.log(result["recordset"])
    res.render("alucur.html", {
        datos: result["recordset"],
    });

})

enrutadorAluCur.post('/agregar', async (req,res) => {
    const alucur = req.body;
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request()
    .input('alumno', sql.Char, alucur.alumno)
    .input('curso', sql.Char, alucur.curso)
    .input('nota', sql.Char, alucur.nota)
    .query("INSERT INTO alucur (codalu, codcur, nota) VALUES (@alumno, @curso, @nota)");
    res.redirect('/alumnos_cursos');
})

enrutadorAluCur.get('/editar/:alu/:cur', async (req,res) => {
    const alu = req.params.alu;
    const cur = req.params.cur;
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request()
        .input('alu', sql.Char, alu)
        .input('cur', sql.Char, cur)
        .query("SELECT * FROM alucur WHERE codALU = @alu AND codcur = @cur");
    // console.log(result["recordset"])
    res.render("actualizar-alucur.html", {
        alucur: result["recordset"],
    });
})

enrutadorAluCur.post('/act/:alu/:cur', async (req,res) => {
    const alu = req.params.alu;
    const cur = req.params.cur;
    const alucur = req.body;
    const pool = await sql.connect(sqlConfig);
    const result  = await pool.request()
        .input('alu', sql.Char, alu)
        .input('cur', sql.Char, cur)
        .input('nota', sql.Char, alucur.nota)
        .query("UPDATE alucur SET nota = @nota WHERE codalu = @alu AND codcur = @cur");

    res.redirect('/alumnos_cursos');
})

enrutadorAluCur.get("/borrar/:alu/:cur", async (req,res) =>{
    const alu = req.params.alu;
    const cur = req.params.cur;
    const pool = await sql.connect(sqlConfig);
    const result  = await pool.request()
        .input('alu', sql.Char, alu)
        .input('cur', sql.Char, cur)
        .query("DELETE FROM alucur WHERE codalu = @alu AND codcur = @cur");
    res.redirect('/alumnos_cursos');
});

module.exports = enrutadorAluCur;