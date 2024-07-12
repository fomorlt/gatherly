import { pool } from '../db';
import { Member } from '../member/schema';
import { Requests } from './schema';

export class FriendService {
  public async sendFriendRequest(userId: string|undefined, friendId: string|undefined): Promise<Member> {
    // 404 if no member ID found matching
        
    // if (friendId == undefined) {
    //   throw new Error('UndefinedID');
    // }
    //removing undefined checks bc if undefined, will encounter problem in sql
    if (userId == friendId) {
      throw new Error('FriendedSelf')
    }
    let find = `SELECT * 
        FROM member
        WHERE id = $1
        AND data->>'roles' = '["member"]'`;
    let query = {
      text: find,
      values: [`${friendId}`],
    };
    let result = await pool.query(query);
    // console.log(result.rows.length);
    // console.log(result.rows);
    if (result.rows.length == 0) {
      //not using http codes so that we can separate database from http
      throw new Error('MemberNotFound');
    }
    const friendeeName = result.rows[0].data.name;
    const friendeeId = result.rows[0].id;
    // console.log(friendeeName);
    // console.log(friendeeId);

    // 409 if friend request already exists
    find = `SELECT * 
        FROM friend 
        WHERE (member1 = $1 AND member2 = $2) OR (member1 = $2 AND member2 = $1)`;
    query = {
      text: find,
      values: [`${userId}`, `${friendId}`],
    };
    result = await pool.query(query);
    if (result.rows.length > 0) {
      //not using http codes so that we can separate database from http
      throw new Error('AlreadyRequested');
    }

    // 200 if ok, return the friend request object
    const insert = `INSERT INTO friend(member1, member2, accepted) 
        VALUES ($1::UUID, $2::UUID, false) RETURNING *`;
    query = {
      text: insert,
      values: [`${userId}`, `${friendId}`],
    };
    result = await pool.query(query);
    // if (result.rows.length > 0) {
    const friendRequestResponse = {
      id: friendeeId,
      name: friendeeName,
    }
    return friendRequestResponse; //returns created friend request
  }

  public async getRequests(userId: string|undefined): Promise<Requests> {
    //Code from asgn1
    // query will choose individual friend requests from member1 
    let select = `SELECT m.id, m.data->'name' AS name
        FROM friend f, member m
        WHERE f.member2 = $1 
        AND f.accepted = false 
        AND m.id = f.member1`;
    
    let query = {
      text: select,
      values: [`${userId}`]
    };
    let result = await pool.query(query);
    
    const inboundFriends = result.rows.map(row => ({
      id: row.id,
      name: row.name,
    }));

    select = `SELECT m.id, m.data->'name' AS name
        FROM friend f, member m
        WHERE f.member1 = $1 
        AND f.accepted = false 
        AND m.id = f.member2`;
    
    query = {
      text: select,
      values: [`${userId}`]
    };
    result = await pool.query(query);

    const outboundFriends = result.rows.map(row => ({
      id: row.id,
      name: row.name,
    }));

    return {
      inbound: inboundFriends,
      outbound: outboundFriends
    }
  }

  public async acceptFriendRequest(userId: string|undefined, friendId: string|undefined): Promise<Member> {
    //Check if friender sent you a friend request
    // if (userId == undefined || friendId == undefined) {
    //   throw new Error('UndefinedID');
    // }

    let find = `SELECT * 
        FROM member
        WHERE id = $1
        AND data->>'roles' = '["member"]'`;
    let query = {
      text: find,
      values: [`${friendId}`],
    };
    let result = await pool.query(query);
    if (result.rows.length == 0) {
      throw new Error('PersonDoesNotExist');
    }
    const frienderName = result.rows[0].data.name; 
    const frienderId = result.rows[0].id;

    find = `SELECT * 
        FROM friend 
        WHERE member1 = $1 AND member2 = $2 AND accepted = false`;
    query = {
      text: find,
      values: [`${friendId}`, `${userId}`],
    };

    result = await pool.query(query);
    if (result.rows.length == 0) {
      throw new Error('NoRequestFound');
    }
    const requestID = result.rows[0].id;



    const update = `UPDATE friend
        SET accepted = true
        WHERE id = $1
        RETURNING *`;
    query = {
      text: update,
      values: [`${requestID}`],
    };
    result = await pool.query(query);
    const friendResponse = {
      id: frienderId,
      name: frienderName,
    }
    return friendResponse;
  }

  public async getFriends(userId: string|undefined): Promise<Member[]> {
    // if (userId == undefined) {
    //   throw new Error('UndefinedID');
    // }

    const select = `SELECT m.id, m.data->'name' AS name
        FROM friend f
        JOIN member m ON m.id = f.member1 OR m.id = f.member2
        WHERE (f.member1 = $1 OR f.member2 = $1) AND f.accepted = true AND m.id != $1`;

    const query = {
      text: select,
      values: [`${userId}`]
    };
    const result = await pool.query(query);
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
    }));
  }

  public async deleteFriend(userId: string|undefined, friendId: string|undefined): Promise<Member> {
    // if (userId == undefined || friendId == undefined) {
    //   throw new Error('UndefinedID');
    // }
    let find = `SELECT * 
    FROM member
    WHERE id = $1
    AND data->>'roles' = '["member"]'`;
    let query = {
      text: find,
      values: [`${friendId}`],
    };
    let result = await pool.query(query);
    if (result.rows.length == 0) {
      //not using http codes so that we can separate database from http
      throw new Error('MemberNotFound');
    }
    const formerFriendName = result.rows[0].data.name;
    const formerFriendId = result.rows[0].id;

    find = `SELECT id
    FROM friend 
    WHERE (member1 = $1 AND member2 = $2) OR (member1 = $2 AND member2 = $1)`;
    query = {
      text: find,
      values: [`${userId}`, `${friendId}`],
    };
    result = await pool.query(query);
    if (result.rows.length == 0) {
      throw new Error('NoFriendship');
    }
    const friendshipId = result.rows[0].id;

    // Delete the friendship
    const deleteQuery = `DELETE FROM friend WHERE id = $1`;
    query = {
      text: deleteQuery,
      values: [`${friendshipId}`],
    };
    await pool.query(query);
    
    return {
      id: formerFriendId,
      name: formerFriendName,
    };
  }
}