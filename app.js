const express = require('express');
const app = express();
const sql = require('mssql')

//Configuraciones
app.set('puerto', process.env.PORT || 3000);

app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');

app.use(express.static('public'));

// app.set('views',path.join(__dirname,"views"));

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

app.get('/buscar', async (req,res) => {
    const id = req.query.codalu;
    const pool = await sql.connect(sqlConfig)
    
    const result  = await pool.request().input('input_parameter', sql.Char, id).query("SELECT * FROM alumnos WHERE codalu = @input_parameter");
    const result_cursos = await pool.request().input('input_parameter', sql.Char, id).query("SELECT alu_cur.codcur, cursos.nomcur, alu_cur.nota, cursos.credito FROM alu_cur INNER JOIN cursos ON alu_cur.codcur=cursos.codcur WHERE codalu = @input_parameter");

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

    console.log(result_cursos["recordset"]);
})

app.listen(app.get('puerto'), () =>{
    console.log('Server iniciado en el puerto ' + app.get('puerto') );
});