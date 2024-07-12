import { NewMember, Member } from "./schema";
import { pool } from '../db';

export class MemberService {
  public async createMember(newmember: NewMember): Promise<Member> {
    const select = `SELECT id
        FROM member
        WHERE data->>'email' = $1`;
        
    let query = {
      text: select,
      values: [`${newmember.email}`]
    }
    let result = await pool.query(query);
    if (result.rows.length > 0) {
      // A member with this email already exists, handle as needed (e.g., return undefined or throw an error)
      // console.error('member with this email already exists');
      throw new Error('AccountConflict'); 
    }
    
    // INSERT INTO member(id, data) VALUES ('81c689b1-b7a7-4100-8b2d-309908b444f5', jsonb_build_object('email','anna@books.com','name','Anna Admin','pwhash',crypt('annaadmin','cs'),'roles','["admin"]'));
    const insert = `INSERT INTO member(data)
            VALUES (jsonb_build_object('email', $1::text,'name', $2::text,'pwhash',crypt($3::text, 'cs'),'roles','["member"]'))
            RETURNING id`;
    // there's probably a better way to do the salt, unless its just like this for now
    // added type asting to overcome error: could not determine data type of parameter $1
    query = {
      text: insert,
      values: [`${newmember.email}`, `${newmember.name}`, `${newmember.password}`],
    };
    result = await pool.query(query);
    // if (result.rows.length) {
    const memberCreated = {
      id: result.rows[0].id,
      name: newmember.name,
    }
    return memberCreated;
  }

  public async getAllMembers(userid: string|undefined): Promise<Member[]> {
    const select = `SELECT m1.id, m1.data->>'name' AS name
        FROM member m1
        WHERE m1.data->>'roles' = '["member"]'
        AND m1.id <> $1 
        ORDER BY name ASC`;
    
    const query = {
      text: select,
      values: [`${userid}`]
    };
    const result = await pool.query(query);
    
    // map over the rows returned by the query and populate array
    const members = result.rows.map(row => ({
      id: row.id,
      name: row.name,
    }));
    
    return members;
  }
}