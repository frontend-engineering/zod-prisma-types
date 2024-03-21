import { parse } from 'comment-parser';

// 参考 https://github.com/john-doherty/jsdoc-to-json-schema
// 尽量对齐 https://json-schema.org/understanding-json-schema/index.html
export function getOpenApi(documentation?: string) {
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
  return schemaTags.reduce<Record<string, any>>((acc, c) => {
    const key = c.tag.replace('schema.', '');

    switch (key) {
      case 'display_primary_key':
        acc[key] = c.name === 'true' ? true : c.name === 'false' ? false : null;
        break;
      case 'searchable_columns':
        acc[key] = c.name.split(',');
        break;
      default:
        acc[key] = c.name;
    }
    return acc;
  }, {});
}
