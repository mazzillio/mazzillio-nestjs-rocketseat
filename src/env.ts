import { z } from 'zod'
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3500),
  JWT_SECRET: z.string(),
  JWT_PUBLIC: z.string(),
})

type TypeEnv = z.infer<typeof envSchema>

export { envSchema, TypeEnv }
