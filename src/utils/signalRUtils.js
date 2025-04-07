import * as signalR from "@microsoft/signalr";

export const createSignalRConnection = (baseUrl, hubPath) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/${hubPath}`)
    .withAutomaticReconnect()
    .build();
};

export const createSignalRConnectionWithToken = (baseUrl, hubPath, token) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/${hubPath}`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
};

export const setupSignalREventHandlers = (connection, eventHandlers) => {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    connection.on(event, handler);
  });
};

export const invokeSignalRMethod = async (connection, methodName, ...args) => {
  if (
    !connection ||
    connection.state !== signalR.HubConnectionState.Connected
  ) {
    console.warn(`Cannot invoke ${methodName}: SignalR is not connected.`);
    return;
  }
  try {
    await connection.invoke(methodName, ...args);
  } catch (err) {
    console.error(`Error invoking ${methodName}`, err);
  }
};

export const startSignalRConnection = async (connection, setConnection) => {
  try {
    await connection.start();
    setConnection(connection);
    console.log("SignalR connection started");
  } catch (err) {
    console.error("Error while starting the SignalR connection", err);
  }
};

export const stopSignalRConnection = (connection, events = []) => {
  if (connection) {
    events.forEach((event) => connection.off(event));
    connection.stop();
  }
};
