CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  password VARCHAR(15)
);

INSERT INTO users (name, email, password)
  VALUES
    ('Kat Burwash', 'katrinaburwash_17@hotmail.com', 'Kb1007#'),
    ('Irgen Sorensen', 'irgen_w.s@hotmail.com', '007'),
	  ('Shahin Hemat','shahinhemat@gmail.com', '98765'),
    ('test', 'test@test.com', 'test');




-- Temporary table........
-- CREATE TABLE push-notifications (
--   ID SERIAL PRIMARY KEY,
--   remindertype TEXT,
--   geolocationtype TEXT,
-- );