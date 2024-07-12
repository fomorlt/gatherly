/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import http from 'http'
import supertest from 'supertest';

import * as db from './db';
import requestHandler from './requestHandler'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

beforeAll( async () => {
  server = http.createServer(requestHandler);
  server.listen();
  return db.reset();
});

afterAll((done) => {
  db.shutdown(() => {
    server.close(done);
  });
});

const anna = {
  email: 'anna@books.com',
  password: 'annaadmin',
};

it('Logs Anna in', async () => {
  const member = anna;
  await supertest(server).post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
      "${member.password}") { name, accessToken }}`})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.login.name).toEqual('Anna Admin')
      expect(res.body.data.login.accessToken).toBeDefined()
    });
});