interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  style?: React.CSSProperties
}

function Card({ children, className = '', hover = false, style }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-[0_-2px_8px_rgba(0,0,0,0.05),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] overflow-hidden ${
        hover ? 'transition-transform duration-200 hover:shadow-xl hover:-translate-y-1' : 'transition-shadow hover:shadow-lg'
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

export default Card
