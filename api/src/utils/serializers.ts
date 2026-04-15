export const toJsonSafe = <T>(data: T): T => {
  return JSON.parse(
    JSON.stringify(data, (_key, value: unknown) => {
      if (typeof value === "bigint") {
        return value.toString();
      }

      return value;
    })
  ) as T;
};
