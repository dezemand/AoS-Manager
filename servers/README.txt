Adding servers:

1. Download the PySnip source from BitBucket
2. Extract whatever is in it
3. Make sure your path is like:
   servers/$SERVERID/feature_server
4. Run the build script build.sh
5. Add the $SERVERID from step 3 in the servers file
6. Run the server with
   screen -dmS $SERVERID sh start.sh $SERVERID
7. Find the server in the server list 