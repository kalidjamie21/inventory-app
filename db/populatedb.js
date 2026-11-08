#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL,
  cover_image TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),

  CONSTRAINT games_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
);

INSERT INTO categories (title, description)
VALUES
  ('Action', 'Fast-paced games focused on combat and challenges.'),
  ('RPG', 'Games focused on character development and storytelling.'),
  ('Strategy', 'Games focused on planning, tactics, and decision-making.')
ON CONFLICT (title) DO NOTHING;

INSERT INTO games (title, description, category_id, cover_image, price)
VALUES
  (
    'Hades',
    'A fast-paced action game about escaping the Underworld.',
    (SELECT id FROM categories WHERE title = 'Action'),
    'https://example.com/hades.jpg',
    24.99
  ),
  (
    'The Witcher 3',
    'An open-world role-playing game about a monster hunter.',
    (SELECT id FROM categories WHERE title = 'RPG'),
    'https://example.com/witcher-3.jpg',
    39.99
  ),
  (
    'Civilization VI',
    'A turn-based strategy game about building and managing a civilization.',
    (SELECT id FROM categories WHERE title = 'Strategy'),
    NULL,
    29.99
  );
`;

async function main() {
  console.log("seeding...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL, 
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("done");
}

main();