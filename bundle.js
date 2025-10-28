// CBOR encoder (minimal, just enough for our structure)
function encodeCBOR(obj) {
  const method = obj.method;
  const epoch = obj.params.epoch;  // Changed from timestamp to epoch
  const id = obj.id;
  
  const methodBytes = [];
  for (let i = 0; i < method.length; ++i) methodBytes.push(method.charCodeAt(i));
  
  const idBytes = [];
  for (let i = 0; i < id.length; ++i) idBytes.push(id.charCodeAt(i));
  
  // Map of 3 pairs: "id", "method" and "params"
  const arr = [
    0xa3, // map(3)
      0x62, // text(2)
        ...String.fromCharCode(105, 100).split('').map(c => c.charCodeAt(0)), // "id"
      0x60 + id.length, // text(id.length)
        ...idBytes, // id string
      0x66, // text(6)
        ...[109,101,116,104,111,100], // "method"
      0x69, // text(9)
        ...[115,101,116,95,101,112,111,99,104], // "set_epoch"
      0x66, // text(6)
        ...[112,97,114,97,109,115], // "params"
      0xa1, // map(1)
        0x65, // text(5)
          ...[101,112,111,99,104], // "epoch" (changed from "timestamp")
        0x1a, // uint32
          (epoch >> 24) & 0xff,
          (epoch >> 16) & 0xff,
          (epoch >> 8) & 0xff,
          epoch & 0xff
  ];
  return new Uint8Array(arr);
}

// BC-UR encoding ("ur:jade-msg/<hex>")
function toUR(type, cborBytes) {
  let hex = "";
  for (let b of cborBytes) hex += b.toString(16).padStart(2, "0");
  return `ur:${type}/${hex}`;
}

// Main logic
window.onload = function () {
  const now = Math.floor(Date.now() / 1000);
  const cborObj = {
    id: String(Math.floor(Math.random() * 1000000)),
    method: "set_epoch",
    params: { epoch: now },  // Fixed: changed from 'timestamp' to 'epoch'
  };
  const cborData = encodeCBOR(cborObj);
  const urString = toUR("jade-msg", cborData);

  document.getElementById("ur").textContent = urString;

  new QRious({
    element: document.getElementById("qr"),
    value: urString,
    size: 256,
  });
};