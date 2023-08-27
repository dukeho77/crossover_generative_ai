import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tag } from './tag.entity';
import { ITagsRO } from './tag.interface';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<ITagsRO> {
    const tags = await this.tagRepository.findAll();
    return { tags: tags.map((tag) => tag.tag) };
  }

  async create(tagNames: string[]): Promise<void> {
    for (const tagName of tagNames) {
      let tag = await this.tagRepository.findOne({ tag: tagName });
      if (!tag) {
        tag = new Tag();
        tag.tag = tagName;
        this.em.persist(tag); // Use persist instead of persistAndFlush
      }
    }
    await this.em.flush(); // Flush after all tags are persisted
  }
}
