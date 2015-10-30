var app = {};
app.server;

app.init = function() {
  app.register();
};

app.register = function() {
  var send = document.getElementById('send');
  var open = document.getElementById('connect');
  var close = document.getElementById('disconnect');
  
  var cl = function() {
    app.server.onclose();
    alert("Você foi desconectado.");
  }

  var sent = function() {
    var msg = document.getElementById('bar');
    app.server.send(msg.value);
  }

  send.addEventListener('click', sent, false);
  open.addEventListener('click', app.socket, false);
  close.addEventListener('click', cl, false);
};

app.print = function(msg) {
  var area = document.getElementById('sent');
  area.value += ('> ' + msg + '\n');
  // area.value += '\n';

}

app.socket = function() {
  var socket;
  var host = "ws://127.0.0.1:9292/";
  
  try {
    socket = new WebSocket(host, 'echo-protocol');

    socket.onopen = function(msg) {
      console.log("Conectado..");
      // socket.send("Hello..");
      alert("Conectado");
    };

    socket.onclose = function() {
      console.log("Closed socket.");
    }

    socket.onmessage = function(message) {
      console.log("> " + message.data);
      app.print(message.data);
      
    }

  } catch(exception) {
    console.log(exception);
  }

  app.server = socket;
  
}

app.init();
