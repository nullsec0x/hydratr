const canvas = document.getElementById('hydrationChart');
if (canvas) {
    const labels = JSON.parse(canvas.dataset.labels || '[]');
    const chartData = JSON.parse(canvas.dataset.values || '[]');
    const chartGoals = JSON.parse(canvas.dataset.goals || '[]');
    
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.7)';
    const borderColor = isDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)';
    const goalLineColor = isDarkMode ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)';
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const chart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Intake',
                    data: chartData,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                },
                {
                    label: 'Daily Goal',
                    data: chartGoals,
                    type: 'line',
                    fill: false,
                    borderColor: goalLineColor,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: goalLineColor,
                    pointBorderColor: isDarkMode ? '#1f2937' : '#ffffff',
                    pointBorderWidth: 2,
                    tension: 0.1,
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Milliliters (ml)',
                        color: textColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value + 'ml';
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day of Week',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    titleColor: isDarkMode ? '#ffffff' : '#000000',
                    bodyColor: isDarkMode ? '#ffffff' : '#000000',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + 'ml';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart',
                onProgress: function(animation) {
                },
                onComplete: function() {
                }
            }
        }
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const isNowDark = document.documentElement.classList.contains('dark');
                const newTextColor = isNowDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
                const newGridColor = isNowDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                
                chart.options.scales.y.ticks.color = newTextColor;
                chart.options.scales.y.title.color = newTextColor;
                chart.options.scales.y.grid.color = newGridColor;
                chart.options.scales.x.ticks.color = newTextColor;
                chart.options.scales.x.title.color = newTextColor;
                chart.options.scales.x.grid.color = newGridColor;
                chart.options.plugins.legend.labels.color = newTextColor;
                chart.options.plugins.tooltip.backgroundColor = isNowDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';
                chart.options.plugins.tooltip.titleColor = isNowDark ? '#ffffff' : '#000000';
                chart.options.plugins.tooltip.bodyColor = isNowDark ? '#ffffff' : '#000000';
                
                chart.update();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
}

