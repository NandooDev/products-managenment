import "dotenv/config";

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: parseNumber(process.env.PORT, 3333),
  bcryptSaltRounds: parseNumber(process.env.BCRYPT_SALT_ROUNDS, 10)
};
