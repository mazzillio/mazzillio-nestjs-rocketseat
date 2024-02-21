import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeEnv } from 'src/env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<TypeEnv, true>) {
        const secretJwt = config.get('JWT_SECRET', { infer: true })
        const publicJwt = config.get('JWT_PUBLIC', { infer: true })
        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(secretJwt, 'base64'),
          publicKey: Buffer.from(publicJwt, 'base64'),
        }
      },
    }),
  ],
})
export class AuthModule {}
