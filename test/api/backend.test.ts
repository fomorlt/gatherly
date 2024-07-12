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


export interface Member {
    email: string;
    password: string;
    name: string;
  }
  
  
  export const anna = {
    email: 'anna@books.com',
    password: 'annaadmin',
    name: "Anna Admin",
  };
  let annaId: string = '81c689b1-b7a7-4100-8b2d-309908b444f5';
  
  const tommy = {
    email: "tommy@books.com",
    password: "tommytimekeeper",
    name: "Tommy Timekeeper",
  };
  const tommyPosts: Array<string> = [];
  
  const timmy = {
    email: "timmy@books.com",
    password: "timmyteaboy",
    name: "Timmy Teaboy",
  };
  let timmyId: string;
  const timmyPosts: Array<string> = [];
  
  const terry = {
    email: "terry@books.com",
    password: "terrytrouble",
    name: "Terry Troublemaker",
  };
  
  const post = {
    content: 'Some old guff',
    image:
      'https://communications.ucsc.edu/wp-content/uploads/2016/11/ucsc-seal.jpg',
  };
  
  
  async function loginAs(member: Member): Promise<string | undefined> {
    let accessToken;
    await supertest(server)
      .post('/api/graphql')
      .send({query: `{login(email: "${member.email}" password: 
      "${member.password}") { name, accessToken }}`})
      .expect(200)
      .then((res) => {
        accessToken = res.body.data.login.accessToken;
      });
    return accessToken;
  }
  
  
  test('Anna creates Tommy, Timmy and Terry', async () => {
    const accessToken = await loginAs(anna);
  
    // Create Tommy
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      // .send({ query: `mutation { makeMember(input: ${JSON.stringify(tommy)}) { id, name } }` })
      .send({
        query: `mutation {
          makeMember(input: {
            email: "${tommy.email}",
            password: "${tommy.password}",
            name: "${tommy.name}"
          }) {
            id,
            name
          }
        }`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.makeMember.name).toEqual('Tommy Timekeeper');
      });
  
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      // .send({ query: `mutation { makeMember(input: ${JSON.stringify(tommy)}) { id, name } }` })
      .send({
        query: `mutation {
          makeMember(input: {
            email: "${timmy.email}",
            password: "${timmy.password}",
            name: "${timmy.name}"
          }) {
            id,
            name
          }
        }`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.makeMember.name).toEqual('Timmy Teaboy');
        timmyId = res.body.data.makeMember.id;
        // console.log(timmyId);
      });
  
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      // .send({ query: `mutation { makeMember(input: ${JSON.stringify(tommy)}) { id, name } }` })
      .send({
        query: `mutation {
          makeMember(input: {
            email: "${terry.email}",
            password: "${terry.password}",
            name: "${terry.name}"
          }) {
            id,
            name
          }
        }`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.makeMember.name).toEqual('Terry Troublemaker');
      });
  });
  
  test('Tommy makes 2 posts', async () => {
    const accessToken = await loginAs(tommy);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          makePost (input: {
            content: "${post.content}", 
            image: "${post.image}"
          }) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        tommyPosts.push(res.body.data.makePost.id);
      });
    // post 2
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makePost (input: {content: "${post.content}", image: "${post.image}"}) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        tommyPosts.push(res.body.data.makePost.id);
      });
  });
  
  test('Timmy cannot see tommys posts', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(0);
      });
  });
  
  test('Tommy sends timmy friend request', async () => {
    const accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makeRequest (input: {memberId: "${timmyId}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.makeRequest.name).toEqual("Timmy Teaboy");
      });
  });
  
  test('Timmy accepts tommy friend request', async () => {
    const accessToken = await loginAs(timmy);
    let fid: string = '';
    // finding request
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{request {inbound {id}}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        fid = res.body.data.request.inbound[0].id;
      });
  
      // accepting request
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {acceptRequest (input: {memberId: "${fid}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.acceptRequest.name).toEqual("Tommy Timekeeper");
      });
  });
  
  test('Timmy can now see tommys posts', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(2);
      });
  });
  
  
  test('Terry cannot see tommys posts', async () => {
    const accessToken = await loginAs(terry);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(0);
      });
  });
  
  test('Timmy makes a post', async () => {
    const accessToken = await loginAs(timmy);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          makePost (input: {
            content: "${post.content}", 
            image: "${post.image}"
          }) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        timmyPosts.push(res.body.data.makePost.id);
      });
  
  });
  
  test('Tommy can see timmys post and his own', async () => {
    const accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(3);
        expect(res.body.data.post[0].id).toBe(timmyPosts[0]);
        expect(res.body.data.post[2].id).toBe(tommyPosts[0]);
        expect(res.body.data.post[1].id).toBe(tommyPosts[1]);
      });
  });
  
  test('Timmy can see tommys post and his own', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(3);
        expect(res.body.data.post[0].id).toBe(timmyPosts[0]);
        expect(res.body.data.post[2].id).toBe(tommyPosts[0]);
        expect(res.body.data.post[1].id).toBe(tommyPosts[1]);
      });
  });
  
  test('Terry cannot see tommys or timmys posts', async () => {
    const accessToken = await loginAs(terry);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(0);
      });
  });
  
  test('Tommy no longer wants timmy as a friend', async () => {
    const accessToken = await loginAs(tommy);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          removeFriend (input: {
            memberId: "${timmyId}"
          }) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.removeFriend.name).toEqual("Timmy Teaboy");
      });
  
  });
  
  test('Timmy can only see his own posts', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(1);
        expect(res.body.data.post[0].id).toBe(timmyPosts[0])
      });
  });
  
  test('tommy can only see his own posts', async () => {
    const accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(2);
        expect(res.body.data.post[0].id).toBe(tommyPosts[1])
        expect(res.body.data.post[1].id).toBe(tommyPosts[0])
      });
  });
  
  /* Basic tests done. Advanced tests below. 
  State of members at this point: 
  No friends, tommy has 2 posts, timmy has 1 post. terry has none.
  Starting advanced tests here. */
  
  test('Bidirectional friend delete, neither should be in eithers friend list.', async () => {
    let accessToken = await loginAs(tommy);
    await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({
      query: `{friend {id}}`
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.data.friend.length).toEqual(0);
    });
  
      accessToken = await loginAs(timmy);
        //checking friends list
        await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          query: `{friend {id}}`
        })
        .expect(200)
        .then((res) => {
          expect(res).toBeDefined();
          expect(res.body.data.friend.length).toEqual(0);
        });
  });
  
  test('Rejects non-member Get friend', async () => {
    let accessToken = await loginAs(anna);
    await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({
      query: `{friend {id}}`
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
  
  });
  
  test('Get all members', async () => {
    const accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{member {id, name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        // 2 other members - Timmy, terry, but no anna.
        expect(res.body.data.member.length).toEqual(2);
      });
  });
  
  test('Bad Login', async () => {
    await supertest(server)
      .post('/api/graphql')
      .send({query: `{login(email: "whodis" password: 
      "nopass") { name, accessToken }}`})
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('User Doesnt Exist Login', async () => {
    await supertest(server)
      .post('/api/graphql')
      .send({query: `{login(email: "notthere@gmail.com" password: 
      "helpmepass") { name, accessToken }}`})
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Wrong password', async () => {
    await supertest(server)
      .post('/api/graphql')
      .send({query: `{login(email: "${timmy.email}" password: 
      "helpmepass") { name, accessToken }}`})
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  
  
  test('Bad Token', async () => {
    const accessToken = 'badlogintokennuhuh';
    // Create Tommy
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      // .send({ query: `mutation { makeMember(input: ${JSON.stringify(tommy)}) { id, name } }` })
      .send({
        query: `mutation {
          makeMember(input: {
            email: "${tommy.email}",
            password: "${tommy.password}",
            name: "${tommy.name}"
          }) {
            id,
            name
          }
        }`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('No Auth Header', async () => {
    // const accessToken = 'badlogintokennuhuh';
    // Create Tommy
    await supertest(server)
      .post('/api/graphql')
      // .set('Authorization', 'Bearer ' + accessToken)
      // .send({ query: `mutation { makeMember(input: ${JSON.stringify(tommy)}) { id, name } }` })
      .send({
        query: `mutation {
          makeMember(input: {
            email: "${tommy.email}",
            password: "${tommy.password}",
            name: "${tommy.name}"
          }) {
            id,
            name
          }
        }`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Admin cant make posts', async () => {
    const accessToken = await loginAs(anna);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          makePost (input: {
            content: "${post.content}", 
            image: "${post.image}"
          }) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Rejects Zero Page Num', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 0) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Rejects Float Page Num', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1.25) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Rejects non-numeric Page Num', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: "whaaat") {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Rejects no Page Num', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (size: 5) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });;
  });
  
  
  test('Rejects Negative Page Num', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: -1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Rejects no Page Num', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (size: 5) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });;
  });
  
  test('Timmy can only see his own posts', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 1, size: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(1);
        expect(res.body.data.post[0].id).toBe(timmyPosts[0])
      });
  });
  
  test('Empty page is empty', async () => {
    const accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{post (page: 500, size: 1) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.post.length).toEqual(0);
      });
  });
  
  test('Member Creation Conflict (Tommy Already Exists)', async () => {
    const accessToken = await loginAs(anna);
    // Create Tommy
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      // .send({ query: `mutation { makeMember(input: ${JSON.stringify(tommy)}) { id, name } }` })
      .send({
        query: `mutation {
          makeMember(input: {
            email: "${tommy.email}",
            password: "${tommy.password}",
            name: "${tommy.name}"
          }) {
            id,
            name
          }
        }`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Timmy accepts non-requested friend', async () => {
    const accessToken = await loginAs(timmy);
    // let fid: string = '405f7681-f8e9-48e7-af13-7f3dfc65c317';
      // accepting request
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {acceptRequest (input: {memberId: "${timmyId}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Tommy removes a friend who wasnt friends with him', async () => {
    const accessToken = await loginAs(tommy);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          removeFriend (input: {
            memberId: "${timmyId}"
          }) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  
  });
  
  test('Tommy removes nonexistent person', async () => {
    const accessToken = await loginAs(tommy);
    let fid: string = '405f7681-f8e9-48e7-af13-7f3dfc65c317';
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          removeFriend (input: {
            memberId: "${fid}"
          }) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  
  });
  
  test('Tommy removes bad UUID', async () => {
    const accessToken = await loginAs(tommy);
    let fid: string = 'thisisntuuid!';
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          removeFriend (input: {
            memberId: "${fid}"
          }) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  
  });
  
  test('Timmy rejects a friend request.', async () => {
    let accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makeRequest (input: {memberId: "${timmyId}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.makeRequest.name).toEqual("Timmy Teaboy");
      });
  
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{request {outbound {id, name}}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.request.outbound[0].name).toEqual("Timmy Teaboy");
      });
  
      accessToken = await loginAs(timmy);
      let fid: string = '';
      // finding request
      await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          query: `{request {inbound {id}}}`
        })
        .expect(200)
        .then((res) => {
          expect(res).toBeDefined();
          fid = res.body.data.request.inbound[0].id;
        });
    
        // rejecting friend request, sorry tommy
        await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          query: `mutation {
            removeFriend (input: {
              memberId: "${fid}"
            }) {name}}`
        })
        .expect(200);
        //checking friends list
        await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          query: `{friend {id}}`
        })
        .expect(200)
        .then((res) => {
          expect(res).toBeDefined();
          expect(res.body.data.friend.length).toEqual(0);
        });
  });
  
  test('Timmy and tommy become friends, and appear in friends list.', async () => {
    let accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makeRequest (input: {memberId: "${timmyId}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.makeRequest.name).toEqual("Timmy Teaboy");
      });
  
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `{request {outbound {id, name}}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.data.request.outbound[0].name).toEqual("Timmy Teaboy");
      });
  
      accessToken = await loginAs(timmy);
      let fid: string = '';
      // finding request
      await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          query: `{request {inbound {id}}}`
        })
        .expect(200)
        .then((res) => {
          expect(res).toBeDefined();
          fid = res.body.data.request.inbound[0].id;
        });
    
        // accepting request
        await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          query: `mutation {acceptRequest (input: {memberId: "${fid}"}) {name}}`
        })
        .expect(200)
        .then((res) => {
          expect(res).toBeDefined();
          expect(res.body.data.acceptRequest.name).toEqual("Tommy Timekeeper");
        });
  
        //checking friends list
        await supertest(server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          query: `{friend {id}}`
        })
        .expect(200)
        .then((res) => {
          expect(res).toBeDefined();
          expect(res.body.data.friend.length).toEqual(1);
        });
  });
  
  test('Already friends ', async () => {
    const accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makeRequest (input: {memberId: "${timmyId}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Timmy tries to friend himself. Thats my solution to having no friends', async () => {
    let accessToken = await loginAs(timmy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makeRequest (input: {memberId: "${timmyId}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  
  });
  
  test('Sending undefined IDs to friend..', async () => {
    let accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makeRequest (input: {memberId: "null"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  
  });
  
  test('Timmy accepts non-existent person friend request', async () => {
    const accessToken = await loginAs(timmy);
    let fid: string = '405f7681-f8e9-48e7-af13-7f3dfc65c317';
      // accepting request
      await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {acceptRequest (input: {memberId: "${fid}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  
  test('Rejects friend request to admin', async () => {
    const accessToken = await loginAs(tommy);
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {makeRequest (input: {memberId: "${annaId}"}) {name}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Bad Email Member Create', async () => {
    const accessToken = await loginAs(anna);
  
    // Create Tommy
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      // .send({ query: `mutation { makeMember(input: ${JSON.stringify(tommy)}) { id, name } }` })
      .send({
        query: `mutation {
          makeMember(input: {
            email: "bademail",
            password: "passwordisok",
            name: "NoGood"
          }) {
            id,
            name
          }
        }`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Timmy makes a bad URL post', async () => {
    const accessToken = await loginAs(timmy);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          makePost (input: {
            content: "${post.content}", 
            image: "thisaintaurl!"
          }) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  
  test('Timmy makes a undefined image post', async () => {
    const accessToken = await loginAs(timmy);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          makePost (input: {
            content: "${post.content}", 
          }) {id}}`
      })
      .expect(200);
      // .then((res) => {
      //   expect(res).toBeDefined();
      //   expect(res.body.errors.length).toEqual(1);
      // });
  });
  
  test('Timmy makes a post with no content', async () => {
    const accessToken = await loginAs(timmy);
    // post 1
    await supertest(server)
      .post('/api/graphql')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        query: `mutation {
          makePost (input: {
            image: "${post.image}"
          }) {id}}`
      })
      .expect(200)
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.body.errors.length).toEqual(1);
      });
  });
  