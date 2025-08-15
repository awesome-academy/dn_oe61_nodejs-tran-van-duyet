import { Controller, Get, Render, Query } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { PLAN_COLORS, DEFAULT_COLOR } from '../../config/plan-colors';
@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  @Render('revenue/index')
  async showRevenue(
    @I18n() i18n: I18nContext,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('group') group: 'month' | 'year' = 'month',
  ) {
    const { revenueData, totalFree, totalPremium } =
      await this.revenueService.getRevenueGrouped(group, start, end);

    const periods = [...new Set(revenueData.map((d) => d.period))];
    const plans = [...new Set(revenueData.map((d) => d.plan_name))];

    const revenueMap = new Map<string, number>();
    for (const item of revenueData) {
      const key = `${item.period}|${item.plan_name}`; 
      revenueMap.set(key, Number(item.revenue));
    }

    const datasets = plans.map((plan) => {
      const colors = PLAN_COLORS[plan] || DEFAULT_COLOR;
      return {
        label: plan,
        data: periods.map((period) => {
          const key = `${period}|${plan}`;
          return revenueMap.get(key) || 0;
        }),
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
      };
    });

    return {
      periods,
      datasets,
      revenueData, 
      totalPremium,
      totalFree,
      filters: { start, end, group },
      isRevenuePage: true,
      t: i18n.t('revenue'),
      l: i18n.t('layout')
    };
  }
}
