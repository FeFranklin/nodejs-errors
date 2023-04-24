import { MongoClient } from 'mongodb'
import { createServer } from 'http'
import { promisify } from 'util'
async function dbConnect () {
  const client = new MongoClient("mongodb://localhost:27017")
  await client.connect()
  console.log('mongodb is connected')
  const db = client.db('comics')
  return {
    collections: { heroes: db.collection('heroes')},
    client
  }
}

const { collections, client } = await dbConnect()

async function handler(req, res) {
  for await (const data of req) {
    try {
      const hero = JSON.parse(data)
      await collections.heroes.insertOne({
        ...hero,
        updatedAt: new Date().toUTCString()
      })
      const heroes = await collections.heroes.find().toArray()
      console.log({ heroes })
      res.writeHead(200)
      res.write(JSON.stringify({ heroes }))
      
    } catch (error) {
      console.log(`a request error has happened ${error}`)
      res.writeHead(500)
      res.write(JSON.stringify({ message: 'internal server error.'}))
    } finally {
      res.end()
    }
  }
};
// curl -i localhost:3000 -X POST --data '{"name": "WonderWoman", "age": "27"}'

const server = createServer(handler).listen(3000, () => console.log('running on 3000 and process', process.pid));


// SIGINT -> Ctrl C
// SIGTERM -> kill

const onStop = async function(signal) {
  console.info(`\n${signal} signal received!`)
  
  console.log('Closing http server...')
  await promisify(server.close.bind(server))()
  console.log('Http has been closed.')
    
  await client.close()
  console.log('Mongodb connection has been closed.')

  // 0 -> success | 1 -> error
  process.exit(0)
};

["SIGINT", "SIGTERM"].forEach((event) => process.on(event, onStop))