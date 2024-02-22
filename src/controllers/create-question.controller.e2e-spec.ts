import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwtService = moduleRef.get(JwtService)
    await app.init()
  })
  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'jhon Doe',
        email: 'jhondoe@example.com',
        password: await hash('teste', 8),
      },
    })
    const accessToken = jwtService.sign({ sub: user.id })
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'new Question',
        content: 'content new question',
      })
    expect(response.statusCode).toBe(201)
    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'new Question',
      },
    })
    expect(questionOnDatabase).toBeTruthy()
  })
})
