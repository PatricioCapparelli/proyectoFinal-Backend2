import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "../config/mongoose.config.js";
import { mongodb_url, persistence } from "../config/env.js";

let Users;

async function initializeUsers() {
  switch (persistence) {
    case "MONGO": {
      await connectDb(mongodb_url);
      const { default: UsersMongo } = await import("./mongo/mongo.dao.js");
      Users = UsersMongo;
      break;
    }
    case "MEMORY": {
      const { default: UsersMemory } = await import("./memory/memory.dao.js");
      Users = UsersMemory;
      break;
    }
    default: {
      throw new Error(`Persistence ${persistence} not supported`);
    }
  }
}

export default Users;