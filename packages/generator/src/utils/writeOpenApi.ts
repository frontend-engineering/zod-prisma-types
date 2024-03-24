import { Spec } from 'comment-parser';
import _ from 'radash';

export function writeOpenApi(openapi: [string, Spec[]]) {
  const [plugin, tags] = openapi;
  const openapiRet = _.objectify(
    tags,
    (f) => f.name,
    (f) => f.default,
  );
  if (plugin === '') return openapiRet;
  return {
    [plugin]: openapiRet,
  };
}
