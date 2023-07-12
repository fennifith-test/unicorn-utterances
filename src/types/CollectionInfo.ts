import { MarkdownInstance } from "astro";
import { Languages } from "types/index";
import { UnicornInfo } from "./UnicornInfo";

export interface RawCollectionInfo {
	title: string;
	description: string;
	authors: string[];
	coverImg: string;
	socialImg?: string;
	type?: "book";
	published: string;
	buttons: Array<{ text: string; url: string }>;
	chapterList?: Array<{
		title: string;
		description: string;
		order: string;
	}>;
}

export interface CollectionInfo extends RawCollectionInfo {
	slug: string;
	locales: Languages[];
	locale: Languages;
	authorsMeta: UnicornInfo[];
	coverImgMeta: {
		// Relative to "public/unicorns"
		relativePath: string;
		// Relative to site root
		relativeServerPath: string;
		// This is not stored, it's generated at build time
		absoluteFSPath: string;
		height: number;
		width: number;
	};
}

export interface ExtendedCollectionInfo extends CollectionInfo {
	Content: MarkdownInstance<never>["Content"];
	contentMeta: string;
	licenseMeta: null;
	publishedMeta: string;
	collectionSlug: null;
	excerpt: string;
	wordCount: number;
}
