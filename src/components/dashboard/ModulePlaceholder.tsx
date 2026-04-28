type ModulePlaceholderProps = {
  title: string
  description: string
}

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="module-placeholder">
      <h1 className="module-placeholder__title">{title}</h1>
      <p className="module-placeholder__text">{description}</p>
    </div>
  )
}
