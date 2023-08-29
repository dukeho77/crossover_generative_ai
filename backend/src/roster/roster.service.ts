import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Injectable()
export class RosterService {

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>
  ) {}

  async getUserStats(): Promise<any> {
    const users = await this.userRepository.findAll();

    const userStatsPromises = users.map(async user => {
      const articles = await this.articleRepository.find({ author: user });
      const totalArticles = articles.length;
      const totalLikes = articles.reduce((sum, article) => sum + article.favoritesCount, 0);
      const sortedArticles = articles.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      const firstArticleDate = sortedArticles.length ? sortedArticles[0].createdAt : null;

      return {
        username: user.username,
        profileLink: `/profile/${user.username}`,
        totalArticles,
        totalLikes,
        firstArticleDate
      };
    });

    const userStats = await Promise.all(userStatsPromises);

    // Sort the user stats by highest likes
    const sortedUserStats = userStats.sort((a, b) => b.totalLikes - a.totalLikes);

    return sortedUserStats;
  }
}
