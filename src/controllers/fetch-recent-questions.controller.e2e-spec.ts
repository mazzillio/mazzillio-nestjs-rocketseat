import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
describe('Fetch Recent Questions (E2E)', () => {
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
  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'jhon Doe',
        email: 'jhondoe@example.com',
        password: 'teste',
      },
    })
    await prisma.question.createMany({
      data: [
        {
          title: 'Question 1',
          slug: 'question1',
          content: 'content question',
          authorId: user.id,
        },
        {
          title: 'Question 2',
          slug: 'question2',
          content: 'content question',
          authorId: user.id,
        },
      ],
    })
    const accessToken = jwtService.sign({ sub: user.id })
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 1' }),
        expect.objectContaining({ title: 'Question 2' }),
      ],
    })
  })
})
