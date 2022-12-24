const paginate = (comments: any) => {
  const itemsPerPage = 5;
  const numberOfPages = Math.ceil(comments.length / itemsPerPage);

  const newFollowers = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;
    return comments.slice(start, start + itemsPerPage);
  });

  return newFollowers;
};

export default paginate;