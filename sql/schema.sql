-- Do not delete this table
DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

-- Your schema DDL (create table statements etc.) from Assignment 1 goes below here 


DROP TABLE IF EXISTS friend CASCADE;
CREATE TABLE friend(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), member1 UUID REFERENCES member(id), member2 UUID REFERENCES member(id), accepted BOOLEAN);

DROP TABLE IF EXISTS post CASCADE;
CREATE TABLE post(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);