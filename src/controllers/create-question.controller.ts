import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { TokenSchema } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prismaService: PrismaService) {}
  @Post()
  async handle(
    @CurrentUser() user: TokenSchema,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body
    const { sub } = user
    await this.prismaService.question.create({
      data: {
        title,
        content,
        slug: this.convertToSlug(title),
        authorId: sub,
      },
    })
    return 'ok'
  }

  convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace('/[\u0300-\u036f]/g', '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '')
  }
}
