export default function Pagination({ page = 0, totalPages = 0, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="actions" role="navigation" aria-label="Pagination">
      <button type="button" onClick={() => onPageChange(0)} disabled={page === 0}>&laquo; First</button>
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 0}>Prev</button>
      <span>Page {page + 1} of {totalPages}</span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}>Next</button>
      <button type="button" onClick={() => onPageChange(totalPages - 1)} disabled={page >= totalPages - 1}>Last &raquo;</button>
    </div>
  )
}
