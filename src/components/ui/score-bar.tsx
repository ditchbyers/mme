interface ScoreBarProps {
  score: number 
  maxScore?: number
}

const ScoreBar = ({ score, maxScore = 10 }: ScoreBarProps) => {
  const percent = Math.min((score / maxScore) * 100, 100)
  const getBarColor = (p: number) => {
    const r = p < 50 ? 255 : Math.floor(255 - ((p - 50) * 2 * 255) / 100)
    const g = p < 50 ? Math.floor((p * 2 * 255) / 100) : 255
    return `rgb(${r}, ${g}, 0)`
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