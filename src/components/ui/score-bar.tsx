interface ScoreBarProps {
  score: number
  maxScore?: number
}

const ScoreBar = ({ score, maxScore = 10 }: ScoreBarProps) => {
  const percent = Math.min((score / maxScore) * 100, 100)

  const getBarColor = (p: number) => {
    
    if (p < 50) {
      
      const ratio = p / 50
      const r = Math.round(139 + (204 - 139) * ratio)   
      const g = Math.round(0 + (85 - 0) * ratio)          
      const b = 0
      return `rgb(${r}, ${g}, ${b})`
    } else {
      // orange to green
      const ratio = (p - 50) / 50
      const r = Math.round(204 - (204 - 0) * ratio)      
      const g = Math.round(85 + (100 - 85) * ratio)       
      const b = 0
      return `rgb(${r}, ${g}, ${b})`
    }
  }

  const barColor = getBarColor(percent)

  return (
    <div className="w-full h-4 rounded bg-gray-200 overflow-hidden">
      <div
        className="h-full transition-all duration-300"
        style={{
          width: `${percent}%`,
          backgroundColor: barColor,
        }}
      />
    </div>
  )
}

export default ScoreBar
