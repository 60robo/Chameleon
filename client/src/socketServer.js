useEffect(() => {
    const socket = new WebSocket("ws://localhost:6969");

    socket.addEventListener("open", (event) => {
      wsRef.current = socket;
    });
    
    socket.addEventListener("message", (event) => {
      var message = event.data;
      var message = JSON.parse(message);
      if (message.type == "data"){
        setStatus(message.status);
        setPlayers(message.players);
        console.log(message.players);

      } else if (message.type == "location") {
        setLocation(message.location);
        setRole(message.role);
      }

    });
  
    return() => {
      socket.close();
    };
  }, []);