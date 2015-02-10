#!/bin/bash
SERVER=$1

if [ -f "./servers/$SERVER/run_server.sh" ]; then
   echo "Starting server $SERVER"
   mv ./logs/$SERVER.log logs/$SERVER.log.1
   cd ./servers/$SERVER/
   sh run_server.sh | tee -a ../../logs/$SERVER.log
else
   echo "Server $SERVER does not exist."
fi
