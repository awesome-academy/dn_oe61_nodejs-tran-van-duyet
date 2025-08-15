import { Controller, Get, Render, Query } from '@nestjs/common';
import { RevenueService } from './revenue.service';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get()
  @Render('revenue/index')
  async showRevenue(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('group') group: 'month' | 'year' = 'month',
  ) {
    const data = await this.revenueService.getRevenueGrouped(group, start, end);

    const periods = [...new Set(data.map((d) => d.period))];
    const plans = [...new Set(data.map((d) => d.plan_name))];

    const datasets = plans.map((plan) => ({
      label: plan,
      data: periods.map((period) => {
        const found = data.find(
          (d) => d.period === period && d.plan_name === plan,
        );
        return found ? Number(found.revenue) : 0;
      }),
      backgroundColor:
        plan === 'Premium'
          ? 'rgba(54, 162, 235, 0.6)'
          : 'rgba(75, 192, 192, 0.6)',
      borderColor:
        plan === 'Premium' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }));

    let totalPremium = 0;
    let totalFree = 0;
    data.forEach((d) => {
      if (Number(d.plan_id) === 2) { // Premium
        totalPremium += Number(d.user_count);
      } else if (Number(d.plan_id) === 1) { // Free
        totalFree += Number(d.user_count);
      }
    });

    return {
      periods,
      datasets,
      data, 
      totalPremium,
      totalFree,
      filters: { start, end, group },
      isRevenuePage: true,
    };
  }
}
