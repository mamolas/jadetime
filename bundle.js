// CBOR encoder (minimal, just enough for our structure)
function encodeCBOR(obj) {
  const method = obj.method;
  const timestamp = obj.params.timestamp;
  const methodBytes = [];
  for (let i = 0; i < method.length; ++i) methodBytes.push(method.charCodeAt(i));
  // Map of 2 pairs: "method" and "params"
  const arr = [
    0xa2, // map(2)
      0x66, // text(6)
        ...[109,101,116,104,111,100], // "method"
      0x6a, // text(10)
        ...methodBytes, // method string
      0x66, // text(6)
        ...[112,97,114,97,109,115], // "params"
      0xa1, // map(1)
        0x69, // text(9)
          ...[116,105,109,101,115,116,97,109,112], // "timestamp"
        0x1a, // uint32
          (timestamp >> 24) & 0xff,
          (timestamp >> 16) & 0xff,
          (timestamp >> 8) & 0xff,
          timestamp & 0xff
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
    method: "set_epoch",
    params: { timestamp: now },
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