import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity'
import { UserModule } from '../user/user.module'; // Adjust the path to your UserModule

import { Article } from '../article/article.entity'
import { RosterService } from './roster.service';
import { RosterController } from './roster.controller';

@Module({
  imports: [UserModule, MikroOrmModule.forFeature({ entities: [Article, User]})], // Ensure UserRepository is imported here
  providers: [RosterService],
  controllers: [RosterController],
})
export class RosterModule {}
