const dateNow = () => {
  const date = new Date().toDateString();
  return new Date(date).getTime();
};

export default dateNow;
