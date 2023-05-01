import { CollectionInfo, PostInfo } from "types/index";
import { Languages } from "types/index";
import { collections, posts } from "./data";
import { getLanguageFromFilename } from "./translations";

export function getPostsByLang(language: Languages): PostInfo[] {
	return posts.filter((p) => p.locale === language);
}

export function getPostsByUnicorn(
	authorId: string,
	language: Languages
): PostInfo[] {
	return getPostsByLang(language).filter((post) =>
		post.authors.find((postAuthor) => postAuthor === authorId)
	);
}

export function getPostsByCollection(
	collection: string,
	language: Languages
): PostInfo[] {
	return getPostsByLang(language)
		.filter((post) => post.collection === collection)
		.sort((postA, postB) => (postA.order > postB.order ? 1 : -1));
}

export function getPostBySourcePath(path: string): PostInfo {
	const lang = getLanguageFromFilename(path);
	const slug = path.split("/").at(-2);
	return posts.find((post) => post.slug === slug && post.locale === lang);
}

export function getCollectionBySourcePath(path: string): CollectionInfo {
	const lang = getLanguageFromFilename(path);
	const slug = path.split("/").at(-2);
	return collections.find(
		(collection) => collection.slug === slug && collection.locale === lang
	);
}
