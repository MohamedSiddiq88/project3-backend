import { ObjectId } from "bson";
import { client } from "../db.js";

export function getAllGames() {
  return client
    .db("project3") 
    .collection("games") 
    .find()
    .toArray();
}

export function getGameById(id) {
  return client
    .db("project3") 
    .collection("games") 
    .findOne({ userid: id });
}

export function createGame(gameData) {
  return client
    .db("project3") 
    .collection("games") 
    .insertOne(gameData)

}

export async function updateGame(updatedData) {
  const {userid}=updatedData;

const isIdAvailable = await client
.db("project3") 
.collection("games") 
.findOne({userid:userid});

  if(isIdAvailable){
    return client
    .db("project3") 
    .collection("games") 
    .findOneAndUpdate(
      { userid },
      { $set: updatedData }
    );
  }else{
    
    return client
    .db("project3") 
    .collection("games") 
    .insertOne(updatedData)
  }
  
}

export function deleteGame(id) {
  return client
    .db("project3") 
    .collection("games") 
    .findOneAndDelete({ _id: new ObjectId(id) }, { projection: { _id: 0 } });
}
