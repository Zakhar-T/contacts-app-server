function parseType(value) {
  if (typeof value === 'undefined') return undefined;
  const keys = ['work', 'home', 'personal'];
  if (keys.includes(value)) return value;
  return undefined;
}

function parseIsFavourite(value) {
  if (typeof value === 'undefined') return undefined;
  const parsedIsFavourite = Boolean(value);
  if (typeof parsedIsFavourite !== 'boolean') return undefined;
  return parsedIsFavourite;
}

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
