const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getTickets(){
  const data1 = await db.query(
    `SELECT ticketId, defaultdb.tickets.userId, title, description, username 
     FROM tickets INNER JOIN users
     ON users.userId = tickets.userId`
  );
  const ticketsInfo = helper.emptyOrRows(data1);

  return ticketsInfo;
}

async function getTicket(id){
    const  ticketInfo1 = await db.query(
        `SELECT * FROM tickets WHERE ticketId = ?`,
        [id]
      );
    if (!ticketInfo1 || ticketInfo1.length !== 1) {
        return undefined
    }

    const commentsInfo1 = await db.query(
        `SELECT commentId, defaultdb.comments.userId, text, username
         FROM comments INNER JOIN users
         ON users.userId = comments.userId
         WHERE ticketId = ?`,
         [id]
      );

    const ticketInfo = ticketInfo1[0];
    const commentsInfo = helper.emptyOrRows(commentsInfo1);
  
    return { ticketInfo, commentsInfo };
}

async function getUserById(userId){
    const data = await db.query(
        `SELECT * FROM users WHERE userId = ?`,
        [userId]
    );
    const existingUser = helper.emptyOrRows(data);
    return existingUser;
  }

async function getUser(username){
    const data = await db.query(
        `SELECT * FROM users WHERE username = ?`,
        [username]
    );
    const existingUser = helper.emptyOrRows(data);
    return existingUser;
  }

async function addUser(username){
    const existingUser = await getUser(username);
    if (existingUser.length > 0) {
        //return 'The username already exists';
        return existingUser[0];
    }

    const result = await db.query(
        `INSERT INTO users (username) VALUES (?)`,
        [username]
    );
    
    if (!result.affectedRows) {
        throw error(500, `Error in creating user`);
    }
    //return `User created successfully`;
    return {
        userId: result.insertId,
        username: username
    };
}

async function addTicket(newTicket){
    const result = await db.query(
        `INSERT INTO tickets
        (userId, title, description) 
        VALUES
        (?, ?, ?)`,
        [newTicket.userId, newTicket.title, newTicket.description]
    );

    if (!result.affectedRows) {
        throw error(500, `Error in creating ticket`);
    }
    //return `Ticket created successfully`;

    return {
        ticketId: result.insertId,
        userId: newTicket.userId,
        title: newTicket.title,
        description: newTicket.description
    };
}

async function addComment(newComment, ticketId){
    const result = await db.query(
        `INSERT INTO comments
        (ticketId, userId, text) 
        VALUES
        (?, ?, ?)`,
        [ticketId, newComment.userId, newComment.text]
    );

    if (!result.affectedRows) {
        throw error(500, `Error in creating comment`)
    }
    //return `Comment created successfully`;
    
    return {
        commentId: result.insertId,
        ticketId: newComment.ticketId,
        userId: newComment.userId,
        text: newComment.text
    };
}

async function deleteTicket(userId, id){
    const ticketUser = (await getTicket(id)).ticketInfo.userId;
    if (ticketUser != userId) {
        throw error(401, `You are not the creator of this ticket`);
    }

    const result = await db.query(
        `DELETE FROM tickets WHERE ticketId = ?`,
        [id]
    );

    if (!result.affectedRows) {
        throw error(500, `Error in deleting ticket`);
    }

    return `Ticket and its comments successfully deleted`;
}

function error(statusCode, text){
    const err = new Error(text);
    err.statusCode = statusCode;
    return err;
}

  module.exports = {
    getTickets,
    getTicket,
    addUser,
    addTicket,
    addComment,
    deleteTicket
  }