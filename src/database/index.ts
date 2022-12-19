import { Connection, createConnection, getConnectionOptions } from 'typeorm';

const createNewConnection = async(): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database: process.env.NODE_ENV === "test" ? "fin_api_test" : "fin_api"
    })
  );
}

export { createNewConnection };
