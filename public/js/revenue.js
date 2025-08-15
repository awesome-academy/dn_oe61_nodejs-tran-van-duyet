
const periods = JSON.parse(document.getElementById('chart-data').dataset.periods);
let datasets = JSON.parse(document.getElementById('chart-data').dataset.datasets);
const totalFree = parseInt(document.getElementById('chart-data').dataset.totalFree);
const totalPremium = parseInt(document.getElementById('chart-data').dataset.totalPremium);

datasets = datasets.filter(ds => ds.label);

const ctx = document.getElementById('revenueChart').getContext('2d');
let revenueChart;

function renderChart(type) {
  if (revenueChart) {
    revenueChart.destroy();
  }

  if (type === 'pie') {
    revenueChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Free', 'Premium'],
        datasets: [{
          data: [totalFree, totalPremium],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { 
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                let value = context.parsed || 0;
                let total = context.chart._metasets[0].total;
                let percentage = ((value / total) * 100).toFixed(2) + '%';
                return `${label}: ${value} (${percentage})`;
              }
            }
          }
        }
      }
    });
  } else {
    let filteredDatasets = datasets.filter(ds => ds.label && ds.label.toLowerCase() !== 'free');
    revenueChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: periods, datasets: filteredDatasets },
      options: { 
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}

// Render mặc định là bar
renderChart('bar');

// Khi thay đổi chartType
document.getElementById('chartType').addEventListener('change', function () {
  renderChart(this.value);
});
