import express from "express";
import { createGame, deleteGame, getAllGames, getGameById, updateGame } from "../Controllers/game.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const newGameData = req.body;
    console.log(newGameData);
    if (!newGameData) {
      res.status(400).json({ error: "No game details provided" });
      return;
    }
    const createdGame = await createGame(newGameData);
    console.log(createdGame);
    res.status(200).json({ data: createdGame, message: "Game created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const orders = await getAllGames();
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const game = await getGameById(id);
    if (!game) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    res.status(200).json({ data: game });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update", async (req, res) => {
  try {
    const updatedGameData = req.body;
    console.log(updatedGameData)
    if (!updatedGameData) {
      res.status(400).json({ error: "No updated game data provided" });
      return;
    }
    const updatedGame = await updateGame(updatedGameData);
    if (!updatedGame) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    res.status(200).json({ data: updatedGame, message: "Game updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await deleteGame(id);
    if (!deletedGame) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    res.status(200).json({ data: deletedGame, message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/",(req,res)=>{
  res.send("Welocome to game")
})

export const gamesRouter = router;
