-- This file is not included in the submission archive, anything you do here is just for manual "testing" via the Swagger UI --

----- Your insert statements go below here -----

INSERT INTO member(id, data) VALUES ('2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', jsonb_build_object('email','molly@books.com','name','Molly Member','pwhash',crypt('mollymember','cs'),'roles','["member"]'));

INSERT INTO member(id, data) VALUES ('71f63b20-91af-4c9b-bb9e-3b3c3684dd98', jsonb_build_object('email','kokhle@ucsc.edu','name','Konan Le','pwhash',crypt('kkkonanle','cs'),'roles','["member"]'));

INSERT INTO member(id, data) VALUES ('4123305a-6335-4ecb-b453-19b8fa8a8c79', jsonb_build_object('email','konan@books.com','name','Coco Le','pwhash',crypt('letmeinpls','cs'),'roles','["member"]'));

INSERT INTO member(id, data) VALUES ('f95d6d1c-4c75-4f28-9a77-edee63ff1ac3', jsonb_build_object('email','barbie@books.com','name','Barbie Buyer','pwhash',crypt('barbiebuyer','cs'),'roles','["member"]'));

INSERT INTO member(id, data) VALUES ('988b2b39-819c-4f8d-9738-7042f7ada1d0', jsonb_build_object('email','sally@books.com','name','Sally Salesman','pwhash',crypt('sallysalesman','cs'),'roles','["member"]'));

INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 1', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 2', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 3', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 4', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 5', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 6', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 7', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 8', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Post 9', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'I am Molly. I like cute dogs.', 'image', 'https://media-be.chewy.com/wp-content/uploads/2022/09/27095535/cute-dogs-pembroke-welsh-corgi.jpg'));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Barbie Buyer', 'member', 'f95d6d1c-4c75-4f28-9a77-edee63ff1ac3', 'posted', CURRENT_TIMESTAMP, 'content', 'Hi, im Barbies first post!', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Barbie Buyer', 'member', 'f95d6d1c-4c75-4f28-9a77-edee63ff1ac3', 'posted', CURRENT_TIMESTAMP, 'content', 'Hi, im her second post!', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Barbie Buyer', 'member', 'f95d6d1c-4c75-4f28-9a77-edee63ff1ac3', 'posted', CURRENT_TIMESTAMP, 'content', 'hi, im her third post!', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Sally Salesman', 'member', '988b2b39-819c-4f8d-9738-7042f7ada1d0', 'posted', CURRENT_TIMESTAMP, 'content', 'Whats up, im Sallys first post', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Sally Salesman', 'member', '988b2b39-819c-4f8d-9738-7042f7ada1d0', 'posted', CURRENT_TIMESTAMP, 'content', 'Whats up, im her second post', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Sally Salesman', 'member', '988b2b39-819c-4f8d-9738-7042f7ada1d0', 'posted', CURRENT_TIMESTAMP, 'content', 'Whats up, im her third post', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Hello, I am Mollys first post!', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Hello, I am mollys second post!', 'image', null));
INSERT INTO post(data) VALUES (jsonb_build_object('name', 'Molly Member', 'member', '2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', 'posted', CURRENT_TIMESTAMP, 'content', 'Hello, I am mollys third post...', 'image', null));

-- Friendship between Molly and Konan
INSERT INTO friend(member1, member2, accepted) VALUES ('2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', '71f63b20-91af-4c9b-bb9e-3b3c3684dd98', true);

-- Friendship between Molly and Sally
INSERT INTO friend(member1, member2, accepted) VALUES ('2e7a39f9-a00e-4f00-9952-fb2fe7cbc2bc', '988b2b39-819c-4f8d-9738-7042f7ada1d0', true);

