const { Board, Button } = require("johnny-five");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const board = new Board({ port: "COM9" });

let voteBaburao = 0, voteNaredraModi = 0, voteRahulGandhi = 0, voteArvindKejriwal = 0;

board.on("ready", () => {
  const btnA = new Button(7);
  const btnB = new Button(6);
  const btnC = new Button(5);
  const btnD = new Button(4);
  const btnResult = new Button(3);

  btnA.on("press", () => {
    voteBaburao++;
    io.emit("updateVotes", { voteBaburao, voteNaredraModi, voteRahulGandhi, voteArvindKejriwal });
  });

  btnB.on("press", () => {
    voteNaredraModi++;
    io.emit("updateVotes", { voteBaburao, voteNaredraModi, voteRahulGandhi, voteArvindKejriwal });
  });

  btnC.on("press", () => {
    voteRahulGandhi++;
    io.emit("updateVotes", { voteBaburao, voteNaredraModi, voteRahulGandhi, voteArvindKejriwal });
  });

  btnD.on("press", () => {
    voteArvindKejriwal++;
    io.emit("updateVotes", { voteBaburao, voteNaredraModi, voteRahulGandhi, voteArvindKejriwal });
  });

  btnResult.on("press", () => {
    const winner = getWinner();
    io.emit("displayWinner", winner);
    resetVotes();
  });
});

function getWinner() {
  const maxVotes = Math.max(voteBaburao, voteNaredraModi, voteRahulGandhi, voteArvindKejriwal);
  if (maxVotes === 0) {
    return "No votes";
  } else if (voteBaburao === maxVotes && voteBaburao !== voteNaredraModi && voteBaburao !== voteRahulGandhi && voteBaburao !== voteArvindKejriwal) {
    return "Baburao";
  } else if (voteNaredraModi === maxVotes && voteNaredraModi !== voteRahulGandhi && voteNaredraModi !== voteArvindKejriwal) {
    return "Naredra Modi";
  } else if (voteRahulGandhi === maxVotes && voteRahulGandhi !== voteArvindKejriwal) {
    return "Rahul Gandhi";
  } else if (voteArvindKejriwal === maxVotes) {
    return "Arvind Kejriwal";
  } else {
    return "It's a tie";
  }
}

function resetVotes() {
  voteBaburao = 0;
  voteNaredraModi = 0;
  voteRahulGandhi = 0;
  voteArvindKejriwal = 0;
  io.emit("updateVotes", { voteBaburao, voteNaredraModi, voteRahulGandhi, voteArvindKejriwal });
  io.emit("resetWinner");
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(3000, () => {
  console.log("Server running on port 3000");
});