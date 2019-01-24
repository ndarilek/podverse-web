import axios from 'axios'
import { alertIfRateLimitError, convertObjectToQueryString } from '~/lib/utility'
import config from '~/config'
const { API_BASE_URL } = config()

export const getPodcastsByQuery = async (query, nsfwMode = 'on') => {
  let filteredQuery: any = {}

  if (query.sort) {
    filteredQuery.sort = query.sort
  } else {
    filteredQuery.sort = 'top-past-week'
  }

  if (query.page) {
    filteredQuery.page = query.page
  } else {
    filteredQuery.page = 1
  }

  if (query.from === 'from-category') {
    filteredQuery.categories = query.categories
  } else if (query.from === 'subscribed-only') {
    filteredQuery.podcastId = query.subscribedPodcastIds
  } else { // from = all-podcasts
    // add nothing
  }

  if (query.searchBy === 'podcast') {
    filteredQuery.searchTitle = query.searchText
  } else if (query.searchBy === 'host') {
    filteredQuery.searchAuthor = query.searchText
  }

  const queryString = convertObjectToQueryString(filteredQuery)
  return axios(`${API_BASE_URL}/podcast?${queryString}`, {
    method: 'get',
    headers: {
      nsfwMode
    }
  })
}

export const getPodcastById = async (id: string) => {
  return axios.get(`${API_BASE_URL}/podcast/${id}`);
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`${API_BASE_URL}/podcast/toggle-subscribe/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
  .catch(err => {
    if (err && err.response && err.response.data.message === 429) {
      alertIfRateLimitError(err)
      return
    }
    throw err
  })
}
