import pool from "../config/db.js"

export  async function insertUser(username, email, password){
    try{
        const result = await pool.query("INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING *",[username, email, password])

        if(result.rows.length > 0){
            return true
        }else{
            return false
        }
    }catch(err){
        console.error(err)
        throw err
    }
}

export async function selectUserByEmail(email) {
    try{
        const result = await pool.query("SELECT * FROM users WHERE email = $1",[email])
        if(result.rows.length > 0){
            return result.rows[0]
        }else{
            return false
        }
    }catch(err){
        console.error(err)
        throw err
    }
}
