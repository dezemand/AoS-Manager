var socket = io();

socket.emit("getlist");
socket.emit("updateserverlist");
var refreshInterval = setInterval(function() {socket.emit("getlist");}, 2000);
var updateInterval = setInterval(function() {socket.emit("updateserverlist");}, 20000);

socket.on('list', function (list) {
  $("#hiddenservertable").html("");
  for (var key in list) {
    if (list.hasOwnProperty(key)) {
      var obj = list[key];
      var row = "<tr class='%1'>%2</tr>";
      var cols = {
        id: "<td class='serv-id'>%1</td>",
        slots: "<td class='serv-slots'>%1/%2</td>",
        name: "<td class='serv-name'>%1</td>",
        map: "<td class='serv-map'>%1<br><span>By %2</span></td>",
        gm: "<td class='serv-gm'>%1</td>",
        join: "<td class='serv-join'><a class='btn btn-default btn-xs' %1 href='aos://%2:%3'>Join</a></td>"
      };
      cols.id = cols.id.replace("%1", obj.server);
      cols.name = cols.name.replace("%1", obj.name);
      cols.gm = cols.gm.replace("%1", obj.gamemode);
      cols.slots = cols.slots.replace("%1", obj.players).replace("%2", obj.maxplayers);
      if(obj.status == "online") {
        cols.join = cols.join.replace("%1", "").replace("%2", obj.identifier).replace("%3", obj.port);
        cols.map = cols.map.replace("%1", obj.map[0]).replace("%2", obj.map[1]);
        row = row.replace("%1", "");
      } else {
        cols.map = cols.map.replace("%1", "").replace("%2", "");
        cols.join = cols.join.replace("%1", "disabled").replace("%2", "").replace("%3", "");
        row = row.replace("%1", "danger");
      }
      row = row.replace("%2", cols.id + cols.slots + cols.name + cols.map + cols.gm + cols.join);
      $("#hiddenservertable").append(row);
    }
  }
  $("#servertable tbody").html($("#hiddenservertable tbody").html());
});
