import { z } from 'zod'
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3500),
})

type TypeEnv = z.infer<typeof envSchema>

export { envSchema, TypeEnv }
