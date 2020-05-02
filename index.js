const dgram = require("dgram");
const server = dgram.createSocket("udp4");

let timeout;

server.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on("message", (msg, rinfo) => {
  if (msg.length > 16) {
    clearTimeout(timeout);
    const token = msg.slice(-16);
    console.log(`got token: ${token.toString("hex")}`);
    server.close();
    process.exit(0);
  }
});

server.on("listening", () => {
  timeout = setTimeout(() => {
    console.error("timeout");
    server.close();
    process.exit(1);
  }, 10000);
  console.log("sending magic message");
  server.send(
    Buffer.from(
      "21310020ffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "hex"
    ),
    54321,
    "192.168.8.1"
  );
});

server.bind();
