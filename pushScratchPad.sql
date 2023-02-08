CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username VARCHAR(15) NOT NULL UNIQUE,
  password VARCHAR(15) NOT NULL
);

INSERT INTO users (name, email, password,username)
  VALUES
    ('Kat Burwash', 'katrinaburwash_17@hotmail.com', 'Kb1007#','katribu'),
    ('Irgen Sorensen', 'irgen_w.s@hotmail.com', '007','irgen'),
	  ('Shahin Hemat','shahinhemat@gmail.com', '98765','shahem'),
    ('test', 'test@test.com', 'test','test');





create table users_notification_monitor (
id SERIAL PRIMARY KEY,
type TEXT,
data JSONB,
user_id INTEGER,
FOREIGN KEY (user_id) REFERENCES users (id)
)

INSERT INTO users_notification_monitor (type,data,user_id)
VALUES ('location', 
		'{"time":"14:00",
		"message":"Pick up spare tire from Clas Ohlsen",
		"lat":"59.913952748612104",
		"lng":"10.74709874232724"
		}'::jsonb,
	   2)