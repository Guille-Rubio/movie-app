//Importando postgreeSql
const { Pool } = require('pg');

require('dotenv').config();



const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

//Introducir datos
const guardarUsuario = async (usuario) => {
    const { name, email, password, typeuser } = usuario;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query
            (` INSERT INTO usuarios(name,email,password,typeuser) 
                                    VALUES ($1,$2,$3,$4)`
                , [name, email, password, typeuser])
        result = { msg: "Usuario creado exitosamente." }
    } catch (err) {
        console.log(err);
        if (err.code == 23505) {
            result = { msg: "Usuario ya registrado." };
        }
    } finally {
        client.release();
    }
    return result
}


//Leer usuario

const leerUsuario = async (usuario) => {
    const { email, password } = usuario;
    let client, result;
    try {
        client = await pool.connect(); // Espera a abrir conexion
        const data = await client.query(`
                SELECT name,email,typeuser
                FROM usuarios
                WHERE email = $1 and password = $2`, [email, password]);

        result = data.rows
    } catch (err) {
        console.log(err);
    } finally {
        client.release();
    }
    return result
}

const usuarios = {
    guardarUsuario,
    leerUsuario
}

module.exports = usuarios;
