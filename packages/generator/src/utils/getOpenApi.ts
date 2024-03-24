import { parse } from 'comment-parser';

// 参考 https://github.com/john-doherty/jsdoc-to-json-schema
// 尽量对齐 https://json-schema.org/understanding-json-schema/index.html
export function getOpenApi(documentation?: string) {
  if (!documentation) return [];

  const comments = parse(`
/**
 ${documentation}
 */`);
  return comments[0].tags.filter((t) => t.tag === 'schema');
}
