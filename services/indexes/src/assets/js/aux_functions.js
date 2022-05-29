const formatDate = (unformattedDate) => {
  let date = new Date(unformattedDate);

  date = date.toLocaleString([], {
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
  });

  return date;
}
