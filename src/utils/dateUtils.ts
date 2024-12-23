
export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0].substring(0, 5)
  };
};
