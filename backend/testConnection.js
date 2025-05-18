const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace the URI with your MongoDB connection string
const uri = "mongodb+srv://abdulraheemfiverr69:7bfYO36hynJq8bz@cluster0.mq64v.mongodb.net/OutsourcingHub?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    // Connect the client to the server
    await client.connect();

    // Test the connection by pinging the database
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  } finally {
    // Ensure the client closes when you're done
    await client.close();
  }
}

run().catch(console.dir);
