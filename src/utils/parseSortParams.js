import { SORT_ORDER } from '../constants/index.js';

function parseSortBy(value) {
  if (typeof value === 'undefined') return '_id';
  const keys = [
    '_id',
    'name',
    'age',
    'gender',
    'avgMark',
    'onDuty',
    'createdAt',
    'updatedAt',
  ];
  if (keys.includes(value)) return value;
  return '_id';
}

function parseSortOrder(value) {
  if (typeof value === 'undefined') return SORT_ORDER.ASC;
  const sortOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC];
  if (sortOrder.includes(value)) return value;
  return SORT_ORDER.ASC;
}

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
