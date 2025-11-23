import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import { ISaleNote } from "./interfaces/ISaleNote";
import { notifyClientSNS } from "./services/notificationService";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.send("SNS Notification Server is running");
});

app.post("/notify", async (req, res) => {
  try {
    const notaVenta: ISaleNote = req.body;

    if (!notaVenta || !notaVenta.cliente || !notaVenta.folio) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    await notifyClientSNS(notaVenta);

    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error: any) {
    console.error("Error notifying client:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
