CREATE DATABASE blogs;

CREATE TABLE Account(
    id uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(125) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(125) NOT NULL,
    bio VARCHAR(255),
    avatar VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE Refresh_Token(
    account_id uuid NOT NULL REFERENCES account(id),
    refresh_token VARCHAR NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 DAY',
    PRIMARY KEY (account_id)
);

CREATE TABLE Blog(
    id uuid DEFAULT uuid_generate_v4 (),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by uuid NOT NULL REFERENCES account(id),
    thumbnail VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(id)
);

CREATE TABLE Comment(
    id uuid DEFAULT uuid_generate_v4 (),
    content VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id uuid NOT NULL REFERENCES account(id),
    blog_id uuid NOT NULL REFERENCES blog(id),
    PRIMARY KEY(id)
);