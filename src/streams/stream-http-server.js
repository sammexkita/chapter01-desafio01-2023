import http from "node:http";
import { parse } from "csv-parse";

const server = http.createServer(async (req, res) => {
  const sheet = `"title","description"
  "Se alimentar bem","Você deve se alimentar bem para ter uma saúde equilibrada"
  "Fazer exercícios","Os exercícios ajudam a melhor sua saúde"
  "Estudar","Os estudos fortalecem seu cérebro e sua mente"`;

  const parser = parse(sheet, {
    trim: true,
    columns: true,
  });

  for await (const record of parser) {
    console.log(record);
    fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify(record),
    }).then(res => {
      return res.text();
    }).then(data => {
      console.log(data);
    }).catch(e => {
      console.log(e);
    });
  }

  return res.end();
});

server.listen(3334, () => {
  console.log("Server running on port 3334 🚀");
});