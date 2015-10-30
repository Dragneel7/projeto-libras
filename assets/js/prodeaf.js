var app = {};
app.server;

app.init = function() {
  app.register();
};

app.register = function() {
  var open = document.getElementById('connect');
  var close = document.getElementById('disconnect');
  var cl = function() {
    app.server.onclose();
    alert("Você foi desconectado.");
  }

  open.addEventListener('click', app.socket, false);
  close.addEventListener('click', cl, false);
};

app.socket = function() {
  var socket;
  var host = "ws://127.0.0.1:9292/";
  
  try {
    socket = new WebSocket(host, 'echo-protocol');

    socket.onopen = function(msg) {
      console.log("Conectado..");
    };

    socket.onclose = function() {
      console.log("Closed socket.");
    }

    socket.onmessage = function(message) {
      console.log("> " + message.data);
      eng.translate(message.data)
    }

  } catch(exception) {
    console.log(exception);
  }

  app.server = socket;
  
}

app.init();
