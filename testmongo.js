const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port = 3000;

const uri = "mongodb+srv://celo02:NhBf1pvorHHERD6R@cluster0.0kol5hw.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});

app.get('/', (req, res) => {
  res.send('Starting...');
});

app.get('/say/:name', (req, res) => {
  res.send('Hello ' + req.params.name + '!');
});

// changed route param from :users to :name as it was the incorrect path
app.get('/api/mongo/:name', function(req, res) {
  const client = new MongoClient(uri);
  const searchKey = "{ name: '" + req.params.name + "' }";
  console.log("Looking for: " + searchKey);

  async function run() {
    try {
      await client.connect();
      const database = client.db('sample_mflix'); 
      const users = database.collection('users'); 

      const query = { name: req.params.name };
      const user = await users.findOne(query);
      console.log(user);

      if (user) {
        res.send('Found this: ' + JSON.stringify(user));
      } else {
        res.status(404).send('User not found');
      }

    } catch (err) {
      console.error('❌ MongoDB error:', err);
      res.status(500).send('Internal server error');
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});
