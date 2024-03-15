import { parse } from 'comment-parser';

// 参考 https://github.com/john-doherty/jsdoc-to-json-schema
// 尽量对齐 https://json-schema.org/understanding-json-schema/index.html
export function getOpenApi(documentation?: string): Record<string, string> {
  if (!documentation) return {};

  const comments = parse(`
/**
 ${documentation}
 */`);
  if (!Array.isArray(comments[0].tags)) return {};
  const schemaTags = comments[0].tags.filter(
    (t) => t.tag.indexOf('schema.') > -1,
  );
  if (schemaTags.length === 0) return {};
  return schemaTags.reduce<Record<string, string>>((acc, c) => {
    acc[c.tag.replace('schema.', '')] = c.name;
    return acc;
  }, {});
}
