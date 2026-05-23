import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { horizons } from "./horizons.js";
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 8080;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const trackedBodies = [
  {
    name: "Saturn",
    id: 699,
  },
  {
    name: "Space X Roadster",
    id: -143205
  },
  {
    name: "James Webb",
    id: -170
  },
  {
    name: "Hubble",
    id: -48
  },
  {
    name: "Voyager 1",
    id: -31
  },
  {
    name: "Voyager 2",
    id: -32
  }
]

// Store data in memory
let dataInMemory = await refreshAll()

async function refreshAll() {
  const data: any[] = [];

  for (const body of trackedBodies) {
    await sleep(1000);

    try {
      const result = await horizons(body.id);
      data.push(result);
      console.log("[ROUTE] Refresh " + body.name) 

    } catch (err) {
      console.error("Failed:", body.name, err);
      data.push(null);
    }
  }

  console.log("[UPDATE] Done ", new Date().toISOString());
  return data;
}

async function scheduler() {
  try {
    dataInMemory = await refreshAll()
  // console.log(dataInMemory)

  } catch (err) {
    console.error("Refresh failed:", err)
  } finally {
    setTimeout(scheduler, 1000 * 60 * 60) // Update every hour
  }
}
scheduler()

// middlewares
app.use(express.json())
app.use(cors())
app.use(logResponses)

function logResponses(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
        const statusCode = res.statusCode
        if (statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`)
          }
        else{
            console.log(`[OK] ${req.method} ${req.url} - Status: ${statusCode}`)
        }
    })
    next()
}

// handlers
function makeGetHandler(name: string, id: number){
  console.log("[ROUTE] Added " + name)
  return async (req: Request, res: Response) => {
    const data = dataInMemory.find((b) => b.id === id)
    res.json(data)
  }
}

trackedBodies.forEach((body)=>{
  const route = body.name.toLowerCase().replace(/\s+/g, "-")
  app.get("/" + route, makeGetHandler(route, body.id))
})

app.listen(PORT, () => {
  console.log(`[SERVER] Running at http://localhost:${PORT}`);
})

