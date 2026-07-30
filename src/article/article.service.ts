import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Fests, Fest } from 'src/models';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async createArticle(fests: Fests) {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.prisma.dailyFestival.findUnique({
      where: { date: new Date(today) },
    });
    if (existing) {
      return {
        date: today,
        fest1Id: existing.fest1Id,
        fest1Name: existing.fest1Name,
        fest1Desc: existing.fest1Desc,
        fest2Id: existing.fest2Id,
        fest2Name: existing.fest2Name,
        fest2Desc: existing.fest2Desc,
        createdAt: existing.createdAt,
      };
    }
    const respdb = await this.prisma.article.findMany({
      select: { title: true },
    });
    const dbNames = respdb.map((item) => item.title);
    const missingFests = fests.festivalsandcultures.filter(
      (fest) => !dbNames.includes(fest?.name),
    );
    function pickTwo(list: Fest[]) {
      const shuffled = [...list].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 2);
    }
    let selectedFests: Fest[] = [];
    if (missingFests.length >= 2) {
      selectedFests = pickTwo(missingFests);
    } else {
      selectedFests = pickTwo(fests.festivalsandcultures);
    }

    const fest1 = await this.prisma.article.create({
      data: {
        title: selectedFests[0].name,
        text: selectedFests[0].description,
        time: new Date(),
      },
    });

    const fest2 = await this.prisma.article.create({
      data: {
        title: selectedFests[1].name,
        text: selectedFests[1].description,
        time: new Date(),
      },
    });
    const festival = await this.prisma.dailyFestival.create({
      data: {
        date: new Date(today),
        fest1Id: fest1.id,
        fest1Name: selectedFests[0].name,
        fest1Desc: selectedFests[0].description,
        fest2Id: fest2.id,
        fest2Name: selectedFests[1].name,
        fest2Desc: selectedFests[1].description,
        createdAt: new Date(),
      },
    });

    return festival;
  }

  async delete(articleId: string) {
    return this.prisma.article.delete({
      where: { id: articleId },
    });
  }
}
