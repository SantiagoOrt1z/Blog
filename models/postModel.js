import pool from "../config/db.js";

export async function insertPost(userId, title, content) {
    try{
        const result = await pool.query("INSERT INTO posts (user_id, title, content) VALUES($1,$2,$3) RETURNING *",[userId, title, content])
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

export async function selectPostByUser(user_id) {
    try {
        const result = await pool.query("SELECT * FROM posts WHERE user_id = $1", [user_id])
        return result.rows      
    } catch(err) {
        console.error(err)
        throw err
    }
}

export async function updatePost(id,title,content) {
    try{
        const result = await pool.query("UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *" ,[title,content,id])
        if(result.rows.length > 0 ){
            return result.rows[0]
        }else{
            return false
    }
    }catch(err){
        console.error(err)
        throw err
    }  
}

export async function deletePost(id) {
    try{
        const result = await pool.query("SELECT * FROM posts WHERE id = $1",[id])
        if(result.rows.length > 0){
            await pool.query("DELETE FROM posts WHERE id = $1",[id])
            return true
        }else{
            return false
        }
    }catch(err){
        console.error(err)
        throw err
    }
}