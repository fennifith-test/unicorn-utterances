import { join } from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import toJs from "ast-to-literal";
import { Languages } from "types/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FrontmatterResult = { lang: Languages; data: any; content: string };

/**
 * Searches for an index.md, index.mdx, or index.astro file
 * and returns the frontmatter object in each locale.
 *
 * @param path the path from the project root to the "index" location
 * @returns the parsed frontmatter(s) of the files
 */
export async function getFrontmatter(
	path: string
): Promise<FrontmatterResult[]> {
	const files = await fs.readdir(path);
	const results: FrontmatterResult[] = [];

	for (const file of files) {
		if (!file.startsWith("index.")) continue;

		let lang = file.split(".").at(-2);
		if (lang === "index") lang = "en";

		if (file.endsWith(".md") || file.endsWith(".mdx")) {
			const markdownIndex = await fs.readFile(join(path, file), "utf8");
			const { data, content } = matter(markdownIndex);

			results.push({
				lang: lang as Languages,
				data,
				content,
			});
		}

		if (file.endsWith(".astro")) {
			const astroIndex = await fs.readFile(join(path, "index.astro"), "utf8");
			const astroIndexMatch = /---\s*\n([\w\W]*)\n---\s*\n/g.exec(astroIndex);
			const frontmatter = astroIndexMatch[1];
			if (!astroIndexMatch || !astroIndexMatch[0] || !frontmatter)
				throw new Error(`Astro file ${path} does not have valid frontmatter!`);

			const data = getBabelFrontmatter(frontmatter);
			if (!data)
				throw new Error(`Astro file ${path} does not define a 'meta' export!`);

			results.push({
				lang: lang as Languages,
				data,
				content: astroIndex.substring(astroIndexMatch[0].length),
			});
		}
	}

	return results;
}

export function getBabelFrontmatter(code: string) {
	const ast = parser.parse(code, {
		sourceType: "module",
		errorRecovery: true,
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let meta: any = null;

	traverse(ast, {
		ExportNamedDeclaration: function ({ node }) {
			const variable = node.declaration;
			if (variable.type !== "VariableDeclaration") return;

			const dec = variable.declarations[0];
			const name = dec.id.type === "Identifier" && dec.id.name;
			if (name !== "meta") return;

			if (dec.init.type !== "ObjectExpression") return;
			meta = toJs(dec.init);
		},
	});

	return meta;
}
