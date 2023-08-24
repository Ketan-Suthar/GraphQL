const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost:7687', 
  neo4j.auth.basic('neo4j', 'password1234') 
);

async function createBook(properties) {
  const session = driver.session();
  const result = await session.run(
    `CREATE (n:Book $props) RETURN n`,
    { props: properties }
  );
  session.close();
  const createdBook = result.records[0].get('n').properties
  console.log(createdBook);
  return createdBook
}

async function getBooks(label) {
  const session = driver.session();
  const result = await session.run(
    `MATCH (n:Book) RETURN n`
  );
  session.close();
  return result.records.map(record => record.get('n').properties);
}


async function getBook(id) {
    const session = driver.session();
    const result = await session.run(
      `MATCH (n:Book{id: $id}) RETURN n`,
      { id: id }
    );
    session.close();
    return result.records[0].get('n').properties
}

async function getBooksByAuthor(authorId) {
    const session = driver.session();
    const result = await session.run(
        `MATCH (n:Book{authorId: $authorId}) RETURN n`,
        { authorId: authorId}
    );
    session.close();
    return result.records.map(record => record.get('n').properties);
}

// Close the Neo4j driver when done
function close() {
  driver.close();
}

module.exports = {
  createBook,
  getBooks,
  getBook,
  getBooksByAuthor,
  close
};
