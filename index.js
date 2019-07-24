const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "ABC",
    number: "39-23-6423122",
    id: 5
  }
];
app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/info", (req, res) => {
  let date = new Date();
  res.end(`Phonebook has info for ${persons.length} people
${date}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end("resource not found, 404");
  }
});

app.delete("/persons/remove/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter(person => person.id !== id);

  response.end(`${person[0].name} has been deleted `);
});

app.post("/api/persons", (request, response) => {
  const generateId = () => {
    const thiId = Math.floor(Math.random() * 500);
    return thiId;
  };
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };
  if (!person.name || !person.number) {
    return response.json({
      error: "either or both of name and numbers missing"
    });
  }

  const nameArray = persons.map(n => n.name);
  nameArray.indexOf(person.name) > -1
    ? response.json({
        error: "name must be unique"
      })
    : response.send(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
