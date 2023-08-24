const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost:7687', 
  neo4j.auth.basic('neo4j', 'password1234') 
);

async function createAuthor(properties) {
  const session = driver.session();
  const result = await session.run(
    `CREATE (n:Author $props) RETURN n`,
    { props: properties }
  );
  session.close();
  const createdAuthor = result.records[0].get('n').properties
  console.log(createdAuthor);
  return createdAuthor
}

async function getAuthors(label) {
  const session = driver.session();
  const result = await session.run(
    `MATCH (n:Author) RETURN n`
  );
  session.close();
  return result.records.map(record => record.get('n').properties);
}

async function getAuthor(id) {
    const session = driver.session();
    const result = await session.run(
      `MATCH (n:Author{id: $id}) RETURN n`,
      { id: id}
    );
    session.close();
    return result.records[0].get('n').properties
}

// Close the Neo4j driver when done
function close() {
  driver.close();
}

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  close
};
