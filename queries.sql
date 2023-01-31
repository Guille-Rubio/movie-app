--CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id_user serial PRIMARY KEY,
    username VARCHAR (50),
    email VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (50) NOT NULL,
    role VARCHAR (50),
    logged BOOLEAN
);

--CREATE FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id_favorite serial PRIMARY KEY,
    id_user VARCHAR (50),
    id_movie VARCHAR (50)
);

--CREATE USER
INSERT INTO
    users (username, email, password, role, logged)
VALUES
    ($ 1, $ 2, $ 3, $ 4, $ 5);

--SET USER AS LOGED
UPDATE users SET logged = true WHERE email = $1 AND password = $2

--FIND USER BY EMAIL
SELECT user,email,role
                FROM users
                WHERE email = $1

--UPDATE USER PASSWORD
UPDATE users SET password =$1 WHERE id =$2

--SEED USERS TABLE
INSERT INTO
    users (id_user, username, email, password, role)
VALUES
    (
        1,
        'Guille',
        'guillermo@gmail.com',
        'ABCdef123!',
        'admin'
    ),
    (
        2,
        'Pepe',
        'pepe@gmail.com',
        'ABCdef123!',
        'user'
    );

--SELECT ALL USERS FAVORITES
SELECT
    *
FROM
    favorites
WHERE
    id_user =($ 1) --ADD FAVORITES
INSERT INTO
    favorites (id_user, id_movie)
VALUES
    ($ 1, $ 2) --DELETE USER FAVORITE
DELETE FROM
    favorites
WHERE
    id_user = $ 1
    AND id_movie = $ 2