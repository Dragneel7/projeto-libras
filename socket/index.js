#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(9292, function() {
    console.log((new Date()) + ' Server is listening on port 9292');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var id = 1;
var connections = {};

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');


    //Adicionando a conexão em objeto
    //O objeto guardará todas as conexões
    connection.id = id;
    connections[id++] = connection;

    //Mostrando quantas conxões estão ativas
    //console.log("Usuários ativos: " + Object.keys(connections).length);

    connection.sendUTF("your id is: " + connection.id);


    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            

            if (message.utf8Data == 'list') {
                // for (var i = 1; i <= Object.keys(connections).length;i++) {
                //     connection.sendUTF("id: " + i);
                // }

                for (i in connections) {
                    connection.sendUTF("id: " + i);
                }
            } else {
                var regex = /(\d+):(.*)/igm;
                var result = regex.exec(message.utf8Data);
                console.log("...: " + result + " ...");
                if (result !== null) {
                    // console.log(connections[result[1]]);
                    if (connections[result[1]]) {
                        connection_id = result[1];
                        console.log("Chat " + result[2] + ". from: " + connection.id);
                        connections[connection_id].sendUTF(result[2]);
                    }
                } else {
                    // connection.sendUTF("Else:" + message.utf8Data);
                }
            }
            

        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        //Removendo usuário do objeto de conexões
        // console.log("Usuários ativos: " + Object.keys(connections).length);
        delete connections[connection.id];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        
    });
});
