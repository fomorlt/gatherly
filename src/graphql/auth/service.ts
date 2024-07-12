// Code largely from typegraph authenticated book example

import * as jwt from "jsonwebtoken";

import { Credentials, Authenticated } from './schema';
import { SessionUser } from '../../types/next';
import { pool } from '../db';

export interface User {
    id: string,
    email: string,
    name: string,
    roles: string[]
  }
  
export class AuthService {

  public async login(credentials: Credentials): Promise<Authenticated>  {
    // made the arrow function async compared to the original - remove if causing problems
    // perhaps just move all of the database functions directly here
    return new Promise((resolve, reject) => {
      
      const select = `SELECT * FROM member 
      WHERE data->>'email' = $1 
      AND data->>'pwhash' = crypt($2, 'cs')`;
      const query = {
        text: select,
        values: [credentials.email, credentials.password],
      };
      pool.query(query).then((result) => {
        if (result.rows.length > 0) {
          // if pass
          const user = result.rows[0];
          const userInfo = {
            id: user.id,
            email: user.data.email,
            name: user.data.name,
            roles: user.data.roles,
          };

          const accessToken = jwt.sign(
            {id: userInfo.id, email: userInfo.email, roles: userInfo.roles}, 
            `${process.env.MASTER_SECRET}`, {
              expiresIn: '30m',
              algorithm: 'HS256'
            });

          resolve({name: userInfo.name, accessToken: accessToken});

        } else {
          reject(new Error("Unauthorised"));
          // potentially switch to undefined instead?
          // something about graphql generating an error in res.body.errors
        }
      });
    });
  }
  
  public async check(authHeader?: string, roles?: string[]): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorised"));
      }
      else {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 
          `${process.env.MASTER_SECRET}`, 
          (err: jwt.VerifyErrors | null, decoded?: object | string) => 
          {
            const user = decoded as User;
            if (err) {
              // console.log('check failed here..')
              // console.log(err);
              reject(err);
            } else if (roles){
              for (const role of roles) {
                if (!user.roles || !user.roles.includes(role)) {
                  // console.log('check failed');
                  reject(new Error("Unauthorised"));
                }
              }
            }
            resolve({id: user.id});
          });
      }
    });
  }
}
  