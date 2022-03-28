//Importando postgreeSql
const {Pool} = require('pg');

require('dotenv').config();

const pool = new Pool({
    user:process.env.pgUser,
    host:process.env.pgHost,
    database:process.env.pgUser,
    password:process.env.pgPassword,
    port:process.env.pgPort
});

//Introducir datos
const guardarUsuario = async (usuario)=>{
    const {name,email,password,typeuser} = usuario;
    let client,result;
    try{
        client = await pool.connect(); // Espera a abrir conexion
        const data =  await client.query
                                    (` INSERT INTO usuarios(name,email,password,typeuser) 
                                    VALUES ($1,$2,$3,$4)`
                                    ,[name,email,password,typeuser])
        result = {msg: "Usuario creado exitosamente."}
    }catch(err){
        console.log(err);
        if(err.code==23505){
            result = {msg: "Usuario ya registrado."};
        }
    }finally{
        client.release();    
    }
    return result
}


//Leer usuario



const usuarios = {
    guardarUsuario
}

module.exports = usuarios;
