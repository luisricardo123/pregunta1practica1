const express = require('express');
const enrutadorAlumnos = express.Router();
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

enrutadorAlumnos.get('/', async (req,res) => {
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request().query("SELECT * FROM alumnos");
    // console.log(result["recordset"])
    res.render("alumnos.html", {
        datos: result["recordset"],
    });

})

enrutadorAlumnos.post('/agregar', async (req,res) => {
    const alumno = req.body;
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request()
    .input('codigo', sql.Char, alumno.codigo)
    .input('nombre', sql.Char, alumno.nombre)
    .input('apellido', sql.Char, alumno.apellido)
    .query("INSERT INTO alumnos (codalu, nomalu, apealu) VALUES (@codigo, @nombre, @apellido)");
    res.redirect('/alumnos');
})

enrutadorAlumnos.get('/editar/:id', async (req,res) => {
    const id = req.params.id;
    const pool = await sql.connect(sqlConfig)
    const result  = await pool.request().input('input_parameter', sql.Char, id).query("SELECT * FROM alumnos WHERE codalu = @input_parameter");
    // console.log(result["recordset"])
    res.render("actualizar-alumnos.html", {
        alumno: result["recordset"],
    });
})

enrutadorAlumnos.post('/act/:id', async (req,res) => {
    const id = req.params.id;
    const alumno = req.body;
    const pool = await sql.connect(sqlConfig);
    const result  = await pool.request()
        .input('codigo', sql.Char, id)
        .input('nombre', sql.Char, alumno.nombre)
        .input('apellido', sql.Char, alumno.apellido)
        .query("UPDATE alumnos SET nomalu = @nombre, apealu = @apellido WHERE codalu = @codigo");

    res.redirect('/alumnos');
})

enrutadorAlumnos.get("/borrar/:id", async (req,res) =>{
    const id = req.params.id;
    const pool = await sql.connect(sqlConfig);
    const result  = await pool.request()
        .input('codigo', sql.Char, id)
        .query("DELETE FROM alumnos WHERE codalu = @codigo");
    res.redirect('/alumnos');
});

module.exports = enrutadorAlumnos;