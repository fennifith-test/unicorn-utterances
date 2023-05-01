import * as frontmatter from "./get-frontmatter";

describe("utils/get-frontmatter.ts", () => {
	describe("getBabelFrontmatter", () => {
		test("parses an export meta statement", () => {
			const test = `
			export const meta = {
				a: 1,
				b: "2",
			};
			`;

			const meta = frontmatter.getBabelFrontmatter(test);

			expect(meta).toHaveProperty("a");
			expect(meta["a"]).toStrictEqual(1);
			expect(meta).toHaveProperty("b");
			expect(meta["b"]).toStrictEqual("2");
		});
	});
});
