import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async (page, perPage, sortBy, sortOrder) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const limit = perPage;

  const contactsQuery = ContactsCollection.find();
  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
  ]);
  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
};

export const getContactById = async (id) => {
  const contact = ContactsCollection.findById(id);
  return contact;
};

export const createContact = async (payload) => {
  const contact = ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (id, payload) => {
  const contact = ContactsCollection.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return contact;
};

export const deleteContact = async (id) => {
  const contact = ContactsCollection.findByIdAndDelete(id);
  return contact;
};
