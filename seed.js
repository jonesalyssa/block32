const { client } = require("./common");

const setupDatabase = async () => {
  const SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_favorite BOOLEAN DEFAULT false,
    );

    INSERT INTO flavors (name, is_favorite) VALUES
  ('Chocolate', true),
  ('Vanilla', true),
  ('Mint', false),
  ('Strawberry', false);
  `;

  try {
    await client.query(SQL);
    console.log("Database has been reset and seeded!");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    client.end();
  }
};

setupDatabase();
