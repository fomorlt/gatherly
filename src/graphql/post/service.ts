import { pool } from '../db';
import { Post } from './schema';
import { PageSize } from './schema';

export class PostService {
  public async createPost(userId: string|undefined, content: string, image: string|undefined): Promise <Post> {
    //COALESCE($3::text, null)

    const find = `SELECT * 
    FROM member
    WHERE id = $1
    AND data->>'roles' = '["member"]'`;
    let query = {
      text: find,
      values: [`${userId}`],
    };
    let result = await pool.query(query);
    // console.log(result.rows.length);
    // console.log(result.rows);
    const userName = result.rows[0].data.name;


    const insert = `INSERT INTO post(data)
        VALUES (jsonb_build_object('member', $1::UUID, 'posted', CURRENT_TIMESTAMP, 'content', $2::text, 'image', $3::text, 'name', $4::text))
        RETURNING id, data->>'posted' AS posted`;
    // add posted current timestamp? data->>posted?
    let postImage;
    if (image) {
      postImage = image;
    } else {
      postImage = '';
    }
    query = {
      text: insert,
      values: [`${userId}`, `${content}`, `${postImage}`, `${userName}`],
    }
    result = await pool.query(query);
    const newPost = {
      id: result.rows[0].id,
      posted: new Date(result.rows[0].posted),
      content: content,
      image: postImage,
      name: userName,
    }
      
    return newPost;
  }

  public async fetchPosts(userId: string|undefined, pagesize: PageSize): Promise<Post[]> {
    if (pagesize.page <= 0) {
      // type should take care of all floating point or stringified errors
      throw new Error('InvalidPageNum');
    }

    let size;
    if (pagesize.size) {
      size = pagesize.size
    } else {
      // no size specified, default is 20
      size = 20;
    }
    const offset = (pagesize.page - 1) * 20; 
    const allPosts = `
    WITH friends AS (
      SELECT member2::text AS friendId FROM friend WHERE member1::text = $1 AND accepted = true
      UNION
      SELECT member1::text FROM friend WHERE member2::text = $1 AND accepted = true
    )
    SELECT p.id, p.data->>'member' AS member, p.data->>'posted' AS posted, 
    p.data->>'content' AS content, p.data->>'image' AS image, p.data->>'name' AS name
    FROM post p
    WHERE p.data->>'member' = $1 OR p.data->>'member' IN (SELECT friendId FROM friends)
    ORDER BY p.data->>'posted' DESC
    LIMIT $2
    OFFSET $3`;
    const query = {
      text: allPosts,
      values: [`${userId}`, `${size}`, `${offset}`],
    };

    const result = await pool.query(query);

    // create an array of post objects
    return result.rows.map(row => ({
      id: row.id,
      posted: new Date(row.posted),
      content: row.content,
      image: row.image,
      name: row.name,
    }));
  }

}