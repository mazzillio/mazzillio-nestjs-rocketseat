import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TypeEnv } from 'src/env'
import { z } from 'zod'

export const tokenSchema = z.object({
  sub: z.string().uuid(),
})
export type TokenSchema = z.infer<typeof tokenSchema>
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService<TypeEnv, true>) {
    const publickey = config.get('JWT_PUBLIC', { infer: true })
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publickey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: TokenSchema) {
    return tokenSchema.parse(payload)
  }
}
