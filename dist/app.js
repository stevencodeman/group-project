document.querySelectorAll('.task-card').forEach((card) => {
  const checkbox = card.querySelector(':scope input[type="checkbox"]')

  card.onclick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    card
      .querySelector(':scope input[type="checkbox"]')
      ?.dispatchEvent(new Event('change'))
  }

  checkbox.addEventListener('change', (e) => {
    e.stopPropagation()
    e.preventDefault()

    checkbox.checked = !checkbox.checked

    checkbox.checked
      ? card.classList.add('completed')
      : card.classList.remove('completed')
  })
})
