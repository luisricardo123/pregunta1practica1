const express = require('express');
const app = express();
const sql = require('mssql')
const enrutadorAlumnos = require("./routes/alumnos");
const enrutadorCursos = require("./routes/cursos");
const enrutadorAluCur = require("./routes/alucur");


//Configuraciones
app.set('puerto', process.env.PORT || 3000);

app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

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

app.get("/", (req, res) => {
    res.render("index.html", {
        titulo: "Pregunta 1"
    });
});

app.use('/alumnos', enrutadorAlumnos);
app.use('/cursos', enrutadorCursos);
app.use('/alumnos_cursos', enrutadorAluCur);

app.get("/buscar_notas", (req, res) => {
    res.render("form-busqueda.html", {
        titulo: "Pregunta 1"
    });
});
app.get('/buscar', async (req,res) => {
    const id = req.query.codalu;
    const pool = await sql.connect(sqlConfig)
    
    const result  = await pool.request().input('input_parameter', sql.Char, id).query("SELECT * FROM alumnos WHERE codalu = @input_parameter");
    const result_cursos = await pool.request().input('input_parameter', sql.Char, id).query("SELECT alucur.codcur, cursos.nomcur, alucur.nota, cursos.credito FROM alucur INNER JOIN cursos ON alucur.codcur=cursos.codcur WHERE codalu = @input_parameter");

    var acumulador_nota = 0;
    var acumulador_creditos = 0;
    for (let i = 0; i < result_cursos["recordset"].length; i++) {
        const curso = result_cursos["recordset"][i];
        var nota_curso = curso.nota * curso.credito;
        acumulador_nota +=nota_curso;
        acumulador_creditos += curso.credito;
    }
    var promedio = Math.round((acumulador_nota / acumulador_creditos) * 100) / 100;
    
    res.render("busqueda.html", {
        datos: result["recordset"],
        cursos: result_cursos["recordset"],
        promedio: promedio,
        titulo: "ALUMNO"
    });

    // console.log(result_cursos["recordset"]);
})


app.listen(app.get('puerto'), () =>{
    console.log('Server iniciado en el puerto ' + app.get('puerto') );
});