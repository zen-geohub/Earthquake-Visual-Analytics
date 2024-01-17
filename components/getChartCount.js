const getDataCount = async () => {
  const response = await fetch('http://localhost:3000/api/Gempa/getDataCount/')
  const data = await response.json()

  return data
}
const dataCount = await getDataCount()

let labels = []
let value = []

dataCount.forEach(item => {
  labels.push(item.year.toString())
  value.push(parseInt(item.totalValue))
})

const lineData = {
  labels: labels,
  datasets: [{
    label: 'Earthquake Events',
    data: value,
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    borderColor: 'red', 
    borderWidth: 1
  }]
};

export const lineConfig = {
  type: 'line',
  data: lineData,
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    tension: 0.3,
    
  }
};
