import data from './taksnetJSON/films.json'
import tags from "./taksnetJSON/tags.json";

export const filmsAPI = {
    getMovies() {
        return data
    },
    getTags() {
        return tags
    }
}