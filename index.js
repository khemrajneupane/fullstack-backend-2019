const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

var jsonfile = require("jsonfile");

const filePath = __dirname + "/" + "persons.json";

const cors = require("cors");
app.use(cors());

var morgan = require("morgan");

morgan.token("data", function(req, res) {
  if (req.method === "DELETE") {
    return JSON.stringify(req.params);
  } else if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return;
});

app.use(morgan(":method :url :status :response-time ms :data"));

/**http://localhost:3001/api/persons */
app.get("/api/persons/", function(req, res) {
  jsonfile
    .readFile(filePath)
    .then(obj => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(JSON.stringify(obj));
    })
    .catch(() => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end();
      console.error("Reading server side JSON file failed.");
    });
});

/**http://localhost:3001/info */
app.get("/info", (req, res) => {
  let date = new Date();
  jsonfile
    .readFile(filePath)
    .then(obj => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Phonebook has info for ${obj.length} people
${date}`);
    })
    .catch(error => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(error);
    });
});

/**http://localhost:3001/persons/1 */
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  jsonfile
    .readFile(filePath)
    .then(obj => {
      res.send(obj.find(person => person.id === id));
    })

    .catch(error => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(error);
    });
});
/**http://localhost:3001/persons/1 */
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  jsonfile
    .readFile(filePath)
    .then(obj => {
      jsonfile.writeFile(filePath, obj.filter(person => person.id !== id));
      res.send(obj.filter(person => person.id !== id));
    })
    .catch(error => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(error);
    });
});

/**http://localhost:3001/api/persons/*/
app.post("/api/persons/", (req, res) => {
  const generateId = () => {
    const thiId = Math.floor(Math.random() * 500);
    return thiId;
  };

  const body = req.body;
  const person = {
    name: body.name,
    number: Number(body.number),
    id: generateId()
  };
  if (person.name && person.number) {
    jsonfile
      .readFile(filePath)
      .then(obj => {
        const nameArr = obj.map(n => n.name === person.name);

        if (nameArr.indexOf(true) < 0) {
          jsonfile.writeFile(filePath, obj.concat(person));
          res.send(obj.concat(person));
        } else {
          console.log("this name is already used");
          jsonfile.writeFile(filePath, obj);
          res.send(obj);
        }
      })
      .catch(error => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        console.dir(error);
        res.end();
      });
  } else {
    res.end();
    console.log("name number errors");
  }
});
/**put */
app.put("/api/persons/:id", (req, res) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: Number(body.number),
    id: body.id
  };
  jsonfile
    .readFile(filePath)
    .then(obj => {
      const newArr = obj.filter(m => m.id !== person.id);
      console.log(newArr);
      jsonfile.writeFile(filePath, newArr.concat(person));
      res.send(newArr.concat(person));
      /*  const namesArray = obj.filter(n => n.name !== person.name);
      const nArray = obj.filter(n => n.name !== person.name);
      //const numArray = obj.map(n => n.id === person.id);
      console.log(nArray);
      const matchingNames = nArray.filter(n => n.name === person.name);
      console.log(matchingNames);
      jsonfile.writeFile(filePath, namesArray.concat(person));
      res.send(namesArray.concat(person));
      */
    })
    .catch(error => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.dir(error);
      res.end();
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
