import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext } from 'nestjs-i18n';
import { Plan } from 'src/entities/Plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(Plan) 
        private readonly plansRepository: Repository<Plan> 
    ) {}

    async findAll(): Promise<Plan[]> {
        return await this.plansRepository.find();
    }

    async findOne(id: number, i18n: I18nContext): Promise<Plan | null> {
        const plan = await this.plansRepository.findOne({
            where: { id },
        });
        if (!plan) {
            throw new NotFoundException(i18n.t('plan.plan_not_found'));
        }
        return plan;
    }
}
