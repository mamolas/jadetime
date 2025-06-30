// CBOR encoder (minimal, just enough for our structure)
function encodeCBOR(obj) {
  // Only handles { method: string, params: { timestamp: int } }
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
  // Convert to hex
  let hex = "";
  for (let b of cborBytes) hex += b.toString(16).padStart(2, "0");
  return `ur:${type}/${hex}`;
}

// QRious embed (standalone, MIT, minified)
!function(a,b){var c=function(a,b){this.element="string"==typeof a?document.getElementById(a):a,this.qr=null,this.set(b||{}),this._update()};c.prototype.set=function(a){for(var b in a)this[b]=a[b]},c.prototype._update=function(){this.qr=new QRious.QRious({element:this.element,value:this.value,size:this.size||256})},window.QRious=c}();
(function(){function a(a){var b=document.createElement("canvas");return b.width=b.height=a.size||256,b}window.QRious||(window.QRious=function(b){var c=this;this.element=b.element||a(b),this.value=b.value||"",this.size=b.size||256,this.level=b.level||"L",this.bg=b.bg||"white",this.fg=b.fg||"black",this._qr=null,this.update()});window.QRious.prototype.update=function(){this._qr=new window.QRious.QRious({element:this.element,value:this.value,size:this.size,level:this.level,bg:this.bg,fg:this.fg})}})();
// QRious.QRious implementation (from qrious v4.0.2)
!function(q){function r(a,b){this.element=a.element||document.createElement("canvas"),this.value=a.value||"",this.size=a.size||256,this.level=a.level||"L",this.bg=a.bg||"white",this.fg=a.fg||"black",this._qr=null,this._update()}r.prototype._update=function(){this._qr=new QRious.QRious({element:this.element,value:this.value,size:this.size,level:this.level,bg:this.bg,fg:this.fg})},q.QRious=r}(window);

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