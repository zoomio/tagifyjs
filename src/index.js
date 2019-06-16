import tagifyClient from './client/tagify-client';

export function fetchTags(source, limit) {
  return tagifyClient.fetchTags({ source, limit });
}