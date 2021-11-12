import axios from 'axios'
import { PV } from '~/resources'
import { request } from '~/services/request'

type PodcastQueryParams = {
  categories?: string[]
  from?: string
  maxResults?: boolean
  page?: number
  podcastIds?: string[]
  searchBy?: string
  searchText?: string
  sort?: string
}

export const getPodcastsByQuery = async ({ categories, from, maxResults,
  page, podcastIds, searchBy, searchText, sort }: PodcastQueryParams) => {
  
  const filteredQuery: PodcastQueryParams = {
    ...(from === PV.Filters.from._category ? { categories } : {}),
    ...(from === PV.Filters.from._subscribed ? { podcastId: podcastIds } : {}),
    // If no "from", then from defaults to _allKey
    ...(maxResults ? { maxResults: true } : {}),
    ...(page ? { page } : { page: 1}),
    ...(searchBy === PV.Filters.search.queryParams.podcast ? { searchTitle: encodeURIComponent(searchText) } : {}),
    ...(searchBy === PV.Filters.search.queryParams.host ? { searchAuthor: encodeURIComponent(searchText) } : {}),
    ...(sort ? { sort } : { sort: PV.Filters.sort._topPastDay })
  }

  return request({
    endpoint: PV.RoutePaths.api.podcast,
    method: 'get',
    query: filteredQuery
  })
}

export const getPodcastById = async (id: string) => {
  return request({
    endpoint: `${PV.RoutePaths.api.podcast}/${id}`
  })
}

export const toggleSubscribeToPodcast = async (podcastId: string) => {
  return axios(`${PV.Config.API_BASE_URL}${PV.RoutePaths.api.podcast}${PV.RoutePaths.api.toggle_subscribe}/${podcastId}`, {
    method: 'get',
    withCredentials: true
  })
}
