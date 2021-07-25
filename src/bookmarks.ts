import { writable } from 'svelte/store';

export type BookmarksState = {
	bookmarks: [];
};

const initialState: BookmarksState = {
	bookmarks: [],
};

export const bookmarksStore = writable(initialState);
