//app.js
const { MongoClient, ObjectId, Double } = require("mongodb");

async function connect() {
  if (global.db) return global.db;
  const conn = await MongoClient.connect(
    "mongodb+srv://samueo:root@webdev-backend.n5e8lbj.mongodb.net/?retryWrites=true&w=majority"
  );
  if (!conn) return new Error("Can't connect");
  global.db = await conn.db("betavo");
  return global.db;
}

const express = require("express");
const app = express();
const PORT = 3000; //porta padrão

app.use(require("cors")());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Connected to Betavo DB!" }));

router.get("/", (req, res) => res.json({ message: "Funcionando!" }));

// ==== MATCHES API ====
// GET /matches || GET /matches/{id}
router.get("/matches/:id?", async function (req, res, next) {
  try {
    const db = await connect();
    if (req.params.id) {
      res.json(
        await db
          .collection("matches")
          .findOne({ _id: new ObjectId(req.params.id) })
      );
    } else {
      res.json(await db.collection("matches").find().toArray());
    }
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// POST /matches
router.post("/matches", async function (req, res, next) {
  try {
    const user = req.body;
    const db = await connect();
    res.json(await db.collection("matches").insertOne(user));
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// PUT /matches/{id}
// PUT
router.put("/matches/:id", async function (req, res, next) {
  try {
    const user = req.body;
    const db = await connect();

    res.json(
      await db
        .collection("matches")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: user })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// DELETE /matches/{id}
// DELETE
router.delete("/matches/:id", async function (req, res, next) {
  try {
    const db = await connect();
    res.json(
      await db
        .collection("matches")
        .deleteOne({ _id: new ObjectId(req.params.id) })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// ==== BETS COLLECITON ====
// GET
router.get("/bets/:id?", async function (req, res, next) {
  try {
    const db = await connect();
    if (req.params.id) {
      res.json(
        await db
          .collection("bets")
          .findOne({ _id: new ObjectId(req.params.id) })
      );
    } else {
      res.json(await db.collection("bets").find().toArray());
    }
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// POST
router.post("/bets", async function (req, res, next) {
  try {
    const user = req.body;
    const db = await connect();
    res.json(await db.collection("bets").insertOne(user));
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// PUT
router.put("/bets/:id", async function (req, res, next) {
  try {
    const betReq = req.body;
    const db = await connect();

    console.log("betReq", betReq);

    const bet = await db
      .collection("bets")
      .findOne({ _id: new ObjectId(req.params.id) });

    const match = await db
      .collection("matches")
      .findOne({ _id: new ObjectId(bet._id_match) });

    betReq.nome_timeA = match.nome_timeA;
    betReq.nome_timeB = match.nome_timeB;
    betReq.odd_timeA = match.odd_timeA;
    betReq.odd_timeB = match.odd_timeB;

    let valorA = Math.round(bet.valor_aposta_timeA * betReq.odd_timeA);
    betReq.valor_vencedor_timeA = valorA;

    let valorB = Math.round(bet.valor_aposta_timeB * betReq.odd_timeB);
    betReq.valor_vencedor_timeB = valorB;

    res.json(
      await db
        .collection("bets")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: betReq })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// DELETE
router.delete("/bets/:id", async function (req, res, next) {
  try {
    const db = await connect();
    res.json(
      await db
        .collection("bets")
        .deleteOne({ _id: new ObjectId(req.params.id) })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// User API
// GET
router.get("/users/:id?", async function (req, res, next) {
  try {
    const db = await connect();
    if (req.params.id) {
      res.json(
        await db
          .collection("users")
          .findOne({ _id: new ObjectId(req.params.id) })
      );
    } else {
      res.json(await db.collection("users").find().toArray());
    }
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// POST /users
router.post("/users", async function (req, res, next) {
  try {
    const user = req.body;
    const db = await connect();
    res.json(await db.collection("users").insertOne(user));
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// PUT /users/{id}
// PUT
router.put("/users/:id", async function (req, res, next) {
  try {
    const user = req.body;
    const db = await connect();

    res.json(
      await db
        .collection("users")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: user })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

// DELETE /users/{id}
// DELETE
router.delete("/users/:id", async function (req, res, next) {
  try {
    const db = await connect();
    res.json(
      await db
        .collection("users")
        .deleteOne({ _id: new ObjectId(req.params.id) })
    );
  } catch (ex) {
    console.log(ex);
    res.status(400).json({ erro: `${ex}` });
  }
});

app.use("/", router);

//inicia o servidor
console.log(
  `Server runnning on PORT ${PORT}\nServer URL: http://localhost:3000/`
);
app.listen(PORT);

console.log(`Server runnning on PORT ${PORT}`);
